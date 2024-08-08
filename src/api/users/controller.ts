import { User } from "@/api/users/model";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "./service";

class UserController {
  public createUser: RequestHandler = async (req: Request, res: Response) => {
    const { name, email, company, password } = req.body;

    const existingUser = await userService.findOneByEmail(email);

    if (existingUser.success) {
      return handleServiceResponse(
        {
          ...existingUser,
          message: "User already exists",
          statusCode: StatusCodes.CONFLICT,
        },
        res,
      );
    }

    const user = new User({
      name,
      email,
      password,
      company,
      workspaces: [],
    });

    const newUser = await userService.create(user);

    return handleServiceResponse(newUser, res);
  };

  public login: RequestHandler = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const loginResponse = await userService.login(email, password);

    return handleServiceResponse(loginResponse, res);
  };

  public googleSignUpOrLogin: RequestHandler = async (req: Request, res: Response) => {
    const { googleId, email, name, avatar } = req.body;

    const googleLoginResponse = await userService.googleSignUpOrLogin(googleId, email, name, avatar);

    return handleServiceResponse(googleLoginResponse, res);
  };
}

export const userController = new UserController();
