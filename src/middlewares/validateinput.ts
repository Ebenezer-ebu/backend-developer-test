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
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
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
    next();
  } catch (err) {
    let error = err.details[0].message.replace(/"/g, "");
    return res.status(400).json({ message: "Something went wrong", error });
  }
};

export const validateLoginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
  });

  try {
    const value = await schema.validateAsync({
      email,
      password,
    });
    next();
  } catch (err) {
    let error = err.details[0].message.replace(/"/g, "");
    return res.status(400).json({ message: "Something went wrong", error });
  }
};

export const validateCreateTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { team, coach, players } = req.body;
  const schema = Joi.object({
    team: Joi.string().min(3).max(30).required(),
    coach: Joi.string().min(3).max(30).required(),
    players: Joi.array().items(Joi.string().alphanum().trim(true)).required(),
  });

  try {
    const value = await schema.validateAsync({
      team,
      coach,
      players,
    });
    if (value) {
      next();
    }
  } catch (err) {
    let error = err.details[0].message.replace(/"/g, "");
    return res.status(400).json({ message: "Something went wrong", error });
  }
};

export const validateEditTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { team, coach, players } = req.body;
  const schema = Joi.object({
    team: Joi.string().min(3).max(30),
    coach: Joi.string().min(3).max(30),
    players: Joi.array().items(Joi.string().alphanum().trim(true)),
  });

  try {
    const value = await schema.validateAsync({
      team,
      coach,
      players,
    });
    if (value) {
      next();
    }
  } catch (err) {
    let error = err.details[0].message.replace(/"/g, "");
    return res.status(400).json({ message: "Something went wrong", error });
  }
};

export const validateEditFixtures = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { home_score, away_score, home_scorers, away_scorers } = req.body;
  const schema = Joi.object({
    home_score: Joi.number().required(),
    away_score: Joi.number().required(),
    home_scorers: Joi.array().items(Joi.string().trim(true)),
    away_scorers: Joi.array().items(Joi.string().trim(true)),
  });

  try {
    const value = await schema.validateAsync({
      home_score,
      away_score,
      home_scorers,
      away_scorers,
    });
    if (
      home_scorers.length !== home_score ||
      away_scorers.length !== away_score
    ) {
      return res.status(400).json({
        message:
          "Number of goals scored don't tally with number players that scored",
      });
    }
    if (value) {
      next();
    }
  } catch (err) {
    let error = err.details[0].message.replace(/"/g, "");
    return res.status(400).json({ message: "Something went wrong", error });
  }
};

export const validateCreateFixtures = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { home, away } = req.body;
  const schema = Joi.object({
    home: Joi.string().min(3).max(30).required(),
    away: Joi.string().min(3).max(30).required(),
  });

  try {
    const value = await schema.validateAsync({
      home,
      away,
    });
    if (value) {
      next();
    }
  } catch (err) {
    let error = err.details[0].message.replace(/"/g, "");
    return res.status(400).json({ message: "Something went wrong", error });
  }
};
