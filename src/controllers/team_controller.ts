import { Request, Response } from "express";
import { Team } from "../models/teams_model";
import { redisClient } from "../app";

export const createTeam = async (req: Request, res: Response) => {
  const { team, coach, players } = req.body;
  try {
    const teamExists = await Team.findOne({ team: team.toLowerCase() });
    if (teamExists) {
      return res.status(400).json({ message: "This team already exists" });
    }

    let updatedPlayers: string[] = [];
    players.forEach((player: string) => {
      if (updatedPlayers.indexOf(player.toLowerCase()) === -1) {
        updatedPlayers.push(player.toLowerCase());
      }
    });

    const newTeam = new Team({
      team: team.toLowerCase(),
      coach: coach.toLowerCase(),
      players: updatedPlayers,
    });

    await newTeam.save();
    // Delete all from redis store
    await redisClient.del("teams:all");

    return res.status(201).json({
      message: `Team ${team} has been added to the database, managed by ${coach}`,
      data: newTeam,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

export const removeTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const team = await Team.findByIdAndDelete(id);
    if (!team) {
      return res
        .status(404)
        .json({ message: `Team with id ${id} was not found` });
    }

    // Delete all from redis store
    await redisClient.del(`team:${id}`);

    return res
      .status(200)
      .json({ message: `Team with id ${id} was deleted successfully` });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

export const editTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { team, coach, players } = req.body;

  const updatePlayers: string[] = [];
  players.forEach((player: string) => {
    if (updatePlayers.indexOf(player) === -1) {
      updatePlayers.push(player.toLowerCase());
    }
  });

  try {
    const teamToEdit = await Team.findByIdAndUpdate(
      id,
      {
        team: team.toLowerCase(),
        coach: coach.toLowerCase(),
        $addToSet: { players: { $each: updatePlayers } },
      },
      { new: true, runValidators: true, context: "query" }
    );
    if (!teamToEdit) {
      return res
        .status(404)
        .json({ message: `Team with id ${id} was not found` });
    }

    // Delete all from redis store
    await redisClient.del(`team:${id}`);

    return res.status(201).json({
      message: `Team with id ${id} was edited successfully`,
      data: teamToEdit,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

export const getAllTeams = async (req: Request, res: Response) => {
  try {
    const cacheEntry = await redisClient.get("teams:all");
    if (cacheEntry) {
      return res.status(200).json(JSON.parse(cacheEntry));
    }
    const teams = await Team.find({});
    if (teams.length === 0 || !teams) {
      return res
        .status(200)
        .json({ message: "No teams to display", data: teams });
    }

    // Set data on redis
    redisClient.setEx(
      "teams:all",
      3600,
      JSON.stringify({ message: "Successful", data: teams })
    );

    return res.status(200).json({ message: "Successful", data: teams });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

export const getTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cacheEntry = await redisClient.get(`team:${id}`);
    if (cacheEntry) {
      return res.status(200).json(JSON.parse(cacheEntry));
    }

    const team = await Team.findById(id);
    if (!team) {
      return res
        .status(404)
        .json({ message: `Team with id ${id} does not exists` });
    }

    // Set data o reids
    redisClient.setEx(
      `team:${id}`,
      3600,
      JSON.stringify({ message: "Successful", data: team })
    );

    return res.status(200).json({ message: "Successful", data: team });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};
