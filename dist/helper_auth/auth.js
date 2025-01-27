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
exports.checkUserPassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const secretKey = process.env.SECRET_KEY;
const saltRounds = process.env.SALT;
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield bcrypt_1.default.hash(password, Number(saltRounds));
        return hash;
    });
}
exports.hashPassword = hashPassword;
function checkUserPassword(password, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        //... fetch user from a db etc.
        const match = yield bcrypt_1.default.compare(password, hashedPassword);
        if (match) {
            //login
            return true;
        }
        else {
            return false;
        }
    });
}
exports.checkUserPassword = checkUserPassword;
// const generateToken = async (payload, secret = secretKey) => {
//   try {
//     const token = await jwt.sign(payload, secret, { expiresIn: "1d" });
//     return token;
//   } catch (err) {
//     console.log(err);
//   }
// };
// const verifyToken = async (token, secret = secretKey) => {
//   const decoded = await jwt.verify(token, secret);
//   return decoded;
// };
module.exports = {
    hashPassword,
    checkUserPassword,
    //   generateToken,
    //   verifyToken,
};
