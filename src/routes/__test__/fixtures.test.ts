import request from "supertest";
import { app } from "../../app";

it("response with a 201 for a created fixture by an Admin", async () => {
  const token = await global.signin();

  await request(app)
    .post("/add_team")
    .set("Authorization", `Bearer ${token}`)
    .send({
      team: "Man City",
      coach: "Bonds",
      players: ["Anold", "kelvin", "Bond", "kurt"],
    })
    .expect(201);

  await request(app)
    .post("/add_team")
    .set("Authorization", `Bearer ${token}`)
    .send({
      team: "Chelsea",
      coach: "Bonds",
      players: ["Kante", "kelechi", "Kule", "kurt"],
    })
    .expect(201);

  const response = await request(app)
    .post("/add_fixture")
    .set("Authorization", `Bearer ${token}`)
    .send({
      home: "Man City",
      away: "Chelsea",
    })
    .expect(201);

  expect(response.body).toHaveProperty("message");
  expect(response.body).toHaveProperty("data");
  expect(response.body.message).toBe("Fixture was created successfully");
});

it("response with a 400 for a failure due to teams not in the DB", async () => {
  const token = await global.signin();

  const response = await request(app)
    .post("/add_fixture")
    .set("Authorization", `Bearer ${token}`)
    .send({
      home: "Man City",
      away: "Chelsea",
    })
    .expect(400);

  expect(response.body).toHaveProperty("message");
  expect(response.body.message).toBe(
    "All teams selected for a fixture must exists in the database"
  );
});

it("Edits and Deletes a fixture by the id", async () => {
  const token = await global.signin();

  await request(app)
    .post("/add_team")
    .set("Authorization", `Bearer ${token}`)
    .send({
      team: "Man Utd",
      coach: "Bonds",
      players: ["Anold", "kelvin", "Bond", "kurt"],
    })
    .expect(201);

  await request(app)
    .post("/add_team")
    .set("Authorization", `Bearer ${token}`)
    .send({
      team: "Man city",
      coach: "Cape",
      players: ["Anold", "kelvin", "Bond", "kurt"],
    })
    .expect(201);

  const response = await request(app)
    .post("/add_fixture")
    .set("Authorization", `Bearer ${token}`)
    .send({
      home: "Man City",
      away: "Man Utd",
    })
    .expect(201);
  const id = response.body.data._id;

  const res = await request(app)
    .put(`/fixture/${id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      home_score: 2,
      away_score: 1,
      home_scorers: ["Anold", "kelvin"],
      away_scorers: ["kurt"],
    })
    .expect(201);

  expect(res.body).toHaveProperty("message");
  expect(res.body).toHaveProperty("data");
  expect(res.body.message).toBe("Match fixture updated successfully");

  const res2 = await request(app)
    .delete(`/fixture/${id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(res2.body).toHaveProperty("message");
  expect(res2.body.message).toBe(
    `Fixture with id ${id} was deleted successfully`
  );
});

it("Get all fxitures that were created", async () => {
  const token = await global.signin();

  await request(app)
    .post("/add_team")
    .set("Authorization", `Bearer ${token}`)
    .send({
      team: "Man Utd",
      coach: "Bonds",
      players: ["Anold", "kelvin", "Bond", "kurt"],
    })
    .expect(201);

  await request(app)
    .post("/add_team")
    .set("Authorization", `Bearer ${token}`)
    .send({
      team: "Man city",
      coach: "Cape",
      players: ["Anold", "kelvin", "Bond", "kurt"],
    })
    .expect(201);

  const response = await request(app)
    .post("/add_fixture")
    .set("Authorization", `Bearer ${token}`)
    .send({
      home: "Man City",
      away: "Man Utd",
    })
    .expect(201);

  const response2 = await request(app)
    .post("/add_fixture")
    .set("Authorization", `Bearer ${token}`)
    .send({
      home: "Man Utd",
      away: "Man City",
    })
    .expect(201);

  const res = await request(app)
    .get("/fixtures")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);
  expect(res.body).toHaveProperty("message");
  expect(res.body).toHaveProperty("data");
  expect(res.body.data.length).toBe(2);

  const id = response2.body.data._id;
  const res3 = await request(app)
    .get(`/fixture/${id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);
  expect(res3.body).toHaveProperty("message");
  expect(res3.body).toHaveProperty("data");
  expect(res3.body.message).toBe("Successful");
  expect(res3.body.data._id).toBe(id);
});
