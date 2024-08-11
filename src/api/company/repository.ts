import { logger } from "@/server";
import { Company, type ICompany } from "./model";
import { User } from "../users/model";

export class CompanyRepository {
  async create(company: ICompany) {
    try {
      const newCompany = await Company.create(company);
      await User.findByIdAndUpdate(company.admins[0]._id, {
        company: newCompany._id,
        role: "admin",
      });
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

  async findOneById(id: string) {
    try {
      const company = await Company.findById(id);
      return company;
    } catch (error) {
      logger.error(`Error finding company by id: ${error}`);
      return null;
    }
  }
}
