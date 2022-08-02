import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export interface Payload {
  _id: Types.ObjectId;
  email: string;
  isAdmin: boolean;
};

const saltRounds = process.env.SALT;

export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, Number(saltRounds));
  return hash;
};

export const checkUserPassword = async (
  password: string,
  hashedPassword: string
) => {
  const match = await bcrypt.compare(password, hashedPassword);
  if (match) {
    return true;
  } else {
    return false;
  }
};

export const generateToken = async (payload: Payload, secret: string) => {
  try {
    const token = await jwt.sign(payload, secret, { expiresIn: "1d" });
    return token;
  } catch (err) {
    throw new Error();
  }
};

export const verifyToken = async (token: string, secret: string) => {
  try{
    const decoded = await jwt.verify(token, secret);
    return decoded;
  } catch(err) {
    return null
  }
};
