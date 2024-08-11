import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";
import mongoose, { ConnectOptions } from "mongoose";

class Database {
  private static instance: Database;

  public static async connect(): Promise<Database> {
    logger.info("Connecting to Database...");
    if (!Database.instance) {
      Database.instance = new Database();
      await mongoose.connect(env.MONGODB_URI);
      logger.info("Connected to Database 🚀");
    }
    return Database.instance;
  }
}

export default Database;
