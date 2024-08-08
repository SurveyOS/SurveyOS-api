import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { app } from "@/server";
import mongoose from "mongoose";
import { User } from "../model";

describe("Create User API endpoints", () => {
  beforeAll(async () => {
    await mongoose.connect(env.MONGODB_URI);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("POST / - success", async () => {
    const res = await request(app).post("/users/create").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password@123",
    });

    const result: ServiceResponse<User | null> = res.body;

    expect(res.status).to.equal(StatusCodes.CREATED);
    expect(result).to.have.property("message", "User created successfully");
    expect(result.response).to.have.property("_id");

    const user = await User.findById(result.response?._id);
    expect(user).to.exist;
    expect(user?.name).to.equal("John Doe");
    expect(user?.email).to.equal("john@example.com");
  });

  it("POST / - failure: user already exists", async () => {
    await request(app).post("/users/create").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password@123",
    });

    const res = await request(app).post("/users/create").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password@123",
    });

    const result: ServiceResponse<User | null> = res.body;

    expect(res.status).to.equal(StatusCodes.CONFLICT);
    expect(result).to.have.property("message", "User already exists");
  });

  it("POST / - failure: missing password", async () => {
    const res = await request(app).post("/users/create").send({
      name: "John Doe",
      email: "john@example.com",
    });

    const result: ServiceResponse<User | null> = res.body;

    expect(res.status).to.equal(StatusCodes.BAD_REQUEST);
    expect(result).to.have.property("message", "password is required");
  });

  it("POST / - failure: invalid email", async () => {
    const res = await request(app).post("/users/create").send({
      name: "John Doe",
      email: "johnexample.com",
      password: "password@123",
    });

    const result: ServiceResponse<User | null> = res.body;
    expect(res.status).to.equal(StatusCodes.BAD_REQUEST);
    expect(result).to.have.property("message", "Invalid email");
  });
});

describe("Login User API endpoints", () => {
  beforeAll(async () => {
    await mongoose.connect(env.MONGODB_URI);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("POST / - success", async () => {
    await request(app).post("/users/create").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password@123",
    });

    const res = await request(app).post("/users/login").send({
      email: "john@example.com",
      password: "password@123",
    });

    const result: ServiceResponse<User | null> = res.body;

    expect(res.status).to.equal(StatusCodes.OK);
    expect(result).to.have.property("message", "Login successful");
    expect(result.response).to.exist;
  });

  it("POST / - failure: user not found", async () => {
    const res = await request(app).post("/users/login").send({
      email: "john@example.com",
      password: "password@123",
    });

    const result: ServiceResponse<User | null> = res.body;

    expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
    expect(result).to.have.property("message", "Invalid credentials");
  });
});
