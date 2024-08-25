import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { questionController } from "@/api/question/controller";
import { CreateQuestionSchema, QuestionZodSchema } from "@/api/question/model";
import AuthMiddleware from "@/common/middleware/authMiddleware";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

export const questionRegistry = new OpenAPIRegistry();
export const questionRouter: Router = express.Router();

questionRegistry.register("Question", QuestionZodSchema);

questionRegistry.registerPath({
  method: "post",
  path: "/api/v1/question/create",
  tags: ["Question"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateQuestionSchema,
        },
      },
    },
  },
  responses: createApiResponse(QuestionZodSchema, "Success"),
});

questionRouter.post("/create", AuthMiddleware.auth, questionController.createQuestion);
questionRouter.put("/:id", AuthMiddleware.auth, questionController.updateQuestion);
questionRouter.post("/copy/:id", AuthMiddleware.auth, questionController.copyQuestion);
questionRouter.delete("/:id", AuthMiddleware.auth, questionController.deleteQuestion);

questionRegistry.registerPath({
  method: "put",
  path: "/api/v1/question/{id}",
  tags: ["Question"],
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
  responses: createApiResponse(QuestionZodSchema, "Success"),
});

questionRegistry.registerPath({
  method: "delete",
  path: "/api/v1/question/{id}",
  tags: ["Question"],
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
  responses: createApiResponse(QuestionZodSchema, "Success"),
});

questionRegistry.registerPath({
  method: "post",
  path: "/api/v1/question/copy/{id}",
  tags: ["Question"],
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
  responses: createApiResponse(QuestionZodSchema, "Success"),
});

export default questionRouter;
