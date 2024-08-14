import Database from "@/common/config/database";
import { env } from "@/common/utils/envConfig";
import { app, logger } from "@/server";

const startServer = () => {
  const server = app.listen(env.PORT, () => {
    const { NODE_ENV, HOST, PORT } = env;
    logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT} 🚀`);
  });

  const onCloseSignal = () => {
    logger.info("sigint received, shutting down");
    server.close(() => {
      logger.info("server closed");
      process.exit();
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on("SIGINT", onCloseSignal);
  process.on("SIGTERM", onCloseSignal);
};

// Connect to the database and start the server
Database.connect()
  .then(() => {
    startServer();
  })
  .catch((err) => {
    logger.error(`Failed to connect to the database with ${err}`);
    process.exit(1);
  });
