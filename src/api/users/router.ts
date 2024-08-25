import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { CreateUserSchema, LoginSchema, UserSchema } from "@/api/users/model";
import AuthMiddleware from "@/common/middleware/authMiddleware";
import { validateRequest } from "@/common/utils/httpHandlers";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { userController } from "./controller";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
  method: "post",
  path: "/api/v1/users/create",
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

userRouter.post("/create", validateRequest(CreateUserSchema), userController.createUser);

userRegistry.registerPath({
  method: "post",
  path: "/api/v1/users/login",
  tags: ["User"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginSchema,
        },
      },
    },
  },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.post("/login", validateRequest(LoginSchema), userController.login);

userRegistry.registerPath({
  method: "get",
  path: "/api/v1/users/refresh-token",
  tags: ["User"],
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.get("/refresh-token", AuthMiddleware.auth, userController.refreshToken);

userRegistry.registerPath({
  method: "get",
  path: "/api/v1/users/me",
  tags: ["User"],
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.get("/me", AuthMiddleware.auth, userController.me);
