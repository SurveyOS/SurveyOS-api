import { logger } from "@/server";
import { type IUser, User } from "./model";

export class UserRepository {
  async create(user: IUser) {
    try {
      const newUser = await user.save();
      return newUser;
    } catch (error) {
      logger.error(`Error creating user: ${error}`);
      return null;
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = User.findOne({ email }).populate("company");
      return user;
    } catch (error) {
      logger.error(`Error finding user by email: ${error}`);
      return null;
    }
  }

  async findOneById(id: string) {
    try {
      const user = User.findById(id).populate("company");
      return user;
    } catch (error) {
      logger.error(`Error finding user by id: ${error}`);
      return null;
    }
  }
}
