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
it("response with a 201 for a created team by an Admin", () => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield global.signin();
    const response = yield (0, supertest_1.default)(app_1.app)
        .post("/add_team")
        .set("Authorization", `Bearer ${token}`)
        .send({
        team: "Man Utd",
        coach: "Bonds",
        players: ["Anold", "kelvin", "Bond", "kurt"],
    })
        .expect(201);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("data");
    expect(response.body.message).toBe("Team Man Utd has been added to the database, managed by Bonds");
    expect(response.body.data.players).toEqual(["Anold", "kelvin", "Bond", "kurt"].map((el) => el.toLowerCase()));
}));
it("response with a 400 for a failure due to invalid data missing a property", () => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield global.signin();
    yield (0, supertest_1.default)(app_1.app)
        .post("/add_team")
        .set("Authorization", `Bearer ${token}`)
        .send({
        team: "Man Utd",
        players: ["Anold", "kelvin", "Bond", "kurt"],
    })
        .expect(400);
}));
it("Delete a team by the id", () => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield global.signin();
    const response = yield (0, supertest_1.default)(app_1.app)
        .post("/add_team")
        .set("Authorization", `Bearer ${token}`)
        .send({
        team: "Man Utd",
        coach: "Bonds",
        players: ["Anold", "kelvin", "Bond", "kurt"],
    })
        .expect(201);
    const id = response.body.data._id;
    const res = yield (0, supertest_1.default)(app_1.app)
        .delete(`/team/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe(`Team with id ${id} was deleted successfully`);
}));
it("Edit a team by the id", () => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield global.signin();
    const players = ["Anold", "kelvin", "Bond", "kurt"];
    const response = yield (0, supertest_1.default)(app_1.app)
        .post("/add_team")
        .set("Authorization", `Bearer ${token}`)
        .send({
        team: "Man Utd",
        coach: "Bonds",
        players,
    })
        .expect(201);
    const id = response.body.data._id;
    const addedPlayers = ["Edi", "Eben", "Ben"];
    const res = yield (0, supertest_1.default)(app_1.app)
        .put(`/team/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
        team: "Man City",
        coach: "Travis",
        players: addedPlayers,
    })
        .expect(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("data");
    expect(res.body.message).toBe(`Team with id ${id} was edited successfully`);
    expect(res.body.data.players.length).toBe(players.length + addedPlayers.length);
}));
it("Get all teams that were created", () => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield global.signin();
    const team1 = ["Anold", "kelvin", "Bond", "kurt"];
    const team2 = ["Edi", "Eben", "Ben", "hart"];
    yield (0, supertest_1.default)(app_1.app)
        .post("/add_team")
        .set("Authorization", `Bearer ${token}`)
        .send({
        team: "Man Utd",
        coach: "Bonds",
        players: team1,
    })
        .expect(201);
    yield (0, supertest_1.default)(app_1.app)
        .post("/add_team")
        .set("Authorization", `Bearer ${token}`)
        .send({
        team: "Chelsea",
        coach: "Gift",
        players: team2,
    })
        .expect(201);
    const addedPlayers = ["Edi", "Eben", "Ben"];
    const res = yield (0, supertest_1.default)(app_1.app)
        .get("/teams")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.length).toBe(2);
}));
it("get a team by the id", () => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield global.signin();
    const players = ["Anold", "kelvin", "Bond", "kurt"];
    const response = yield (0, supertest_1.default)(app_1.app)
        .post("/add_team")
        .set("Authorization", `Bearer ${token}`)
        .send({
        team: "Man Utd",
        coach: "Bonds",
        players,
    })
        .expect(201);
    const id = response.body.data._id;
    const res = yield (0, supertest_1.default)(app_1.app)
        .get(`/team/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("data");
    expect(res.body.message).toBe("Successful");
    expect(res.body.data._id).toBe(id);
}));
