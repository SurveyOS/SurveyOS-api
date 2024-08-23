import { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { RequestUser } from "@/types/express";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

class AuthMiddleware {
  auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        return handleServiceResponse(ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED), res);
      }

      const token = authorization.split(" ")[1];

      if (!token) {
        return handleServiceResponse(ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED), res);
      }

      // * Verify token
      const decoded = jwt.verify(token, env.JWT_SECRET) as RequestUser;

      if (!decoded) {
        return handleServiceResponse(ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED), res);
      }

      req.user = {
        id: decoded.id,
        email: decoded.email,
      };

      next();
    } catch (error: any) {
      return handleServiceResponse(ServiceResponse.failure(error.message, null, StatusCodes.BAD_REQUEST), res);
    }
  };
}

export default new AuthMiddleware();
