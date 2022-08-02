"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const teamSchema = new mongoose_1.default.Schema({
    team: { type: String, required: true, unique: true },
    coach: { type: String, required: true },
    players: { type: [String], required: true },
}, { timestamps: true });
exports.Team = mongoose_1.default.models.team || mongoose_1.default.model("team", teamSchema);
