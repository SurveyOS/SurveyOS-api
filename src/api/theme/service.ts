import { InternalServerError } from "@/common/models/customError";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import type { ITheme } from "./model";
import { ThemeRepository } from "./repository";

class ThemeService {
  private themeRepository: ThemeRepository;

  constructor(repository: ThemeRepository = new ThemeRepository()) {
    this.themeRepository = repository;
  }

  async create(theme: ITheme): Promise<ServiceResponse<ITheme | null>> {
    try {
      const newTheme = await this.themeRepository.create(theme);
      if (!newTheme) {
        throw new InternalServerError("Error creating theme");
      }

      return ServiceResponse.success<ITheme>("Theme created successfully", newTheme, StatusCodes.CREATED);
    } catch (error) {
      const errorMessage = `Error creating theme: ${error}`;
      logger.error(errorMessage);
      throw new InternalServerError(errorMessage);
    }
  }

  async update(id: string, theme: Partial<ITheme>): Promise<ServiceResponse<ITheme | null>> {
    try {
      const updatedTheme = await this.themeRepository.update(id, theme);
      if (!updatedTheme) {
        throw new InternalServerError("Error updating theme");
      }

      return ServiceResponse.success<ITheme>("Theme updated successfully", updatedTheme, StatusCodes.OK);
    } catch (error) {
      const errorMessage = `Error updating theme: ${error}`;
      logger.error(errorMessage);
      throw new InternalServerError(errorMessage);
    }
  }
}

export const themeService = new ThemeService();
