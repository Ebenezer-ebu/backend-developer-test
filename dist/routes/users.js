"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user_controller");
const validateinput_1 = require("../middlewares/validateinput");
const router = express_1.default.Router();
/* GET users listing. */
router.post("/admin_signup", validateinput_1.validateCreateUser, user_controller_1.createAdmin);
router.post("/user_signup", validateinput_1.validateCreateUser, user_controller_1.createUser);
module.exports = router;
