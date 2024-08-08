import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { CreateUserSchema, UserSchema } from "@/api/users/model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "./controller";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
  method: "post",
  path: "/users/create",
  tags: ["User"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateUserSchema,
        },
      },
    },
  },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.post(
  "/create",
  validateRequest(CreateUserSchema),
  userController.createUser
);
