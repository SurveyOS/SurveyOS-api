import express, { Router } from "express";
import { SurveyController } from "@/api/survey/controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  CreateSurveySchema,
  SurveyZodSchema,
  UpdateSurveySchema,
} from "./model";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

export const surveyRouter: Router = express.Router();

export const surveyRegistry = new OpenAPIRegistry();
export const questionRouter: Router = express.Router();

surveyRegistry.register("Survey", SurveyZodSchema);

surveyRouter.post("/create", SurveyController.createSurvey);
surveyRouter.get("/:id", SurveyController.getSurvey);
surveyRouter.put("/:id", SurveyController.updateSurvey);
surveyRouter.get("/:id/history", SurveyController.getSurveyHistory);
surveyRouter.delete("/:id", SurveyController.deleteSurvey);
surveyRouter.post("/template/create", SurveyController.createSurveyTemplate);
surveyRouter.delete("/template/:id", SurveyController.deleteSurveyTemplate);

surveyRegistry.registerPath({
  method: "post",
  path: "/survey/create",
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
  path: "/survey/{id}",
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
  path: "/survey/{id}",
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
  path: "/survey/{id}",
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
  method: "post",
  path: "/survey/template/create",
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
  method: "delete",
  path: "/survey/template/{id}",
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
  responses: createApiResponse(CreateSurveySchema, "Success"),
});
