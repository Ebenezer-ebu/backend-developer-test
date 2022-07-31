"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// interface IMatch {
//   home: string;
//   home_score: number;
//   away: string;
//   away_score: number;
//   home_scorers: string[];
//   away_scorers: string[];
//   gameStatus: string
// }
// interface MatchDoc extends mongoose.Document {
//   home: string;
//   home_score: number;
//   away: string;
//   away_score: number;
//   home_scorers: string[];
//   away_scorers: string[];
//   gameStatus: string;
// }
// interface MatchModel extends mongoose.Model<MatchDoc> {
//   build(attrs: IMatch): MatchDoc;
// }
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
exports.Match = mongoose_1.default.model("match", matchSchema);
