import { Request, Response, NextFunction } from "express";

import Joi from "joi";

interface IError {
  error: { details: [message: string] };
}

export const validateCreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  });

  try {
    const value = await schema.validateAsync({
      name,
      email,
      password,
    });
      console.log(value);
      next();
  } catch (err) {
    let error = err.details[0].message.replace(/"/g, "");
    return res.status(400).json({ message: "Invalid signup details", error });
  }
};
