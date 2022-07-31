import { Request, Response } from "express";
import { Team } from "../models/teams_model";

export const createTeam = async (req: Request, res: Response) => {
  const { team, coach, players } = req.body;
  try {
    const teamExists = await Team.findOne(team);
    if (teamExists) {
      return res.status(400).json({ message: "This team already exists" });
    }

    const newTeam = new Team({
      team,
      coach,
      players,
    });
    newTeam.save();
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
  const { id } = req.body;
  try {
    const team = await Team.findByIdAndDelete(id);
    if (!team) {
      return res
        .status(404)
        .json({ message: `Team with id ${id} was not found` });
    }
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
  try {
    const teamToEdit = await Team.findByIdAndUpdate(
      id,
      {
        team,
        coach,
        $push: { players: { $each: players } },
      },
      { new: true, runValidators: true, context: "query" }
    );
    if (!teamToEdit) {
      return res
        .status(404)
        .json({ message: `Team with id ${id} was not found` });
    }
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
    const teams = await Team.find({});
    if (teams.length === 0 || !teams) {
      return res
        .status(200)
        .json({ message: "No teams to display", data: teams });
    }
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
    const team = await Team.findById(id);
    if (!team) {
      return res
        .status(404)
        .json({ message: `Team with id ${id} does not exists` });
    }
    return res.status(200).json({ message: "Successful", data: team });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};
