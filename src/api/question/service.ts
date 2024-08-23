import type { CreateQuestionDto } from "@/api/question/dto";
import { CreateQuestionSchema, type IQuestion, Question } from "@/api/question/model";
import { QuestionRepository } from "@/api/question/repository";
import { InternalServerError, ValidationError } from "@/common/models/customError";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";

class QuestionService {
  private questionRepository: QuestionRepository;

  constructor(repository: QuestionRepository = new QuestionRepository()) {
    this.questionRepository = repository;
  }

  async create(question: CreateQuestionDto): Promise<ServiceResponse<IQuestion | null>> {
    try {
      // validate the question object
      const questionSchema = CreateQuestionSchema.parse(question);
      // check if questionSchema is valid
      if (!questionSchema) {
        throw new ValidationError("Invalid question object");
      }
      const questionPayload = new Question(question);
      const newQuestion = await this.questionRepository.create(questionPayload);
      if (!newQuestion) {
        throw new ValidationError("Error creating question");
      }
      return ServiceResponse.success<IQuestion>("Question created successfully", newQuestion, StatusCodes.CREATED);
    } catch (error) {
      const errorMessage = `Error creating question: ${error}`;
      logger.error(errorMessage);
      throw new InternalServerError(errorMessage);
    }
  }

  async update(id: string, question: CreateQuestionDto): Promise<ServiceResponse<IQuestion | null>> {
    try {
      if (!id) {
        throw new ValidationError("Invalid question id");
      }
      // const questionPayload = new Question(question);
      const updatedQuestion = await this.questionRepository.update(id, question);
      if (!updatedQuestion) {
        throw new ValidationError("Error updating question");
      }
      return ServiceResponse.success<IQuestion>("Question updated successfully", updatedQuestion, StatusCodes.OK);
    } catch (error) {
      const errorMessage = `Error updating question: ${error}`;
      logger.error(errorMessage);
      throw new InternalServerError(errorMessage);
    }
  }

  async delete(id: string): Promise<ServiceResponse<IQuestion | null>> {
    try {
      if (!id) {
        throw new ValidationError("Invalid question id");
      }
      const deletedQuestion = await this.questionRepository.delete(id);
      if (!deletedQuestion) {
        throw new ValidationError("Error deleting question");
      }
      return ServiceResponse.success<IQuestion>("Question deleted successfully", deletedQuestion, StatusCodes.OK);
    } catch (error) {
      const errorMessage = `Error deleting question: ${error}`;
      logger.error(errorMessage);
      throw new InternalServerError(errorMessage);
    }
  }

  async copy(id: string): Promise<ServiceResponse<IQuestion | null>> {
    try {
      if (!id) {
        throw new ValidationError("Invalid question id");
      }
      const question = await this.questionRepository.get(id);
      if (!question) {
        throw new ValidationError("Error getting question");
      }
      const newQuestion = await this.questionRepository.create(question);
      if (!newQuestion) {
        throw new ValidationError("Error copying question");
      }
      return ServiceResponse.success<IQuestion>("Question copied successfully", newQuestion, StatusCodes.CREATED);
    } catch (error) {
      const errorMessage = `Error copying question: ${error}`;
      logger.error(errorMessage);
      throw new InternalServerError(errorMessage);
    }
  }
}

export const questionService = new QuestionService();
