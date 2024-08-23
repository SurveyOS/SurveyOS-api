import { companyRouter } from "@/api/company/router";
import { healthCheckRouter } from "@/api/health/router";
import questionRouter from "@/api/question/router";
import { surveyRouter } from "@/api/survey/router";
import { themeRouter } from "@/api/theme/router";
import { authRouter, userRouter } from "@/api/users/router";
import { workspaceRouter } from "@/api/workspace/router";
import { Router } from "express";

const router = Router();

const defaultRoutes = [
  {
    path: "/health-check",
    isAuth: false,
    route: healthCheckRouter,
  },
  {
    path: "/auth",
    isAuth: false,
    route: authRouter,
  },
  {
    path: "/users",
    isAuth: false,
    route: userRouter,
  },
  {
    path: "/company",
    isAuth: true,
    route: companyRouter,
  },
  {
    path: "/workspace",
    isAuth: true,
    route: workspaceRouter,
  },
  {
    path: "/question",
    isAuth: true,
    route: questionRouter,
  },
  {
    path: "/survey",
    isAuth: true,
    route: surveyRouter,
  },
  {
    path: "/theme",
    isAuth: true,
    route: themeRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
