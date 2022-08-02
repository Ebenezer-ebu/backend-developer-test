import express from "express";

import { isUser } from "../middlewares/auth";
import {
  getAllLinks,
  getFixturesFromLinks,
} from "../controllers/link_controller";

const router = express.Router();

router.get("/getlinks", isUser, getAllLinks);
router.get("/link", isUser, getFixturesFromLinks);

export = router;
