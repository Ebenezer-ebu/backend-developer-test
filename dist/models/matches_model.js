"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const matchSchema = new mongoose_1.default.Schema({
    home: { type: String, required: true },
    home_score: { type: Number, default: 0 },
    away: { type: String, required: true },
    away_score: { type: Number, default: 0 },
    home_scorers: { type: [String] },
    away_scorers: { type: [String] },
    gameStatus: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
    },
}, { timestamps: true });
exports.Match = mongoose_1.default.models.match || mongoose_1.default.model("match", matchSchema);
