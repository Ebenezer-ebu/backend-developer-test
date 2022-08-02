"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_session_1 = __importDefault(require("express-session"));
const redis = __importStar(require("redis"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
// configure redis
const redisClient = redis.createClient();
redisClient.connect();
module.exports = (0, express_session_1.default)({
    store: new RedisStore({
        client: redisClient,
        disableTouch: true,
    }),
    secret: "mySecret",
    saveUninitialized: false,
    resave: false,
    name: "sessionId",
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30,
    },
});
