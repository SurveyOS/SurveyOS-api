import { Company } from "@/api/company/model";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { Request, RequestHandler, Response } from "express";
import { companyService } from "./service";

class CompanyController {
  public createCompany: RequestHandler = async (req: Request, res: Response) => {
    const { name, adminId } = req.body;

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

    const updatedCompanyResponse = await companyService.update(companyId, userId, role);

    return handleServiceResponse(updatedCompanyResponse, res);
  };
}

export const companyController = new CompanyController();
