import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"],
  }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  SESSION_SECRET: str({ devDefault: testOnly("secret") }),
  JWT_SECRET: str({ devDefault: testOnly("jwt-secret") }),
  MONGODB_URI: str({ devDefault: testOnly("mongodb://localhost:27017") }),
  GOOGLE_CLIENT_ID: str({ devDefault: testOnly("google-client-id") }),
  GOOGLE_CLIENT_SECRET: str({ devDefault: testOnly("google-client-secret") }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
});
