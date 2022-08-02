import express from "express";

import {
  searchByStatus,
  searchInTeams,
  searchInFixtures,
} from "../controllers/search_controller";

import { isUser } from "../middlewares/auth";

const router = express.Router();

// Search like so /status_search?status="pending" || /status_search?status="completed"
router.get("/status_search", isUser, searchByStatus);

// Search like so /teams_search?team=chelsea&coach="Anold"
router.get("/teams_search", searchInTeams);

// Search like so /fixtures_search?home=man city&away=chelsea
router.get("/fixtures_search", searchInFixtures);

export = router;
