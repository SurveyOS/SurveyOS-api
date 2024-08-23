import { User } from "@/api/users/model";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "./service";

class UserController {
  public createUser: RequestHandler = async (req: Request, res: Response) => {
    const { name, email, company, password } = req.body;

    const user = new User({
      name,
      email,
      password,
      company,
      workspaces: [],
    });

    const newUser = await userService.create(user, true, true);

    return handleServiceResponse(newUser, res);
  };

  public login: RequestHandler = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const loginResponse = await userService.login(email, password);

    return handleServiceResponse(loginResponse, res);
  };
}

export const userController = new UserController();
