import { Request, Response } from "express";
import { Match } from "../models/matches_model";
import { Team } from "../models/teams_model";
import { redisClient } from "../app";

export const searchByStatus = async (req: Request, res: Response) => {
  const { status } = req.query;
  try {
    const cacheEntry = await redisClient.get(`status:${status}`);
    if (cacheEntry) {
      return res.status(200).json(JSON.parse(cacheEntry));
    }
    const teamsByStatus = await Match.find({ gameStatus: status });
    if (teamsByStatus.length < 1) {
      return res
        .status(404)
        .json({ message: `No fixtures with ${status} found` });
    }

    // Set data o reids
    redisClient.setEx(
      `status:${status}`,
      600,
      JSON.stringify({ message: "Successful", data: teamsByStatus })
    );

    return res.status(200).json({ message: "Successful", data: teamsByStatus });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

export const searchInTeams = async (req: Request, res: Response) => {
  let team = req.query.team as string;
  let coach = req.query.coach as string;

  try {
    const cacheEntry = await redisClient.get(`status:${team}${coach}`);
    if (cacheEntry) {
      return res.status(200).json(JSON.parse(cacheEntry));
    }

    const teams = await Team.find({
      $or: [{ team: team.toLowerCase() }, { coach: coach.toLowerCase() }],
    });
    if (teams.length < 1) {
      return res.status(404).json({
        message: `No search result from ${team} or ${coach} from teams`,
      });
    }

    // Set data o reids
    redisClient.setEx(
      `status:${team}${coach}`,
      600,
      JSON.stringify({ message: "Success", data: teams })
    );

    return res.status(200).json({ message: "Success", data: teams });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const searchInFixtures = async (req: Request, res: Response) => {
  const { home, away } = req.query;
  try {
    const cacheEntry = await redisClient.get(`status:${home}${away}`);
    if (cacheEntry) {
      return res.status(200).json(JSON.parse(cacheEntry));
    }

    const fixtures = await Match.find({
      $or: [{ home: home }, { away: away }],
    });
    if (fixtures.length < 1) {
      return res.status(404).json({
        message: `No search result from ${home} or ${away} from teams`,
      });
    }

    // Set data o reids
    redisClient.setEx(
      `status:${home}${away}`,
      600,
      JSON.stringify({ message: "Success", data: fixtures })
    );

    return res.status(200).json({ message: "Success", data: fixtures });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
