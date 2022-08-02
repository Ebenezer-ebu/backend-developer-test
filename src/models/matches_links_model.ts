import mongoose from "mongoose";

const matchLinkSchema = new mongoose.Schema(
  {
    link: { type: String, required: true, unique: true },
    fixture: { type: mongoose.Types.ObjectId, required: true, ref: "match" },
  },
  { timestamps: true }
);

export const Link = mongoose.models.link || mongoose.model("link", matchLinkSchema);
