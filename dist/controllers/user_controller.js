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
exports.loginUser = exports.createUser = exports.createAdmin = void 0;
const user_model_1 = require("../models/user_model");
const auth_1 = require("../helper_auth/auth");
const secretKey = process.env.SECRET_KEY;
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const adminExists = yield user_model_1.User.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hash = yield (0, auth_1.hashPassword)(password);
        const admin = new user_model_1.User({
            name,
            email,
            password: hash,
            isAdmin: true,
        });
        admin.save();
        return res
            .status(201)
            .json({ message: "Admin created successfully", data: admin });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.createAdmin = createAdmin;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const userExists = yield user_model_1.User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hash = yield (0, auth_1.hashPassword)(password);
        const user = new user_model_1.User({
            name,
            email,
            password: hash,
        });
        user.save();
        return res
            .status(201)
            .json({ message: "User created successfully", data: user });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_model_1.User.findOne({ email });
        if (user) {
            const validPassword = yield (0, auth_1.checkUserPassword)(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: "Invalid credentials" });
            }
            const { _id, email, isAdmin } = user;
            const token = yield (0, auth_1.generateToken)({ _id, email, isAdmin }, process.env.SECRET_KEY);
            // Store it on session object
            req.session.user = { id: _id, email, isAdmin };
            return res.status(200).json({
                message: "Login successful",
                token,
            });
        }
        else {
            return res.status(404).json({ message: "User does not exists" });
        }
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong", error: err });
    }
});
exports.loginUser = loginUser;
