import { type IUser, User } from "@/api/users/model";
import { UserRepository } from "@/api/users/repository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { comparePasswords, generateJWT, hashPassword } from "@/common/utils/auth";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";

class UserService {
  private userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }

  async create(user: IUser): Promise<ServiceResponse<IUser | null>> {
    try {
      const existingUser = await this.findOneByEmail(user.email);

      if (existingUser.success) {
        return ServiceResponse.failure("User already exists", null, StatusCodes.CONFLICT);
      }

      if (!user.password) {
        return ServiceResponse.failure("Password is required", null, StatusCodes.BAD_REQUEST);
      }

      user.password = await hashPassword(user.password);
      const newUser = await this.userRepository.create(user);
      if (!newUser) {
        return ServiceResponse.failure("Error creating user", null, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return ServiceResponse.success<IUser>("User created successfully", newUser, StatusCodes.CREATED);
    } catch (error) {
      const errorMessage = `Error creating user: ${error}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("User not created", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneByEmail(email: string): Promise<ServiceResponse<IUser | null>> {
    try {
      const user = await this.userRepository.findOneByEmail(email);
      if (!user) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<IUser>("User found", user, StatusCodes.OK);
    } catch (error) {
      const errorMessage = `Error finding user by email: ${error}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("User not found", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneById(id: string): Promise<ServiceResponse<IUser | null>> {
    try {
      const user = await this.userRepository.findOneById(id);
      if (!user) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<IUser>("User found", user, StatusCodes.OK);
    } catch (error) {
      const errorMessage = `Error finding user by id: ${error}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("User not found", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async login(email: string, password: string): Promise<ServiceResponse<string | null>> {
    try {
      const userResponse = await this.findOneByEmail(email);
      if (!userResponse.success || !userResponse.response) {
        return ServiceResponse.failure("Invalid credentials", null, StatusCodes.BAD_REQUEST);
      }

      if (!userResponse.response.password) {
        return ServiceResponse.failure("Login with google to continue", null, StatusCodes.BAD_REQUEST);
      }

      const isPasswordValid = await comparePasswords(password, userResponse.response.password);
      if (!isPasswordValid) {
        return ServiceResponse.failure("Invalid credentials", null, StatusCodes.BAD_REQUEST);
      }

      const token = generateJWT(userResponse.response);
      return ServiceResponse.success<string>("Login successful", token, StatusCodes.OK);
    } catch (error) {
      const errorMessage = `Error during login: ${error}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Login failed", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async googleSignUpOrLogin(
    googleId: string,
    email: string,
    name?: string,
    avatar?: string,
  ): Promise<ServiceResponse<IUser | null>> {
    try {
      let userResponse = await this.findOneByEmail(email);
      if (!userResponse.success) {
        const newUser = new User({
          email,
          googleId,
          name,
          avatar,
          provider: "google",
          workspaces: [],
        });
        userResponse = await this.create(newUser);
        if (!userResponse.success) {
          return ServiceResponse.failure("Google sign-up failed", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
      }

      return userResponse;
    } catch (error) {
      const errorMessage = `Error during Google sign-up/login: ${error}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Google sign-up/login failed", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const userService = new UserService();
