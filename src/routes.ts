import { companyRouter } from "@/api/company/router";
import { healthCheckRouter } from "@/api/health/router";
import questionRouter from "@/api/question/router";
import { surveyRouter } from "@/api/survey/router";
import { themeRouter } from "@/api/theme/router";
import { userRouter } from "@/api/users/router";
import { workspaceRouter } from "@/api/workspace/router";
import { Router } from "express";

const router = Router();

const defaultRoutes = [
  {
    path: "/health-check",
    route: healthCheckRouter,
  },
  {
    path: "/users",
    route: userRouter,
  },
  {
    path: "/company",
    route: companyRouter,
  },
  {
    path: "/workspace",
    route: workspaceRouter,
  },
  {
    path: "/question",
    route: questionRouter,
  },
  {
    path: "/survey",
    route: surveyRouter,
  },
  {
    path: "/theme",
    route: themeRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
