import { Request, Response } from "express";
import { User } from "../models/user_model";
import {
  hashPassword,
  checkUserPassword,
  generateToken,
} from "../helper_auth/auth";

const secretKey = process.env.SECRET_KEY;

export const createAdmin = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const adminExists = await User.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await hashPassword(password);
    const admin = new User({
      name,
      email,
      password: hash,
      isAdmin: true,
    });
    admin.save();
    return res
      .status(201)
      .json({ message: "Admin created successfully", data: admin });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await hashPassword(password);
    const user = new User({
      name,
      email,
      password: hash,
    });
    user.save();

    return res
      .status(201)
      .json({ message: "User created successfully", data: user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const validPassword = await checkUserPassword(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const { _id, email, isAdmin } = user;
      const token = await generateToken(
        { _id, email, isAdmin },
        process.env.SECRET_KEY!
      );

      // Store it on session object
      req.session.user = { id: _id, email, isAdmin };

      return res.status(200).json({
        message: "Login successful",
        token,
      });
    } else {
      return res.status(404).json({ message: "User does not exists" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};
