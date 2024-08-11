import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { companyController } from "@/api/company/controller";
import { CompanySchema, CreateCompanySchema, UpdateCompanySchema } from "@/api/company/model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

export const companyRegistry = new OpenAPIRegistry();
export const companyRouter: Router = express.Router();

companyRegistry.register("Company", CompanySchema);

companyRegistry.registerPath({
  method: "post",
  path: "/company/create",
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
  path: "/company/update/add",
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

companyRouter.post("/create", validateRequest(CreateCompanySchema), companyController.createCompany);
companyRouter.put("/update/add", validateRequest(UpdateCompanySchema), companyController.addUserToCompany);
