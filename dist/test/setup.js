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
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
let mongo;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    process.env.SECRET_KEY = "JEjdedkddw";
    process.env.SALT = "10";
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    mongo = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    yield mongoose_1.default.connect(mongoUri);
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    jest.clearAllMocks();
    const collections = yield mongoose_1.default.connection.db.collections();
    for (let collection of collections) {
        yield collection.deleteMany({});
    }
}));
// afterAll(async () => {
//   await mongo.stop();
//   await mongoose.connection.close();
// })
global.signin = () => __awaiter(void 0, void 0, void 0, function* () {
    const name = "Test";
    const email = "test@test.com";
    const password = "password";
    const response = yield (0, supertest_1.default)(app_1.app)
        .post("/users/admin_signup")
        .send({ name, email, password })
        .expect(201);
    const response2 = yield (0, supertest_1.default)(app_1.app)
        .post("/users/user_login")
        .send({ email, password })
        .expect(200);
    const token = response2.body.token;
    return token;
});
