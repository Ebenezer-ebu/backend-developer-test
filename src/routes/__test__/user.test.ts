import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful sign up", async () => {
  return request(app)
    .post("/users/admin_signup")
    .send({
      name: "Admin",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 201 on successful sign up", async () => {
  return request(app)
    .post("/users/user_signup")
    .send({
      name: "user",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/users/admin_signup")
    .send({
      email: "hedjefefjekf",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  await request(app)
    .post("/users/admin_signup")
    .send({
      password: "pa",
    })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/users/user_signup")
    .send({
      name: "user",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  await request(app)
    .post("/users/user_signup")
    .send({
      name: "user",
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/users/user_signup")
    .send({
      name: "user",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  expect(response.body.message).toBe("User created successfully");
});

it("returns a 200 on successful login", async () => {
  await request(app)
    .post("/users/user_signup")
    .send({
      name: "user",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  const response = await request(app)
    .post("/users/user_login")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.body).toHaveProperty("message");
  expect(response.body).toHaveProperty("token");
});
