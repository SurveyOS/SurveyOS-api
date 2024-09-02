import { InternalServerError, NotFoundError } from "@/common/models/customError";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { type ISurvey, type ISurveyHistory, type ISurveyTemplate, SurveyHistory } from "./model";
import { SurveyRepository } from "./repository";
import { QuestionRepository } from "../question/repository"

class SurveyService {
  private surveyRepository: SurveyRepository;
  private questionRepository: QuestionRepository;

  constructor(repository: SurveyRepository = new SurveyRepository()) {
    this.surveyRepository = repository;
    this.questionRepository = new QuestionRepository();

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

  async addQuestion(surveyId: string, questionId: string): Promise<ServiceResponse<ISurvey | null>> {
    try {
      const updatedSurvey = await this.surveyRepository.addQuestion(surveyId, questionId);
      return ServiceResponse.success("Question added to survey successfully", updatedSurvey, StatusCodes.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Error adding question to survey");
    }
  }

  async createTemplate(surveyTemplate: ISurveyTemplate): Promise<ServiceResponse<ISurveyTemplate | null>> {
    try {
      const newTemplate = await this.surveyRepository.createTemplate(surveyTemplate);
      if (!newTemplate) {
        throw new InternalServerError("Error creating survey template");
      }

      return ServiceResponse.success("Survey template created successfully", newTemplate, StatusCodes.CREATED);
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Error creating survey template");
    }
  }

  async deleteTemplate(surveyTemplateId: string): Promise<ServiceResponse<null>> {
    try {
      await this.surveyRepository.deleteTemplate(surveyTemplateId);
      return ServiceResponse.success("Survey template deleted successfully", null, StatusCodes.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Error deleting survey template");
    }
  }
}

export const surveyService = new SurveyService();
