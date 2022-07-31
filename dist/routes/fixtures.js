"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const fixture_controller_1 = require("../controllers/fixture_controller");
const validateinput_1 = require("../middlewares/validateinput");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
/* GET teams listing */
router.post("/add_fixture", validateinput_1.validateCreateFixtures, auth_1.isAdmin, fixture_controller_1.createFixture);
router.delete("/fixture/:id", auth_1.isAdmin, fixture_controller_1.deleteFixture);
router.put("/fixture/:id", validateinput_1.validateEditFixtures, auth_1.isAdmin, fixture_controller_1.editFixture);
router.get("/fixtures", auth_1.isUser, fixture_controller_1.getAllFixtures);
router.get("/fixture/:id", auth_1.isUser, fixture_controller_1.getFixture);
module.exports = router;
