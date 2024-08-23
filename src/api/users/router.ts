import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  CreateUserSchema,
  LoginSchema,
  UserSchema,
} from "@/api/users/model";
import { ServiceResponse } from "@/common/models/serviceResponse";
import {
  handleServiceResponse,
  validateRequest,
} from "@/common/utils/httpHandlers";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { userController } from "./controller";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();
export const authRouter: Router = express.Router();

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

userRouter.post(
  "/create",
  validateRequest(CreateUserSchema),
  userController.createUser
);

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

authRouter.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return handleServiceResponse(
        ServiceResponse.failure("Logout failed", null, 500),
        res
      );
    }
    res.redirect("/");
  });
});
