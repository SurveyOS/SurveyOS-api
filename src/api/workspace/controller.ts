import { Role } from "@/api/users/model";
import { Workspace } from "@/api/workspace/model";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { Request, RequestHandler, Response } from "express";
import { workspaceService } from "./service";

class WorkspaceController {
  public createWorkspace: RequestHandler = async (req: Request, res: Response) => {
    const { name, companyId, userId } = req.body;

    const workspace = new Workspace({
      name,
      company: companyId,
      users: [{ user: userId, role: Role.Admin }],
    });

    const newWorkspace = await workspaceService.create(workspace);

    return handleServiceResponse(newWorkspace, res);
  };

  public updateUserInWorkspace: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { users } = req.body;

    const updatedWorkspace = await workspaceService.update(id, users);

    return handleServiceResponse(updatedWorkspace, res);
  };

  public getWorkspace: RequestHandler = async (req: Request, res: Response) => {
    const { companyId } = req.params;

    const workspace = await workspaceService.get(companyId);

    return handleServiceResponse(workspace, res);
  };

  public deleteWorkspace: RequestHandler = async (req: Request, res: Response) => {
    const { companyId } = req.params;

    const deletedWorkspace = await workspaceService.delete(companyId);

    return handleServiceResponse(deletedWorkspace, res);
  };
}

export const workspaceController = new WorkspaceController();
