import express from "express";

import {
  createTeam,
  removeTeam,
  editTeam,
  getAllTeams,
  getTeam,
} from "../controllers/team_controller";

import {
  validateCreateTeam,
  validateEditTeam,
} from "../middlewares/validateinput";

import { isAdmin, isUser } from "../middlewares/auth";

const router = express.Router();

/* GET teams listing */
router.post("/add_team", validateCreateTeam, isAdmin, createTeam);
router.delete("/team/:id", isAdmin, removeTeam);
router.put("/team/:id", validateEditTeam, isAdmin, editTeam);
router.get("/teams", isUser, getAllTeams);
router.get("/team/:id", isUser, getTeam);

export = router;
