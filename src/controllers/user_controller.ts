import { Request, Response } from "express";
import { User } from "../models/user_model";
import { hashPassword } from "../helper_auth/auth";

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
