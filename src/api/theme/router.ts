import { validateRequest } from "@/common/utils/httpHandlers";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from "express";
import { themeController } from "./controller";
import { ThemeZodSchema } from "./model";

export const themeRouter: Router = Router();

export const themeRegistry = new OpenAPIRegistry();
export const questionRouter: Router = express.Router();

themeRegistry.register("Theme", ThemeZodSchema);

themeRouter.post("/create", validateRequest(ThemeZodSchema), themeController.createTheme);
themeRouter.put("/update/:id", validateRequest(ThemeZodSchema), themeController.updateTheme);

themeRegistry.registerPath({
  method: "post",
  path: "/api/v1/theme/create",
  tags: ["Theme"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ThemeZodSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": {
          schema: ThemeZodSchema,
        },
      },
    },
  },
});

themeRegistry.registerPath({
  method: "put",
  path: "/api/v1/theme/update/{id}",
  tags: ["Theme"],
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
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": {
          schema: ThemeZodSchema,
        },
      },
    },
  },
});
