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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app");
it("returns a 201 on successful sign up", () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, supertest_1.default)(app_1.app)
        .post("/users/admin_signup")
        .send({
        name: "Admin",
        email: "test@test.com",
        password: "password",
    })
        .expect(201);
}));
it("returns a 201 on successful sign up", () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, supertest_1.default)(app_1.app)
        .post("/users/user_signup")
        .send({
        name: "user",
        email: "test@test.com",
        password: "password",
    })
        .expect(201);
}));
it("returns a 400 with an invalid email", () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, supertest_1.default)(app_1.app)
        .post("/users/admin_signup")
        .send({
        email: "hedjefefjekf",
        password: "password",
    })
        .expect(400);
}));
it("returns a 400 with an invalid password", () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app_1.app)
        .post("/users/admin_signup")
        .send({
        password: "pa",
    })
        .expect(400);
}));
it("disallows duplicate emails", () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app_1.app)
        .post("/users/user_signup")
        .send({
        name: "user",
        email: "test@test.com",
        password: "password",
    })
        .expect(201);
    yield (0, supertest_1.default)(app_1.app)
        .post("/users/user_signup")
        .send({
        name: "user",
        email: "test@test.com",
        password: "password",
    })
        .expect(400);
}));
it("sets a cookie after successful signup", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, supertest_1.default)(app_1.app)
        .post("/users/user_signup")
        .send({
        name: "user",
        email: "test@test.com",
        password: "password",
    })
        .expect(201);
    expect(response.body.message).toBe("User created successfully");
}));
it("returns a 200 on successful login", () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app_1.app)
        .post("/users/user_signup")
        .send({
        name: "user",
        email: "test@test.com",
        password: "password",
    })
        .expect(201);
    const response = yield (0, supertest_1.default)(app_1.app)
        .post("/users/user_login")
        .send({
        email: "test@test.com",
        password: "password",
    })
        .expect(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("token");
}));
