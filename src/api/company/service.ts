import { Company, type ICompany } from "@/api/company/model";
import { CompanyRepository } from "@/api/company/repository";
import type { Role } from "@/api/users/model";
import { userService } from "@/api/users/service";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";

class CompanyService {
  private companyRepository: CompanyRepository;

  constructor(repository: CompanyRepository = new CompanyRepository()) {
    this.companyRepository = repository;
  }

  async create(company: ICompany): Promise<ServiceResponse<ICompany | null>> {
    try {
      if(!company.admins.length) {
        return ServiceResponse.failure("Invalid adminId", null, StatusCodes.BAD_REQUEST);
      }

      if(!company.users.length) {
        return ServiceResponse.failure("Invalid userId", null, StatusCodes.BAD_REQUEST);
      }
      
      const adminId = company.admins[0]._id.toString();

      const existingUser = await userService.findOneById(adminId);

      if (!existingUser.success) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }

      if (existingUser.response?.company?._id) {
        return ServiceResponse.failure("User is already in another company", null, StatusCodes.BAD_REQUEST);
      }

      const newCompany = await this.companyRepository.create(company);
      if (!newCompany) {
        return ServiceResponse.failure("Error creating company", null, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return ServiceResponse.success<ICompany>("Company created successfully", newCompany, StatusCodes.CREATED);
    } catch (error) {
      const errorMessage = `Error creating company: ${error}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Company not created", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, userId: string, role: Role): Promise<ServiceResponse<ICompany | null>> {
    try {
      const existingCompany = await this.companyRepository.findOneById(id);
      if (!existingCompany) {
        return ServiceResponse.failure("Company not found", null, StatusCodes.NOT_FOUND);
      }

      const user = await userService.findOneById(userId);

      if (!user.success) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }

      if (existingCompany.users.some((user) => user.equals(userId))) {
        return ServiceResponse.failure("User is already in this company", null, StatusCodes.BAD_REQUEST);
      }

      if (user.response?.company?._id) {
        return ServiceResponse.failure("User is already in another company", null, StatusCodes.BAD_REQUEST);
      }

      const company = new Company({
        ...existingCompany,
        users: [...existingCompany.users, userId],
        admins: role === "admin" ? [...existingCompany.admins, userId] : existingCompany.admins,
      });

      const updatedCompany = await this.companyRepository.update(id, company);

      if (!updatedCompany) {
        return ServiceResponse.failure("Error updating company", null, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return ServiceResponse.success<ICompany>("Company updated successfully", updatedCompany, StatusCodes.OK);
    } catch (error) {
      const errorMessage = `Error updating company: ${error}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Company not updated", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const companyService = new CompanyService();
