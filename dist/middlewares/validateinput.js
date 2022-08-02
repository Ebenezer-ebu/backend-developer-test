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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateFixtures = exports.validateEditFixtures = exports.validateEditTeam = exports.validateCreateTeam = exports.validateLoginUser = exports.validateCreateUser = void 0;
const joi_1 = __importDefault(require("joi"));
const validateCreateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const schema = joi_1.default.object({
        name: joi_1.default.string().alphanum().min(3).max(30).required(),
        password: joi_1.default.string()
            .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
            .required(),
        email: joi_1.default.string().email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
        }),
    });
    try {
        const value = yield schema.validateAsync({
            name,
            email,
            password,
        });
        next();
    }
    catch (err) {
        let error = err.details[0].message.replace(/"/g, "");
        return res.status(400).json({ message: "Something went wrong", error });
    }
});
exports.validateCreateUser = validateCreateUser;
const validateLoginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const schema = joi_1.default.object({
        password: joi_1.default.string()
            .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
            .required(),
        email: joi_1.default.string()
            .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
        })
            .required(),
    });
    try {
        const value = yield schema.validateAsync({
            email,
            password,
        });
        next();
    }
    catch (err) {
        let error = err.details[0].message.replace(/"/g, "");
        return res.status(400).json({ message: "Something went wrong", error });
    }
});
exports.validateLoginUser = validateLoginUser;
const validateCreateTeam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { team, coach, players } = req.body;
    const schema = joi_1.default.object({
        team: joi_1.default.string().min(3).max(30).required(),
        coach: joi_1.default.string().min(3).max(30).required(),
        players: joi_1.default.array().items(joi_1.default.string().alphanum().trim(true)).required(),
    });
    try {
        const value = yield schema.validateAsync({
            team,
            coach,
            players,
        });
        if (value) {
            next();
        }
    }
    catch (err) {
        let error = err.details[0].message.replace(/"/g, "");
        return res.status(400).json({ message: "Something went wrong", error });
    }
});
exports.validateCreateTeam = validateCreateTeam;
const validateEditTeam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { team, coach, players } = req.body;
    const schema = joi_1.default.object({
        team: joi_1.default.string().min(3).max(30),
        coach: joi_1.default.string().min(3).max(30),
        players: joi_1.default.array().items(joi_1.default.string().alphanum().trim(true)),
    });
    try {
        const value = yield schema.validateAsync({
            team,
            coach,
            players,
        });
        if (value) {
            next();
        }
    }
    catch (err) {
        let error = err.details[0].message.replace(/"/g, "");
        return res.status(400).json({ message: "Something went wrong", error });
    }
});
exports.validateEditTeam = validateEditTeam;
const validateEditFixtures = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { home_score, away_score, home_scorers, away_scorers } = req.body;
    const schema = joi_1.default.object({
        home_score: joi_1.default.number().required(),
        away_score: joi_1.default.number().required(),
        home_scorers: joi_1.default.array().items(joi_1.default.string().trim(true)),
        away_scorers: joi_1.default.array().items(joi_1.default.string().trim(true)),
    });
    try {
        const value = yield schema.validateAsync({
            home_score,
            away_score,
            home_scorers,
            away_scorers,
        });
        if (home_scorers.length !== home_score ||
            away_scorers.length !== away_score) {
            return res.status(400).json({
                message: "Number of goals scored don't tally with number players that scored",
            });
        }
        if (value) {
            next();
        }
    }
    catch (err) {
        let error = err.details[0].message.replace(/"/g, "");
        return res.status(400).json({ message: "Something went wrong", error });
    }
});
exports.validateEditFixtures = validateEditFixtures;
const validateCreateFixtures = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { home, away } = req.body;
    const schema = joi_1.default.object({
        home: joi_1.default.string().min(3).max(30).required(),
        away: joi_1.default.string().min(3).max(30).required(),
    });
    try {
        const value = yield schema.validateAsync({
            home,
            away,
        });
        if (value) {
            next();
        }
    }
    catch (err) {
        let error = err.details[0].message.replace(/"/g, "");
        return res.status(400).json({ message: "Something went wrong", error });
    }
});
exports.validateCreateFixtures = validateCreateFixtures;
