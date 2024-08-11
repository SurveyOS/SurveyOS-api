import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { ZodError, ZodIssue, ZodSchema } from "zod";

import { ServiceResponse } from "@/common/models/serviceResponse";

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({ body: req.body, query: req.query, params: req.params });
    next();
  } catch (err) {
    const errorMessage = (err as ZodError).errors.map((error) => simplifyZodError(error)).join(", ");
    const statusCode = StatusCodes.BAD_REQUEST;
    const serviceResponse = ServiceResponse.failure(errorMessage, null, statusCode);
    return handleServiceResponse(serviceResponse, res);
  }
};

function simplifyZodError(error: ZodIssue): string {
  try {
    if (
      error.code === "invalid_type" &&
      error.received === "undefined" &&
      Array.isArray(error.path) &&
      error.path.length > 1
    ) {
      const field = error.path[1] as string;
      return `${field} is required`;
    }

    return error.message;
  } catch (err) {
    return "Invalid request body";
  }
}
