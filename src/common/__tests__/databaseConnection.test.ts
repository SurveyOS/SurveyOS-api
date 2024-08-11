import express, { type Express } from "express";
import { StatusCodes } from "http-status-codes";

import errorHandler from "@/common/middleware/errorHandler";
import { env } from "@/common/utils/envConfig";
import mongoose, { ConnectOptions } from "mongoose";

describe("Database Connection", () => {
  let app: Express;

  beforeAll(() => {
    app = express();

    app.use(errorHandler());
    app.use("*", (req, res) => res.status(StatusCodes.NOT_FOUND).send("Not Found"));
  });

  describe("Database Connection", () => {
    it("connects to the database", async () => {
      const connection = await mongoose.connect(env.MONGODB_URI);
      expect(connection).toBeDefined();
    });
  });
});
