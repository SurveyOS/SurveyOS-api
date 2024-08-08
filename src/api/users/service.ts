import type { User } from "@/api/users/model";
import { UserRepository } from "@/api/users/repository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";

export class UserService {
  private userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }

  /*
   * @desc Find a user by email
   * @param {User} user
   * @return {ServiceResponse<User | null>}
   */
  async create(user: User): Promise<ServiceResponse<User | null>> {
    try {
      const newUser = await this.userRepository.create(user);
      if (!newUser) {
        return ServiceResponse.failure("User not created", null, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return ServiceResponse.success<User>("User created successfully", newUser, StatusCodes.CREATED);
    } catch (error) {
      const errorMessage = `Error creating user: ${error}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("User not created", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneByEmail(email: string): Promise<ServiceResponse<User | null>> {
    try {
      const user = await this.userRepository.findOneByEmail(email);
      if (!user) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<User>("User found", user, StatusCodes.OK);
    } catch (error) {
      const errorMessage = `Error finding user by email: ${error}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("User not found", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const userService = new UserService();
