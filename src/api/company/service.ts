import type { ICompany } from "@/api/company/model";
import { CompanyRepository } from "@/api/company/repository";
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

  async update(id: string, company: ICompany): Promise<ServiceResponse<ICompany | null>> {
    try {
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
