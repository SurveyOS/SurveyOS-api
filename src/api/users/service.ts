import { type IUser, type LoginResponse, Role, User } from "@/api/users/model";
import { UserRepository } from "@/api/users/repository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { comparePasswords, generateJWT, hashPassword } from "@/common/utils/auth";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import type { Types } from "mongoose";
import { Company } from "../company/model";
import { CompanyRepository } from "../company/repository";
import { IWorkspace, Workspace } from "../workspace/model";
import { WorkspaceRepository } from "../workspace/repository";

class UserService {
  private userRepository: UserRepository;
  private workspaceRepository: WorkspaceRepository;
  private companyRepository: CompanyRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
    this.workspaceRepository = new WorkspaceRepository();
    this.companyRepository = new CompanyRepository();
  }

  async create(
    user: IUser,
    createWorkspace = false,
    createCompany = false,
    role = Role.Admin,
  ): Promise<ServiceResponse<IUser | null>> {
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

      if (createCompany) {
        // Create a company
        const company = new Company({
          name: `${user.name}'s company`,
          users: [],
          admins: [newUser._id],
        });

        const newCompany = await this.companyRepository.create(company);
        if (!newCompany) {
          return ServiceResponse.failure("Error creating company", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }

        if (createWorkspace) {
          const workspace = new Workspace({
            name: `${user.name}'s workspace`,
            users: [
              {
                user: newUser._id,
                role,
              },
            ],
            admins: [newUser._id],
            company: newCompany,
          });

          const newWorkspace = await this.workspaceRepository.create(workspace);
          if (!newWorkspace) {
            return ServiceResponse.failure("Error creating workspace", null, StatusCodes.INTERNAL_SERVER_ERROR);
          }
        }
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

  async findOneByEmailWithPassword(email: string): Promise<ServiceResponse<IUser | null>> {
    try {
      const user = await this.userRepository.findOneByEmailWithPassword(email);
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

  async login(email: string, password: string): Promise<ServiceResponse<LoginResponse | null>> {
    try {
      const userResponse = await this.findOneByEmailWithPassword(email);
      if (!userResponse.success || !userResponse.response) {
        return ServiceResponse.failure("Invalid credentials", null, StatusCodes.BAD_REQUEST);
      }

      const isPasswordValid = await comparePasswords(password, userResponse.response.password);
      if (!isPasswordValid) {
        return ServiceResponse.failure("Invalid credentials", null, StatusCodes.BAD_REQUEST);
      }

      const token = generateJWT(userResponse.response);

      const companyId = String(userResponse.response?.company?._id);

      const workspaceId = String(userResponse.response?.workspaces[0]?.workspace._id);

      const response = {
        token,
        companyId,
        workspaceId,
      };
      return ServiceResponse.success<LoginResponse>("Login successful", response, StatusCodes.OK);
    } catch (error) {
      const errorMessage = `Error during login: ${error}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Login failed", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async refreshToken(id: string): Promise<ServiceResponse<string | null>> {
    try {
      const user = await this.findOneById(id);
      if (!user.success || !user.response) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }

      const newToken = generateJWT(user.response);
      return ServiceResponse.success<string>("Token refreshed", newToken, StatusCodes.OK);
    } catch (error) {
      const errorMessage = `Error refreshing token: ${error}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Token refresh failed", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const userService = new UserService();
