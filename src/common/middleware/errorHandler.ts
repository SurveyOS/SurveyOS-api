// errorMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";

// Define centralized error handling middleware
export const errorMiddleware = (
  err: any, // Use `any` or a specific error type
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error (you can use a logger library)
  console.error(err);

  // Determine the error response
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  // Create a ServiceResponse instance for the error
  const serviceResponse = ServiceResponse.failure(message, null, statusCode);

  // Send the error response
  res.status(statusCode).json(serviceResponse);
};
