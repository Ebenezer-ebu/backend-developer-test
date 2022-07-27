import express from "express";

import { createAdmin, createUser } from "../controllers/user_controller";
import { validateCreateUser } from "../middlewares/validateinput";

const router = express.Router();

/* GET users listing. */
router.post("/admin_signup", validateCreateUser, createAdmin);
router.post("/user_signup", validateCreateUser, createUser);


export = router;
