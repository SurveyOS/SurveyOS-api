// repository.ts
import { logger } from "@/server";
import { type IQuestion, Question } from "./model";

export class QuestionRepository {
  async create(question: IQuestion) {
    try {
      const newQuestion = await Question.create(question);
      return newQuestion;
    } catch (error) {
      logger.error(`Error creating question: ${error}`);
      return null;
    }
  }

  async update(id: string, question: IQuestion) {
    try {
      const updatedQuestion = await Question.findByIdAndUpdate(id, question, {
        new: true,
      });
      return updatedQuestion;
    } catch (error) {
      logger.error(`Error updating question: ${error}`);
      return null;
    }
  }

  async delete(id: string) {
    try {
      const deletedQuestion = await Question.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
      return deletedQuestion;
    } catch (error) {
      logger.error(`Error deleting question: ${error}`);
      return null;
    }
  }

  async get(id: string) {
    try {
      const question = await Question.findById(id);
      return question;
    } catch (error) {
      logger.error(`Error getting question: ${error}`);
      return null;
    }
  }

  async getMany(ids: string[]) {
    try {
      const questions = await Question.find({ _id: { $in: ids } });
      return questions;
    } catch (error) {
      logger.error(`Error getting questions: ${error}`);
      return null;
    }
  }
}
