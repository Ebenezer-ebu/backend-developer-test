import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    team: { type: String, required: true, unique: true },
    coach: { type: String, required: true },
    players: { type: [String], required: true },
  },
  { timestamps: true }
);

export const Team = mongoose.models.team || mongoose.model("team", teamSchema);
