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
exports.getTeam = exports.getAllTeams = exports.editTeam = exports.removeTeam = exports.createTeam = void 0;
const teams_model_1 = require("../models/teams_model");
const app_1 = require("../app");
const createTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { team, coach, players } = req.body;
    try {
        const teamExists = yield teams_model_1.Team.findOne({ team: team.toLowerCase() });
        if (teamExists) {
            return res.status(400).json({ message: "This team already exists" });
        }
        let updatedPlayers = [];
        players.forEach((player) => {
            if (updatedPlayers.indexOf(player.toLowerCase()) === -1) {
                updatedPlayers.push(player.toLowerCase());
            }
        });
        const newTeam = new teams_model_1.Team({
            team: team.toLowerCase(),
            coach: coach.toLowerCase(),
            players: updatedPlayers,
        });
        yield newTeam.save();
        // Delete all from redis store
        yield app_1.redisClient.del("teams:all");
        return res.status(201).json({
            message: `Team ${team} has been added to the database, managed by ${coach}`,
            data: newTeam,
        });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong", error: err });
    }
});
exports.createTeam = createTeam;
const removeTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const team = yield teams_model_1.Team.findByIdAndDelete(id);
        if (!team) {
            return res
                .status(404)
                .json({ message: `Team with id ${id} was not found` });
        }
        // Delete all from redis store
        yield app_1.redisClient.del(`team:${id}`);
        return res
            .status(200)
            .json({ message: `Team with id ${id} was deleted successfully` });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong", error: err });
    }
});
exports.removeTeam = removeTeam;
const editTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { team, coach, players } = req.body;
    const updatePlayers = [];
    players.forEach((player) => {
        if (updatePlayers.indexOf(player) === -1) {
            updatePlayers.push(player.toLowerCase());
        }
    });
    try {
        const teamToEdit = yield teams_model_1.Team.findByIdAndUpdate(id, {
            team: team.toLowerCase(),
            coach: coach.toLowerCase(),
            $addToSet: { players: { $each: updatePlayers } },
        }, { new: true, runValidators: true, context: "query" });
        if (!teamToEdit) {
            return res
                .status(404)
                .json({ message: `Team with id ${id} was not found` });
        }
        // Delete all from redis store
        yield app_1.redisClient.del(`team:${id}`);
        return res.status(201).json({
            message: `Team with id ${id} was edited successfully`,
            data: teamToEdit,
        });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong", error: err });
    }
});
exports.editTeam = editTeam;
const getAllTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheEntry = yield app_1.redisClient.get("teams:all");
        if (cacheEntry) {
            return res.status(200).json(JSON.parse(cacheEntry));
        }
        const teams = yield teams_model_1.Team.find({});
        if (teams.length === 0 || !teams) {
            return res
                .status(200)
                .json({ message: "No teams to display", data: teams });
        }
        // Set data on redis
        app_1.redisClient.setEx("teams:all", 3600, JSON.stringify({ message: "Successful", data: teams }));
        return res.status(200).json({ message: "Successful", data: teams });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong", error: err });
    }
});
exports.getAllTeams = getAllTeams;
const getTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const cacheEntry = yield app_1.redisClient.get(`team:${id}`);
        if (cacheEntry) {
            return res.status(200).json(JSON.parse(cacheEntry));
        }
        const team = yield teams_model_1.Team.findById(id);
        if (!team) {
            return res
                .status(404)
                .json({ message: `Team with id ${id} does not exists` });
        }
        // Set data o reids
        app_1.redisClient.setEx(`team:${id}`, 3600, JSON.stringify({ message: "Successful", data: team }));
        return res.status(200).json({ message: "Successful", data: team });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong", error: err });
    }
});
exports.getTeam = getTeam;
