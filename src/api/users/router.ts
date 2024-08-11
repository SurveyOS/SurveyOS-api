import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { CreateUserSchema, GoogleLoginSchema, type IUser, LoginSchema, User, UserSchema } from "@/api/users/model";
import passport from "@/common/config/passport";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { generateJWT } from "@/common/utils/auth";
import { handleServiceResponse, validateRequest } from "@/common/utils/httpHandlers";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { userController } from "./controller";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();
export const authRouter: Router = express.Router();

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

userRouter.post("/create", validateRequest(CreateUserSchema), userController.createUser);

userRegistry.registerPath({
  method: "post",
  path: "/users/login",
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

// Google Sign-Up/Login
userRouter.post("/google", validateRequest(GoogleLoginSchema), userController.googleSignUpOrLogin);

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false, // Disable session since we're using JWTs
  }),
  (req, res) => {
    const token = generateJWT(req.user as IUser);
    res.json({ token });
  },
);

authRouter.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return handleServiceResponse(ServiceResponse.failure("Logout failed", null, 500), res);
    }
    res.redirect("/");
  });
});
