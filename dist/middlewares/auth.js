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
exports.isUser = exports.isAdmin = void 0;
const auth_1 = require("../helper_auth/auth");
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            throw new Error("No token");
        }
        const decoded = (yield (0, auth_1.verifyToken)(token, process.env.SECRET_KEY));
        if (!decoded.isAdmin) {
            throw "You are not authorized to view this";
        }
        next();
    }
    catch (err) {
        return res.status(401).json({
            message: "No token or Invalid / expired token provided!",
            error: err,
        });
    }
});
exports.isAdmin = isAdmin;
const isUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            throw new Error("No token");
        }
        const decoded = (yield (0, auth_1.verifyToken)(token, process.env.SECRET_KEY));
        if (decoded) {
            next();
            return;
        }
        throw "You are not a user to view this";
    }
    catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token provided!",
            error: err,
        });
    }
});
exports.isUser = isUser;
