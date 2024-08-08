import { User } from "@/api/users/model";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "./service";

class UserController {
  public createUser: RequestHandler = async (req: Request, res: Response) => {
    console.log("Creating user");
    const { name, email, company } = req.body;

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
      company,
      workspaces: [],
    });

    const newUser = await userService.create(user);

    return handleServiceResponse(newUser, res);
  };
}

export const userController = new UserController();
