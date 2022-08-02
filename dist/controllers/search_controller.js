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
exports.searchInFixtures = exports.searchInTeams = exports.searchByStatus = void 0;
const matches_model_1 = require("../models/matches_model");
const teams_model_1 = require("../models/teams_model");
const app_1 = require("../app");
const searchByStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.query;
    try {
        const cacheEntry = yield app_1.redisClient.get(`status:${status}`);
        if (cacheEntry) {
            return res.status(200).json(JSON.parse(cacheEntry));
        }
        const teamsByStatus = yield matches_model_1.Match.find({ gameStatus: status });
        if (teamsByStatus.length < 1) {
            return res
                .status(404)
                .json({ message: `No fixtures with ${status} found` });
        }
        // Set data o reids
        app_1.redisClient.setEx(`status:${status}`, 600, JSON.stringify({ message: "Successful", data: teamsByStatus }));
        return res.status(200).json({ message: "Successful", data: teamsByStatus });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong", error: err });
    }
});
exports.searchByStatus = searchByStatus;
const searchInTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let team = req.query.team;
    let coach = req.query.coach;
    try {
        const cacheEntry = yield app_1.redisClient.get(`status:${team}${coach}`);
        if (cacheEntry) {
            return res.status(200).json(JSON.parse(cacheEntry));
        }
        const teams = yield teams_model_1.Team.find({
            $or: [{ team: team.toLowerCase() }, { coach: coach.toLowerCase() }],
        });
        if (teams.length < 1) {
            return res.status(404).json({
                message: `No search result from ${team} or ${coach} from teams`,
            });
        }
        // Set data o reids
        app_1.redisClient.setEx(`status:${team}${coach}`, 600, JSON.stringify({ message: "Success", data: teams }));
        return res.status(200).json({ message: "Success", data: teams });
    }
    catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.searchInTeams = searchInTeams;
const searchInFixtures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { home, away } = req.query;
    try {
        const cacheEntry = yield app_1.redisClient.get(`status:${home}${away}`);
        if (cacheEntry) {
            return res.status(200).json(JSON.parse(cacheEntry));
        }
        const fixtures = yield matches_model_1.Match.find({
            $or: [{ home: home }, { away: away }],
        });
        if (fixtures.length < 1) {
            return res.status(404).json({
                message: `No search result from ${home} or ${away} from teams`,
            });
        }
        // Set data o reids
        app_1.redisClient.setEx(`status:${home}${away}`, 600, JSON.stringify({ message: "Success", data: fixtures }));
        return res.status(200).json({ message: "Success", data: fixtures });
    }
    catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.searchInFixtures = searchInFixtures;
