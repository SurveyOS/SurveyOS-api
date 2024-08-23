import { logger } from "@/server";
import { type ITheme, IThemeHistory, Theme, ThemeHistory } from "./model";

export class ThemeRepository {
  async create(theme: ITheme): Promise<ITheme | null> {
    try {
      const newTheme = await Theme.create(theme);
      return newTheme;
    } catch (error) {
      logger.error(`Error creating theme: ${error}`);
      return null;
    }
  }

  async update(id: string, theme: Partial<ITheme>): Promise<ITheme | null> {
    try {
      // Fetch current theme to save to history
      const currentTheme = await Theme.findById(id);
      if (currentTheme) {
        const history = {
          type: currentTheme.type,
          questionColor: currentTheme.questionColor,
          answerColor: currentTheme.answerColor,
          buttonColor: currentTheme.buttonColor,
          progressBar: currentTheme.progressBar,
          background: currentTheme.background,
          isCustomized: currentTheme.isCustomized,
          customized: currentTheme.customized,
          version: currentTheme.version,
          updatedAt: new Date(),
        };
        await ThemeHistory.create(history);
      }

      const updatedTheme = await Theme.findOneAndUpdate(
        { _id: id },
        { ...theme, $inc: { version: 1 }, updatedAt: new Date() },
        { new: true },
      );
      return updatedTheme;
    } catch (error) {
      logger.error(`Error updating theme: ${error}`);
      return null;
    }
  }
}
