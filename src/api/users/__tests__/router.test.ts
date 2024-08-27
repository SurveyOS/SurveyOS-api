import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { app } from "@/server";
import mongoose from "mongoose";
import { type IUser, User } from "../model";

describe("Create User API endpoints", () => {
  beforeAll(async () => {
    await mongoose.connect(env.MONGODB_URI);
    await mongoose.connection.db?.dropDatabase();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("POST /create - success", async () => {
    const res = await request(app).post("/users/create").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password@123",
    });

    const result: ServiceResponse<IUser | null> = res.body;

    expect(res.status).toEqual(StatusCodes.CREATED);
    expect(result).toHaveProperty("message", "User created successfully");
    expect(result.response).toHaveProperty("_id");

    const user = await User.findById(result.response?._id);

    expect(user).toBeDefined();
    expect(user?.name).toEqual("John Doe");
    expect(user?.email).toEqual("john@example.com");
  });

  it("POST /create - failure: user already exists", async () => {
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

    const result: ServiceResponse<IUser | null> = res.body;

    expect(res.status).toEqual(StatusCodes.CONFLICT);
    expect(result).toHaveProperty("message", "User already exists");
  });

  it("POST /create - failure: missing password", async () => {
    const res = await request(app).post("/users/create").send({
      name: "John Doe",
      email: "john@example.com",
    });

    const result: ServiceResponse<IUser | null> = res.body;

    expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(result).toHaveProperty("message", "password is required");
  });

  it("POST /create - failure: invalid email", async () => {
    const res = await request(app).post("/users/create").send({
      name: "John Doe",
      email: "johnexample.com",
      password: "password@123",
    });

    const result: ServiceResponse<IUser | null> = res.body;
    expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(result).toHaveProperty("message", "Invalid email");
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

  it("POST /login - success", async () => {
    await request(app).post("/users/create").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password@123",
    });

    const res = await request(app).post("/users/login").send({
      email: "john@example.com",
      password: "password@123",
    });

    const result: ServiceResponse<IUser | null> = res.body;

    expect(res.status).toEqual(StatusCodes.OK);
    expect(result).toHaveProperty("message", "Login successful");
    expect(result.response).toBeDefined();
  });

  it("POST /login - failure: missing password", async () => {
    await request(app).post("/users/create").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password@123",
    });

    const res = await request(app).post("/users/login").send({
      email: "john@example.com",
    });

    const result: ServiceResponse<IUser | null> = res.body;

    expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(result).toHaveProperty("message", "password is required");
  });

  it("POST /login - failure: user not found", async () => {
    const res = await request(app).post("/users/login").send({
      email: "john@example.com",
      password: "password@123",
    });

    const result: ServiceResponse<IUser | null> = res.body;

    expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(result).toHaveProperty("message", "Invalid credentials");
  });
});
