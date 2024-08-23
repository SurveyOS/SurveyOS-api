import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { workspaceController } from "./controller";
import { CreateWorkspaceSchema, WorkspaceSchema } from "./model";

export const workspaceRegistry = new OpenAPIRegistry();
export const workspaceRouter: Router = express.Router();

workspaceRegistry.register("Workspace", WorkspaceSchema);

workspaceRegistry.registerPath({
  method: "post",
  path: "/api/v1/workspace/create",
  tags: ["Workspace"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateWorkspaceSchema,
        },
      },
    },
  },
  responses: createApiResponse(WorkspaceSchema, "Success"),
});

workspaceRegistry.registerPath({
  method: "get",
  path: "/api/v1/workspace/{companyId}",
  tags: ["Workspace"],
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
  responses: createApiResponse(WorkspaceSchema, "Success"),
});

workspaceRegistry.registerPath({
  method: "put",
  path: "/api/v1/workspace/update/{id}",
  tags: ["Workspace"],
  parameters: [
    {
      in: "path",
      name: "id",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: WorkspaceSchema,
        },
      },
    },
  },
  responses: createApiResponse(WorkspaceSchema, "Success"),
});

workspaceRegistry.registerPath({
  method: "delete",
  path: "/api/v1/workspace/delete/{companyId}",
  tags: ["Workspace"],
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
  responses: createApiResponse(WorkspaceSchema, "Success"),
});

workspaceRouter.post("/create", validateRequest(CreateWorkspaceSchema), workspaceController.createWorkspace);

workspaceRouter.get("/:companyId", workspaceController.getWorkspace);

workspaceRouter.put("/update/:id", validateRequest(WorkspaceSchema), workspaceController.updateUserInWorkspace);

workspaceRouter.delete("/delete/:companyId", workspaceController.deleteWorkspace);
