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
exports.getFixture = exports.getAllFixtures = exports.editFixture = exports.deleteFixture = exports.createFixture = void 0;
const nanoid_1 = require("nanoid");
const matches_model_1 = require("../models/matches_model");
const teams_model_1 = require("../models/teams_model");
const matches_links_model_1 = require("../models/matches_links_model");
const createFixture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { home, away } = req.body;
    try {
        const teams = yield teams_model_1.Team.find({
            team: { $in: [home, away] },
        });
        if (teams.length <= 1) {
            return res.status(400).json({
                message: "All teams selected for a fixture must exists in the database",
            });
        }
        const fixture = new matches_model_1.Match({
            home,
            away,
        });
        fixture.save();
        const link = new matches_links_model_1.Link({
            link: (0, nanoid_1.nanoid)(),
            fixture: fixture._id,
        });
        link.save();
        return res
            .status(201)
            .json({ message: "Fixture was created successfully", data: fixture });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong", error: err });
    }
});
exports.createFixture = createFixture;
const deleteFixture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const fixture = yield matches_model_1.Match.findByIdAndDelete(id);
        if (!fixture) {
            return res
                .status(404)
                .json({ message: `Fixture with id ${id} was not found` });
        }
        return res
            .status(200)
            .json({ message: `Fixture with id ${id} was deleted successfully` });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong", error: err });
    }
});
exports.deleteFixture = deleteFixture;
const editFixture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { home_score, away_score, home_scorers, away_scorers } = req.body;
    try {
        const checkFixtures = yield matches_model_1.Match.findById(id);
        if (checkFixtures) {
            let home = checkFixtures.home;
            let away = checkFixtures.away;
            const teams = yield teams_model_1.Team.find({ team: { $in: [home, away] } });
            let homePlayers = [];
            let awayPlayers = [];
            teams.forEach((host) => {
                if (host.team === home) {
                    homePlayers = home_scorers.every((el) => host.players.includes(el));
                }
                else if (host.team === away) {
                    awayPlayers = away_scorers.every((el) => host.players.includes(el));
                }
            });
            if (homePlayers.includes(false) || awayPlayers.includes(false)) {
                return res.status(400).json({
                    message: "Make sure scorers exists as team memebers in the away or home teams",
                });
            }
        }
        const matchToEdit = yield matches_model_1.Match.findByIdAndUpdate(id, {
            home_score,
            away_score,
            $push: {
                home_scorers: { $each: home_scorers },
                away_scorers: { $each: away_scorers },
            },
            gameStatus: "completed",
        }, { new: true, runValidators: true, context: "query" });
        if (!matchToEdit) {
            return res
                .status(404)
                .json({ message: `Match fixture with id ${id} was not found` });
        }
        return res.status(201).json({
            message: "Match fiture updated successfully",
            data: matchToEdit,
        });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong", error: err });
    }
});
exports.editFixture = editFixture;
const getAllFixtures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const matches = yield matches_model_1.Match.find({});
        if (matches.length === 0 || !matches) {
            return res
                .status(200)
                .json({ message: "No match fixtures to display", data: matches });
        }
        return res.status(200).json({ message: "Successful", data: matches });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong", error: err });
    }
});
exports.getAllFixtures = getAllFixtures;
const getFixture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const match = yield matches_model_1.Match.findById(id);
        if (!match) {
            return res
                .status(404)
                .json({ message: `Match fixture with id ${id} does not exists` });
        }
        return res.status(200).json({ message: "Successful", data: match });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong", error: err });
    }
});
exports.getFixture = getFixture;
