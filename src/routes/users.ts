import express from "express";
import rateLimit from "express-rate-limit";

import {
  createAdmin,
  createUser,
  loginUser,
} from "../controllers/user_controller";
import {
  validateCreateUser,
  validateLoginUser,
} from "../middlewares/validateinput";

const router = express.Router();

const limitAccess = rateLimit({
  max: process.env.NODE_ENV === "test" ? 10 : 1,
  windowMs: 15000,
  message: "Too many login attempts, Try after 15 seconds",
});

/* GET users listing. */
router.post("/admin_signup", validateCreateUser, createAdmin);
router.post("/user_signup", validateCreateUser, createUser);
router.post("/user_login", limitAccess, validateLoginUser, loginUser);

export = router;
