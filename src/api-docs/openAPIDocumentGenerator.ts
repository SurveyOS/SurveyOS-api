import { healthCheckRegistry } from "@/api/health/router";
import { userRegistry } from "@/api/users/router";
import {surveyRegistry} from "@/api/survey/router"
import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { questionRegistry } from "@/api/question/router";
import { themeRegistry } from "@/api/theme/router";
import { companyRegistry } from "@/api/company/router";

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([healthCheckRegistry, userRegistry, surveyRegistry, questionRegistry, themeRegistry, companyRegistry]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Swagger API",
    },
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  });
}
