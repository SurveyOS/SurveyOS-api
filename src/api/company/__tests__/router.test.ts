import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { app } from "@/server";
import mongoose from "mongoose";
import { Company, type ICompany } from "../model";
import { User } from "@/api/users/model";

describe("Create Company API endpoints", () => {
  beforeAll(async () => {
    await mongoose.connect(env.MONGODB_URI);
    await mongoose.connection.db.dropDatabase();
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Company.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("POST /create - success", async () => {
    const user = await request(app).post("/users/create").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password@123",
    });

    const res = await request(app).post("/company/create").send({
      name: "John Doe Company",
      adminId: user.body.response._id,
    });

    const result: ServiceResponse<ICompany | null> = res.body;

    expect(res.status).toEqual(StatusCodes.CREATED);
    expect(result).toHaveProperty("message", "Company created successfully");
    expect(result.response).toHaveProperty("_id");

    const company = await Company.findById(result.response?._id);
    expect(company).toBeDefined();
    expect(company?.name).toEqual("John Doe Company");
    expect(company?.admins).toHaveLength(1);
    expect(company?.users).toHaveLength(1);
  });

  it("POST /create - failure: user already in company", async () => {
    const user = await request(app).post("/users/create").send({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password@123",
    });

    await request(app).post("/company/create").send({
      name: "Jane Doe Company",
      adminId: user.body.response._id,
    });

    const res = await request(app).post("/company/create").send({
      name: "Jane Doe Company 2",
      adminId: user.body.response._id,
    });

    const result: ServiceResponse<ICompany | null> = res.body;

    expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(result).toHaveProperty("message", "User is already in another company");
  });

  it("POST /create - failure: missing adminId", async () => {
    const res = await request(app).post("/company/create").send({
      name: "John Doe Company",
    });

    const result: ServiceResponse<ICompany | null> = res.body;

    expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(result).toHaveProperty("message", "adminId is required");
  });

  it("POST /create - failure: user not found", async () => {
    const res = await request(app).post("/company/create").send({
      name: "John Doe Company",
      adminId: "66b623d95a9a968dabd8f497",
    });

    const result: ServiceResponse<ICompany | null> = res.body;

    expect(res.status).toEqual(StatusCodes.NOT_FOUND);
    expect(result).toHaveProperty("message", "User not found");
  });

  it("POST /create - failure: missing name", async () => {
    const user = await request(app).post("/users/create").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password@123",
    });

    const res = await request(app).post("/company/create").send({
      adminId: user.body.response._id,
    });

    const result: ServiceResponse<ICompany | null> = res.body;

    expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(result).toHaveProperty("message", "name is required");
  });
});

describe("Add user to Company API endpoints", () => {
  beforeAll(async () => {
    await mongoose.connect(env.MONGODB_URI);
  });

  afterEach(async () => {
    await Company.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("POST /update/add - success", async () => {
    const user = await request(app).post("/users/create").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password@123",
    });

    const company = await request(app).post("/company/create").send({
      name: "John Doe Company",
      adminId: user.body.response._id,
    });

    const user2 = await request(app).post("/users/create").send({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password@123",
    });

    const res = await request(app).post("/company/update/add").send({
      companyId: company.body.response._id,
      userId: user2.body.response._id,
      role: "admin",
    });

    const result: ServiceResponse<ICompany | null> = res.body;

    expect(res.status).toEqual(StatusCodes.OK);
    expect(result).toHaveProperty("message", "Company updated successfully");
  });

  it("POST /update/add - failure: user already in company", async () => {
    const user = await request(app).post("/users/create").send({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password@123",
    });

    const company = await request(app).post("/company/create").send({
      name: "Jane Doe Company",
      adminId: user.body.response._id,
    });

    const res = await request(app).post("/company/update/add").send({
      companyId: company.body.response._id,
      userId: user.body.response._id,
      role: "admin",
    });

    const result: ServiceResponse<ICompany | null> = res.body;

    expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(result).toHaveProperty("message", "User is already in this company");
  });

  it("POST /update/add - failure: user not found", async () => {
    const user = await request(app).post("/users/create").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password@123",
    });

    const company = await request(app).post("/company/create").send({
      name: "John Doe Company",
      adminId: "123",
    });

    const res = await request(app).post("/company/update/add").send({
      companyId: company.body.response._id,
      userId: "123",
      role: "admin",
    });

    const result: ServiceResponse<ICompany | null> = res.body;

    expect(res.status).toEqual(StatusCodes.NOT_FOUND);
    expect(result).toHaveProperty("message", "User not found");
  });

  it("POST /update/add - failure: company not found", async () => {
    const user = await request(app).post("/users/create").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password@123",
    });

    const res = await request(app).post("/company/update/add").send({
      companyId: "123",
      userId: user.body.response._id,
      role: "admin",
    });

    const result: ServiceResponse<ICompany | null> = res.body;

    expect(res.status).toEqual(StatusCodes.NOT_FOUND);
    expect(result).toHaveProperty("message", "Company not found");
  });

  it("POST /update/add - failure: missing companyId", async () => {
    const user = await request(app).post("/users/create").send({
      name: "Jane Doe",
      email: "janen@example.com",
      password: "password@123",
    });


    const res = await request(app).post("/company/update/add").send({
      userId: user.body.response._id,
      role: "admin",
    });

    const result: ServiceResponse<ICompany | null> = res.body;

    expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(result).toHaveProperty("message", "Invalid request");
  });
});
