"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const link_controller_1 = require("../controllers/link_controller");
const router = express_1.default.Router();
router.get("/getlinks", auth_1.isUser, link_controller_1.getAllLinks);
router.get("/link", auth_1.isUser, link_controller_1.getFixturesFromLinks);
module.exports = router;
