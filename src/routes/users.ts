import express from "express";

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

/* GET users listing. */
router.post("/admin_signup", validateCreateUser, createAdmin);
router.post("/user_signup", validateCreateUser, createUser);
router.post("/user_login", validateLoginUser, loginUser);

export = router;
