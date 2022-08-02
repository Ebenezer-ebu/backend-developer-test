"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const user_controller_1 = require("../controllers/user_controller");
const validateinput_1 = require("../middlewares/validateinput");
const router = express_1.default.Router();
const limitAccess = (0, express_rate_limit_1.default)({
    max: process.env.NODE_ENV === "test" ? 10 : 1,
    windowMs: 15000,
    message: "Too many login attempts, Try after 15 seconds",
});
/* GET users listing. */
router.post("/admin_signup", validateinput_1.validateCreateUser, user_controller_1.createAdmin);
router.post("/user_signup", validateinput_1.validateCreateUser, user_controller_1.createUser);
router.post("/user_login", limitAccess, validateinput_1.validateLoginUser, user_controller_1.loginUser);
module.exports = router;
