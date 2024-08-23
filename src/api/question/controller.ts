import { ValidationError } from "@/common/models/customError";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { Request, RequestHandler, Response } from "express";
import { surveyService } from "../survey/service";
import { questionService } from "./service";

class QuestionController {
  public createQuestion: RequestHandler = async (req: Request, res: Response) => {
    const { type, postSubmit, onLoad, label, isRequired, validations, surveyId } = req.body;

    const newQuestion = await questionService.create({
      type,
      postSubmit: postSubmit || "",
      onLoad: onLoad || "",
      label,
      isRequired,
      validations,
    });
    // add the question to the survey
    //@ts-ignore
    await surveyService.addQuestion(surveyId, newQuestion.response?._id);
    return handleServiceResponse(newQuestion, res);
  };

  public updateQuestion: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { type, postSubmit, onLoad, label, isRequired, validations, surveyId } = req.body;

    const question = {
      type,
      postSubmit: postSubmit || "",
      onLoad: onLoad || "",
      label,
      isRequired,
      validations,
      surveyId,
    };

    const updatedQuestion = await questionService.update(id, question);

    return handleServiceResponse(updatedQuestion, res);
  };

  public deleteQuestion: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    const deletedQuestion = await questionService.delete(id);

    return handleServiceResponse(deletedQuestion, res);
  };

  public copyQuestion: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new ValidationError("Invalid question id");
    }

    const copiedQuestion = await questionService.copy(id);

    return handleServiceResponse(copiedQuestion, res);
  };
}

export const questionController = new QuestionController();
