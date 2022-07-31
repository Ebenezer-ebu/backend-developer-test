import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helper_auth/auth";
import { Payload } from "../helper_auth/auth";

const secretKey = process.env.SECRET_KEY;

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization!.split(" ")[1];
    if (!token) {
      throw new Error("No token");
    }
    const decoded = (await verifyToken(token, secretKey!)) as Payload;
    if (decoded.isAdmin) {
      next();
      return;
    }
    throw new Error("You are not authorized to view this");
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token provided!",
      error: err,
    });
  }
};

export const isUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization!.split(" ")[1];
    if (!token) {
      throw new Error("No token");
    }
    const decoded = (await verifyToken(token, secretKey!)) as Payload;
    if (decoded) {
      next();
      return;
    }
    throw new Error("You are not a user to view this");
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token provided!",
      error: err,
    });
  }
};
