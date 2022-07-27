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
exports.validateCreateUser = void 0;
const joi_1 = __importDefault(require("joi"));
const validateCreateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const schema = joi_1.default.object({
        name: joi_1.default.string().alphanum().min(3).max(30).required(),
        password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
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
        console.log(value);
        next();
    }
    catch (err) {
        let error = err.details[0].message.replace(/"/g, "");
        return res.status(400).json({ message: "Invalid signup details", error });
    }
});
exports.validateCreateUser = validateCreateUser;
