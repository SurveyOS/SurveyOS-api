import { User } from "@/api/users/model";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "./service";

class UserController {
  public createUser: RequestHandler = async (req: Request, res: Response) => {
    const { name, email, company, password, role } = req.body;

    const user = new User({
      name,
      email,
      password,
      company,
      workspaces: []
    });

    const newUser = await userService.create(user, true, true, role);

    return handleServiceResponse(newUser, res);
  };

  public login: RequestHandler = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const loginResponse = await userService.login(email, password);

    return handleServiceResponse(loginResponse, res);
  };

  public me: RequestHandler = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      return handleServiceResponse(ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND), res);
    }

    const userResponse = await userService.findOneById(user.id);

    return handleServiceResponse(userResponse, res);
  };

  public refreshToken: RequestHandler = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      return handleServiceResponse(ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND), res);
    }

    const refreshTokenResponse = await userService.refreshToken(user.id);

    return handleServiceResponse(refreshTokenResponse, res);
  };
}

export const userController = new UserController();
