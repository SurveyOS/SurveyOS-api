import { type ISurvey, type ISurveyHistory, Survey, SurveyHistory } from "./model";

export class SurveyRepository {
  async create(surveyData: ISurvey): Promise<ISurvey> {
    const survey = new Survey(surveyData);
    return await survey.save();
  }

  async findById(surveyId: string): Promise<ISurvey | null> {
    return await Survey.findById(surveyId);
  }

  async update(surveyId: string, updateData: Partial<ISurvey>): Promise<ISurvey | null> {
    const survey = await Survey.findByIdAndUpdate(surveyId, updateData, { new: true });
    return survey;
  }

  async saveHistory(surveyHistoryData: ISurveyHistory): Promise<ISurveyHistory> {
    const surveyHistory = new SurveyHistory(surveyHistoryData);
    return await surveyHistory.save();
  }

  async getHistory(surveyId: string): Promise<ISurveyHistory[]> {
    return await SurveyHistory.find({ surveyId });
  }

  async delete(surveyId: string): Promise<void> {
    await Survey.findByIdAndUpdate(surveyId, { isDeleted: true });
  }
}
