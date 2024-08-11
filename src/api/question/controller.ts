// controller.ts
import { Question } from "@/api/question/model";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { questionService } from "./service";
import { ValidationError } from "@/common/models/customError";

class QuestionController {
  public createQuestion: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const { type, postSubmit, onLoad, label, isRequired, validations } =
      req.body;

    const newQuestion = await questionService.create({
      type,
      postSubmit: postSubmit || "",
      onLoad: onLoad || "",
      label,
      isRequired,
      validations,
    });

    return handleServiceResponse(newQuestion, res);
  };

  public updateQuestion: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const { id } = req.params;
    const {
      questionId,
      type,
      postSubmit,
      onLoad,
      label,
      isRequired,
      validations,
    } = req.body;

    const question = new Question({
      questionId,
      type,
      postSubmit: postSubmit || "",
      onLoad: onLoad || "",
      label,
      isRequired,
      validations,
    });

    const updatedQuestion = await questionService.update(id, question);

    return handleServiceResponse(updatedQuestion, res);
  };

  public deleteQuestion: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
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
