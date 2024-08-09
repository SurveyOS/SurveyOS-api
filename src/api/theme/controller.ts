import { Request, Response, RequestHandler } from "express";
import { Theme } from "./model";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { themeService } from "./service";

class ThemeController {
  public createTheme: RequestHandler = async (req: Request, res: Response) => {
    const {
      type,
      questionColor,
      answerColor,
      buttonColor,
      progressBar,
      background,
      isCustomized,
      customized,
      companyId,
    } = req.body;

    const theme = new Theme({
      type,
      questionColor,
      answerColor,
      buttonColor,
      progressBar,
      background,
      isCustomized,
      customized,
      companyId,
    });

    const newTheme = await themeService.create(theme);

    return handleServiceResponse(newTheme, res);
  };

  public updateTheme: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
      type,
      questionColor,
      answerColor,
      buttonColor,
      progressBar,
      background,
      isCustomized,
      customized,
      companyId,
    } = req.body;

    const theme = {
      type,
      questionColor,
      answerColor,
      buttonColor,
      progressBar,
      background,
      isCustomized,
      customized,
      companyId,
    };

    const updatedTheme = await themeService.update(id, theme);

    return handleServiceResponse(updatedTheme, res);
  };
}

export const themeController = new ThemeController();
