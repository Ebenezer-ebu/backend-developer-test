import express from "express";

import {
  createFixture,
  deleteFixture,
  editFixture,
  getAllFixtures,
  getFixture,
} from "../controllers/fixture_controller";

import {
  validateCreateFixtures,
  validateEditFixtures,
} from "../middlewares/validateinput";

import { isAdmin, isUser } from "../middlewares/auth";

const router = express.Router();

/* GET teams listing */
router.post("/add_fixture", validateCreateFixtures, isAdmin, createFixture);
router.delete("/fixture/:id", isAdmin, deleteFixture);
router.put("/fixture/:id", validateEditFixtures, isAdmin, editFixture);
router.get("/fixtures", isUser, getAllFixtures);
router.get("/fixture/:id", isUser, getFixture);

export = router;
