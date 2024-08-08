import { Company } from "@/api/company/model";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "../users/service";
import { companyService } from "./service";

class CompanyController {
  public createCompany: RequestHandler = async (req: Request, res: Response) => {
    const { name, adminId } = req.body;

    const existingUser = await userService.findOneById(adminId);
    if (!existingUser.success) {
      return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
    }

    if (existingUser.response?.company._id) {
      return ServiceResponse.failure("User is already in another company", null, StatusCodes.BAD_REQUEST);
    }

    const company = new Company({
      name,
      admins: [adminId],
      users: [adminId],
      workspaces: [],
    });

    const newCompany = await companyService.create(company);

    return handleServiceResponse(newCompany, res);
  };

  public addUserToCompany: RequestHandler = async (req: Request, res: Response) => {
    const { companyId, userId, role } = req.body;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Company not found",
      });
    }

    const user = await userService.findOneById(userId);

    if (!user.success) {
      return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
    }

    if (company.users.includes(userId)) {
      return ServiceResponse.failure("User is already in this company", null, StatusCodes.BAD_REQUEST);
    }

    if (user.response?.company._id) {
      return ServiceResponse.failure("User is already in another company", null, StatusCodes.BAD_REQUEST);
    }

    const updatedCompany = new Company({
      ...company,
      users: [...company.users, userId],
      admins: role === "admin" ? [...company.admins, userId] : company.admins,
    });

    const updatedCompanyResponse = await companyService.update(companyId, updatedCompany);

    return handleServiceResponse(updatedCompanyResponse, res);
  };
}

export const companyController = new CompanyController();
