"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const matchLinkSchema = new mongoose_1.default.Schema({
    link: { type: String, required: true, unique: true },
    fixture: { type: mongoose_1.default.Types.ObjectId, required: true, ref: "match" },
}, { timestamps: true });
exports.Link = mongoose_1.default.models.link || mongoose_1.default.model("link", matchLinkSchema);
