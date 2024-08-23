import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { companyController } from "@/api/company/controller";
import {
  CompanySchema,
  CreateCompanySchema,
  DeleteUserFromCompanySchema,
  UpdateCompanySchema,
} from "@/api/company/model";
import AuthMiddleware from "@/common/middleware/authMiddleware";
import { validateRequest } from "@/common/utils/httpHandlers";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

export const companyRegistry = new OpenAPIRegistry();
export const companyRouter: Router = express.Router();

companyRegistry.register("Company", CompanySchema);

companyRegistry.registerPath({
  method: "post",
  path: "/api/v1/company/create",
  tags: ["Company"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateCompanySchema,
        },
      },
    },
  },
  responses: createApiResponse(CompanySchema, "Success"),
});

companyRegistry.registerPath({
  method: "put",
  path: "/api/v1/company/update/add",
  tags: ["Company"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UpdateCompanySchema,
        },
      },
    },
  },
  responses: createApiResponse(CompanySchema, "Success"),
});

companyRegistry.registerPath({
  method: "get",
  path: "/api/v1/company/{companyId}",
  tags: ["Company"],
  parameters: [
    {
      in: "path",
      name: "companyId",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  responses: createApiResponse(CompanySchema, "Success"),
});

companyRegistry.registerPath({
  method: "delete",
  path: "/api/v1/company/remove",
  tags: ["Company"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: DeleteUserFromCompanySchema,
        },
      },
    },
  },
  responses: createApiResponse(CompanySchema, "Success"),
});

companyRouter.post(
  "/create",
  AuthMiddleware.auth,
  validateRequest(CreateCompanySchema),
  companyController.createCompany,
);

companyRouter.put(
  "/update/add",
  AuthMiddleware.auth,
  validateRequest(UpdateCompanySchema),
  companyController.addUserToCompany,
);
