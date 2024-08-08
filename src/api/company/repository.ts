import { logger } from "@/server";
import { Company, type ICompany } from "./model";

export class CompanyRepository {
  async create(company: ICompany) {
    try {
      const newCompany = await Company.create(company);
      return newCompany;
    } catch (error) {
      logger.error(`Error creating company: ${error}`);
      return null;
    }
  }

  async update(id: string, company: ICompany) {
    try {
      const updatedCompany = await Company.findByIdAndUpdate(id, company);
      return updatedCompany;
    } catch (error) {
      logger.error(`Error updating company: ${error}`);
      return null;
    }
  }
}
