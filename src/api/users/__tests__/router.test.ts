import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { ServiceResponse } from "@/common/models/serviceResponse";
import { app } from "@/server";
import { User } from "../model";
import mongoose from "mongoose";
import { env } from "@/common/utils/envConfig";

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
});
