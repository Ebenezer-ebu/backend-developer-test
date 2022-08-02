import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

export const Match = mongoose.models.match || mongoose.model("match", matchSchema);
