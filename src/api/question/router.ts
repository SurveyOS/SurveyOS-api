// router.ts
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { questionController } from "@/api/question/controller";
import { QuestionZodSchema, CreateQuestionSchema, UpdateQuestionSchema } from "@/api/question/model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

export const questionRegistry = new OpenAPIRegistry();
export const questionRouter: Router = express.Router();

questionRegistry.register("Question", QuestionZodSchema);

questionRegistry.registerPath({
  method: "post",
  path: "/question/create",
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

questionRouter.post("/create", validateRequest(CreateQuestionSchema), questionController.createQuestion);
questionRouter.put("/:id",validateRequest(UpdateQuestionSchema), questionController.updateQuestion);
questionRouter.post("/copy/:id", validateRequest(UpdateQuestionSchema), questionController.copyQuestion);
questionRouter.delete("/:id", questionController.deleteQuestion);

questionRegistry.registerPath({
  method: "put",
  path: "/question/{id}",
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
  path: "/question/{id}",
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
  path: "/question/copy/{id}",
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