"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const team_controller_1 = require("../controllers/team_controller");
const validateinput_1 = require("../middlewares/validateinput");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
/* GET teams listing */
router.post("/add_team", validateinput_1.validateCreateTeam, auth_1.isAdmin, team_controller_1.createTeam);
router.delete("/team/:id", auth_1.isAdmin, team_controller_1.removeTeam);
router.put("/team/:id", validateinput_1.validateEditTeam, auth_1.isAdmin, team_controller_1.editTeam);
router.get("/teams", auth_1.isUser, team_controller_1.getAllTeams);
router.get("/team/:id", auth_1.isUser, team_controller_1.getTeam);
module.exports = router;
