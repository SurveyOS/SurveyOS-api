import { logger } from "@/server";
import _ from "lodash";
import { User } from "../users/model";
import { Company, type ICompany } from "./model";

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
      const oldCompany = await Company.findById(id);
      const updatedCompany = await Company.findByIdAndUpdate(id, company);

      if (_.isEqual(oldCompany?.users, updatedCompany?.users)) {
        const users = updatedCompany?.users.map((user) => user._id);
        await User.updateMany({ _id: { $in: users } }, { company: updatedCompany?._id });
      }

      return updatedCompany;
    } catch (error) {
      logger.error(`Error updating company: ${error}`);
      return null;
    }
  }

  async findOneById(id: string) {
    try {
      const company = await Company.findById(id).populate({
        path: "/api/v1users",
        select: "name email role",
        populate: {
          path: "/api/v1workspace",
        },
      });
      return company;
    } catch (error) {
      logger.error(`Error finding company by id: ${error}`);
      return null;
    }
  }
}
