import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import questionRoutes  from "@/api/question/router";
import {surveyRouter} from "@/api/survey/router";
import {themeRouter} from "@/api/theme/router";

import { errorMiddleware } from "@/common/middleware/errorHandler";
import { companyRouter } from "@/api/company/router";
import { healthCheckRouter } from "@/api/health/router";
import { authRouter, userRouter } from "@/api/users/router";
import passport from "@/common/config/passport";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import session from "express-session";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/users", userRouter);
app.use("/question", questionRoutes);
app.use("/survey", surveyRouter);
app.use("/theme", themeRouter);
app.use("/company", companyRouter);
app.use("/auth", authRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorMiddleware);

export { app, logger };
