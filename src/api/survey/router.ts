import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { SurveyController } from "@/api/survey/controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { CreateSurveySchema, SurveyZodSchema, UpdateSurveySchema } from "./model";

export const surveyRouter: Router = express.Router();

export const surveyRegistry = new OpenAPIRegistry();
export const questionRouter: Router = express.Router();

surveyRegistry.register("Survey", SurveyZodSchema);

surveyRouter.post("/create", SurveyController.createSurvey);
surveyRouter.get("/:id", SurveyController.getSurvey);
surveyRouter.put("/:id", SurveyController.updateSurvey);
surveyRouter.get("/:id/history", SurveyController.getSurveyHistory);
surveyRouter.delete("/:id", SurveyController.deleteSurvey);

surveyRegistry.registerPath({
  method: "post",
  path: "/api/v1/survey/create",
  tags: ["Survey"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateSurveySchema,
        },
      },
    },
  },
  responses: createApiResponse(CreateSurveySchema, "Success"),
});

surveyRegistry.registerPath({
  method: "get",
  path: "/api/v1/survey/{id}",
  tags: ["Survey"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  responses: createApiResponse(SurveyZodSchema, "Success"),
});

surveyRegistry.registerPath({
  method: "put",
  path: "/api/v1/survey/{id}",
  tags: ["Survey"],
  parameters: [
    {
      name: "id",
      in: "path",
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
          schema: UpdateSurveySchema,
        },
      },
    },
  },
  responses: createApiResponse(SurveyZodSchema, "Success"),
});

surveyRegistry.registerPath({
  method: "delete",
  path: "/api/v1/survey/{id}",
  tags: ["Survey"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  responses: createApiResponse(SurveyZodSchema, "Success"),
});
