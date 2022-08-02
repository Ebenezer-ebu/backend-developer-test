"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const search_controller_1 = require("../controllers/search_controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Search like so /status_search?status="pending" || /status_search?status="completed"
router.get("/status_search", auth_1.isUser, search_controller_1.searchByStatus);
// Search like so /teams_search?team=chelsea&coach="Anold"
router.get("/teams_search", search_controller_1.searchInTeams);
// Search like so /fixtures_search?home=man city&away=chelsea
router.get("/fixtures_search", search_controller_1.searchInFixtures);
module.exports = router;
