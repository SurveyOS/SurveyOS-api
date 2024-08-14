import { InternalServerError, NotFoundError } from "@/common/models/customError";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { type ISurvey, type ISurveyHistory, SurveyHistory } from "./model";
import { SurveyRepository } from "./repository";

class SurveyService {
  private surveyRepository: SurveyRepository;

  constructor(repository: SurveyRepository = new SurveyRepository()) {
    this.surveyRepository = repository;
  }

  async createSurvey(surveyData: ISurvey): Promise<ServiceResponse<ISurvey>> {
    try {
      const newSurvey = await this.surveyRepository.create(surveyData);
      return ServiceResponse.success("Survey created successfully", newSurvey, StatusCodes.CREATED);
    } catch (error) {
      throw new InternalServerError("Error creating survey");
    }
  }

  async updateSurvey(surveyId: string, updateData: Partial<ISurvey>): Promise<ServiceResponse<ISurvey | null>> {
    try {
      const currentSurvey = await this.surveyRepository.findById(surveyId);

      if (!currentSurvey) {
        throw new NotFoundError("Survey not found");
      }

      // Save the current state to history before updating
      const surveyHistory = new SurveyHistory({
        surveyId: currentSurvey._id,
        workspaceId: currentSurvey.workspaceId,
        questions: currentSurvey.questions,
        theme: currentSurvey.theme,
        language: currentSurvey.language,
        config: currentSurvey.config,
        type: currentSurvey.type,
        version: currentSurvey.version,
        timestamp: new Date(),
      });
      await this.surveyRepository.saveHistory(surveyHistory);

      // Increment version and update survey
      updateData.version = (currentSurvey.version || 0) + 1;
      const updatedSurvey = await this.surveyRepository.update(surveyId, updateData);
      return ServiceResponse.success("Survey updated successfully", updatedSurvey, StatusCodes.OK);
    } catch (error) {
      logger.error(`Error updating survey: ${error}`);
      throw new InternalServerError("Error updating survey");
    }
  }

  async getSurveyHistory(surveyId: string): Promise<ServiceResponse<ISurveyHistory[]>> {
    try {
      const history = await this.surveyRepository.getHistory(surveyId);
      return ServiceResponse.success("Survey history retrieved successfully", history, StatusCodes.OK);
    } catch (error) {
      logger.error(`Error retrieving survey history: ${error}`);
      throw new InternalServerError("Error retrieving survey history");
    }
  }

  async getSurvey(surveyId: string): Promise<ServiceResponse<ISurvey | null>> {
    try {
      const survey = await this.surveyRepository.findById(surveyId);
      return ServiceResponse.success("Survey retrieved successfully", survey, StatusCodes.OK);
    } catch (error) {
      logger.error(`Error retrieving survey: ${error}`);
      throw new InternalServerError("Error retrieving survey");
    }
  }

  async deleteSurvey(surveyId: string): Promise<ServiceResponse<null>> {
    try {
      await this.surveyRepository.delete(surveyId);
      return ServiceResponse.success("Survey deleted successfully", null, StatusCodes.OK);
    } catch (error) {
      logger.error(`Error deleting survey: ${error}`);
      throw new InternalServerError("Error deleting survey");
    }
  }
}

export const surveyService = new SurveyService();
