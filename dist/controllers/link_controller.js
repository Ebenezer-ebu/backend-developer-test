"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFixturesFromLinks = exports.getAllLinks = void 0;
const matches_links_model_1 = require("../models/matches_links_model");
const getAllLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield matches_links_model_1.Link.find({}).populate("fixture");
        return res.status(200).json({ message: "Successful", data });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong", error: err });
    }
});
exports.getAllLinks = getAllLinks;
const getFixturesFromLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link } = req.body;
    try {
        const data = yield matches_links_model_1.Link.find({ link }).populate("fixture");
        if (!data) {
            return res.status(404).json({ message: "No data was found with this link" });
        }
        return res.status(200).json({ message: "Successful", data });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong", error: err });
    }
});
exports.getFixturesFromLinks = getFixturesFromLinks;
