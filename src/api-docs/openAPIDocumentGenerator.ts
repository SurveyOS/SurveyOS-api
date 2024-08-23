import { companyRegistry } from "@/api/company/router";
import { healthCheckRegistry } from "@/api/health/router";
import { questionRegistry } from "@/api/question/router";
import { surveyRegistry } from "@/api/survey/router";
import { themeRegistry } from "@/api/theme/router";
import { userRegistry } from "@/api/users/router";
import { workspaceRegistry } from "@/api/workspace/router";
import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([
    healthCheckRegistry,
    userRegistry,
    surveyRegistry,
    workspaceRegistry,
    questionRegistry,
    themeRegistry,
    companyRegistry,
  ]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "SurveyOS API",
    },
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "api/v1/swagger.json",
    },
  });
}
