import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
  function signin(): Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
  process.env.SECRET_KEY = "JEjdedkddw";
  process.env.SALT = "10";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// afterAll(async () => {
//   await mongo.stop();
//   await mongoose.connection.close();
// })

global.signin = async () => {
  const name = "Test";
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/users/admin_signup")
    .send({ name, email, password })
    .expect(201);

  const response2 = await request(app)
    .post("/users/user_login")
    .send({ email, password })
    .expect(200);

  const token = response2.body.token;
  return token;
};
