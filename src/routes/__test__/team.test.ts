import request from "supertest";
import { app } from "../../app";

it("response with a 201 for a created team by an Admin", async () => {
  const token = await global.signin();

  const response = await request(app)
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
  expect(response.body.message).toBe(
    "Team Man Utd has been added to the database, managed by Bonds"
  );
  expect(response.body.data.players).toEqual(
    ["Anold", "kelvin", "Bond", "kurt"].map((el) => el.toLowerCase())
  );
});

it("response with a 400 for a failure due to invalid data missing a property", async () => {
  const token = await global.signin();

  await request(app)
    .post("/add_team")
    .set("Authorization", `Bearer ${token}`)
    .send({
      team: "Man Utd",
      players: ["Anold", "kelvin", "Bond", "kurt"],
    })
    .expect(400);
});

it("Delete a team by the id", async () => {
  const token = await global.signin();

  const response = await request(app)
    .post("/add_team")
    .set("Authorization", `Bearer ${token}`)
    .send({
      team: "Man Utd",
      coach: "Bonds",
      players: ["Anold", "kelvin", "Bond", "kurt"],
    })
    .expect(201);
  const id = response.body.data._id;

  const res = await request(app)
    .delete(`/team/${id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);
  expect(res.body).toHaveProperty("message");
  expect(res.body.message).toBe(`Team with id ${id} was deleted successfully`);
});

it("Edit a team by the id", async () => {
  const token = await global.signin();
  const players = ["Anold", "kelvin", "Bond", "kurt"];

  const response = await request(app)
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
  const res = await request(app)
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
  expect(res.body.data.players.length).toBe(
    players.length + addedPlayers.length
  );
});

it("Get all teams that were created", async () => {
  const token = await global.signin();
  const team1 = ["Anold", "kelvin", "Bond", "kurt"];
  const team2 = ["Edi", "Eben", "Ben", "hart"];

  await request(app)
    .post("/add_team")
    .set("Authorization", `Bearer ${token}`)
    .send({
      team: "Man Utd",
      coach: "Bonds",
      players: team1,
    })
    .expect(201);

  await request(app)
    .post("/add_team")
    .set("Authorization", `Bearer ${token}`)
    .send({
      team: "Chelsea",
      coach: "Gift",
      players: team2,
    })
    .expect(201);

  const addedPlayers = ["Edi", "Eben", "Ben"];
  const res = await request(app)
    .get("/teams")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);
  expect(res.body).toHaveProperty("message");
  expect(res.body).toHaveProperty("data");
  expect(res.body.data.length).toBe(2);
});

it("get a team by the id", async () => {
  const token = await global.signin();
  const players = ["Anold", "kelvin", "Bond", "kurt"];

  const response = await request(app)
    .post("/add_team")
    .set("Authorization", `Bearer ${token}`)
    .send({
      team: "Man Utd",
      coach: "Bonds",
      players,
    })
    .expect(201);

  const id = response.body.data._id;
  const res = await request(app)
    .get(`/team/${id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);
  expect(res.body).toHaveProperty("message");
  expect(res.body).toHaveProperty("data");
  expect(res.body.message).toBe("Successful");
  expect(res.body.data._id).toBe(id);
});
