import { Request, Response } from "express";
import { surveyService } from "./service";
import { StatusCodes } from "http-status-codes";

export class SurveyController {
  static async createSurvey(req: Request, res: Response) {
    const surveyData = req.body;
    const response = await surveyService.createSurvey(surveyData);
    res.status(response.statusCode).json(response);
  }

  static async updateSurvey(req: Request, res: Response) {
    const surveyId = req.params.id;
    const updateData = req.body;
    const response = await surveyService.updateSurvey(surveyId, updateData);
    res.status(response.statusCode).json(response);
  }

  static async getSurveyHistory(req: Request, res: Response) {
    const surveyId = req.params.id;
    const response = await surveyService.getSurveyHistory(surveyId);
    res.status(response.statusCode).json(response);
  }

  static async getSurvey(req: Request, res: Response) {
    const surveyId = req.params.id;
    const response = await surveyService.getSurvey(surveyId);
    res.status(response.statusCode).json(response);
  }

}
