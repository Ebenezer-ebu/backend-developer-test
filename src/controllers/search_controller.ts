import { Request, Response } from "express";
import { Match } from "../models/matches_model";
import { Team } from "../models/teams_model";

export const searchByStatus = async (req: Request, res: Response) => {
  const { status } = req.query;
  try {
    const teamsByStatus = await Match.find({ gameStatus: status });
    if (teamsByStatus.length < 1) {
      return res.status(404).json({ message: `No team with ${status} found` });
    }
    return res.status(200).json({ message: "Successful", data: teamsByStatus });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

export const searchInTeams = async (req: Request, res: Response) => {
  const { team, coach } = req.query;
  try {
    const teams = await Team.find({
      $or: [{ team: team }, { coach: coach }],
    });
    if (teams.length < 1) {
      return res.status(404).json({
        message: `No search result from ${team} or ${coach} from teams`,
      });
    }
    return res.status(200).json({ message: "Success", data: teams });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const searchInFixtures = async (req: Request, res: Response) => {
  const { home, away } = req.query;
  try {
    const fixtures = await Match.find({
      $or: [{ home: home }, { away: away }],
    });
    if (fixtures.length < 1) {
      return res.status(404).json({
        message: `No search result from ${home} or ${away} from teams`,
      });
    }
    return res.status(200).json({ message: "Success", data: fixtures });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
