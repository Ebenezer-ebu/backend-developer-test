import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { Match } from "../models/matches_model";
import { Team } from "../models/teams_model";
import { Link } from "../models/matches_links_model";
import { redisClient } from "../app";

export const createFixture = async (req: Request, res: Response) => {
  const { home, away } = req.body;
  try {
    const teams = await Team.find({
      team: { $in: [home.toLowerCase(), away.toLowerCase()] },
    });
    if (teams.length <= 1) {
      return res.status(400).json({
        message: "All teams selected for a fixture must exists in the database",
      });
    }
    const fixture = new Match({
      home: home.toLowerCase(),
      away: away.toLowerCase(),
    });
    fixture.save();

    // Delete all from redis store
    await redisClient.del("fixtures:all");

    const link = new Link({
      link: nanoid(),
      fixture: fixture._id,
    });
    link.save();

    return res
      .status(201)
      .json({ message: "Fixture was created successfully", data: fixture });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

export const deleteFixture = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const fixture = await Match.findByIdAndDelete(id);
    if (!fixture) {
      return res
        .status(404)
        .json({ message: `Fixture with id ${id} was not found` });
    }

    // Delete all from redis store
    await redisClient.del(`fixture:${id}`);

    return res
      .status(200)
      .json({ message: `Fixture with id ${id} was deleted successfully` });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

export const editFixture = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { home_score, away_score, home_scorers, away_scorers } = req.body;
  try {
    const checkFixtures = await Match.findById(id);
    if (checkFixtures) {
      let home = checkFixtures.home;
      let away = checkFixtures.away;
      const teams = await Team.find({ team: { $in: [home, away] } });

      let homePlayers: boolean = true;
      let awayPlayers: boolean = true;
      teams.forEach((host) => {
        if (host.team === home) {
          homePlayers = home_scorers.every((el: string) =>
            host.players.includes(el.toLowerCase())
          );
        } else if (host.team === away) {
          awayPlayers = away_scorers.every((el: string) =>
            host.players.includes(el.toLowerCase())
          );
        }
      });

      if (!homePlayers || !awayPlayers) {
        return res.status(400).json({
          message:
            "Make sure scorers exists as team memebers in the away or home teams",
        });
      }
    }

    const matchToEdit = await Match.findByIdAndUpdate(
      id,
      {
        $inc: { home_score: home_score, away_score: away_score },
        $push: {
          home_scorers: { $each: home_scorers },
          away_scorers: { $each: away_scorers },
        },
        gameStatus: "completed",
      },
      { new: true, runValidators: true, context: "query" }
    );

    if (!matchToEdit) {
      return res
        .status(404)
        .json({ message: `Match fixture with id ${id} was not found` });
    }

    // Delete all from redis store
    await redisClient.del(`fixture:${id}`);

    return res.status(201).json({
      message: "Match fixture updated successfully",
      data: matchToEdit,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

export const getAllFixtures = async (req: Request, res: Response) => {
  try {
    const cacheEntry = await redisClient.get("fixtures:all");
    if (cacheEntry) {
      return res.status(200).json(JSON.parse(cacheEntry));
    }
    const matches = await Match.find({});
    if (matches.length === 0 || !matches) {
      return res
        .status(200)
        .json({ message: "No match fixtures to display", data: matches });
    }

    // Set data on redis
    redisClient.setEx(
      "fixtures:all",
      3600,
      JSON.stringify({ message: "Successful", data: matches })
    );

    return res.status(200).json({ message: "Successful", data: matches });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

export const getFixture = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cacheEntry = await redisClient.get(`fixture:${id}`);
    if (cacheEntry) {
      return res.status(200).json(JSON.parse(cacheEntry));
    }

    const match = await Match.findById(id);
    if (!match) {
      return res
        .status(404)
        .json({ message: `Match fixture with id ${id} does not exists` });
    }
    // Set data o reids
    redisClient.setEx(
      `fixture:${id}`,
      3600,
      JSON.stringify({ message: "Successful", data: match })
    );

    return res.status(200).json({ message: "Successful", data: match });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};
