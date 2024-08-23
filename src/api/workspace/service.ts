import type { Role } from "@/api/users/model";
import { type IWorkspace, Workspace } from "@/api/workspace/model";
import { WorkspaceRepository } from "@/api/workspace/repository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";

class WorkspaceService {
  private workspaceRepository: WorkspaceRepository;

  constructor(repository: WorkspaceRepository = new WorkspaceRepository()) {
    this.workspaceRepository = repository;
  }

  async create(workspace: IWorkspace): Promise<ServiceResponse<IWorkspace | null>> {
    try {
      if (!workspace.users.length) {
        return ServiceResponse.failure("Invalid users", null, StatusCodes.BAD_REQUEST);
      }

      const newWorkspace = await this.workspaceRepository.create(workspace);

      if (!newWorkspace) {
        return ServiceResponse.failure("Error creating workspace", null, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return ServiceResponse.success<IWorkspace>("Workspace created successfully", workspace, StatusCodes.CREATED);
    } catch (error) {
      return ServiceResponse.failure("Error creating workspace", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, users: { user: string; role: Role }[]): Promise<ServiceResponse<IWorkspace | null>> {
    try {
      const workspace = await this.workspaceRepository.findOneById(id);

      const newWorkspace = new Workspace({
        ...workspace,
        users,
      });
      const updatedWorkspace = await this.workspaceRepository.update(id, newWorkspace);

      if (!updatedWorkspace) {
        return ServiceResponse.failure("Error updating workspace", null, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return ServiceResponse.success<IWorkspace>("Workspace updated successfully", updatedWorkspace, StatusCodes.OK);
    } catch (error) {
      return ServiceResponse.failure("Error updating workspace", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async get(id: string): Promise<ServiceResponse<IWorkspace | null>> {
    try {
      const workspace = await this.workspaceRepository.findOneById(id);

      if (!workspace) {
        return ServiceResponse.failure("Workspace not found", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<IWorkspace>("Workspace found", workspace, StatusCodes.OK);
    } catch (error) {
      return ServiceResponse.failure("Error finding workspace", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: string): Promise<ServiceResponse<IWorkspace | null>> {
    try {
      const deletedWorkspace = await this.workspaceRepository.delete(id);

      if (!deletedWorkspace) {
        return ServiceResponse.failure("Error deleting workspace", null, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      return ServiceResponse.success<IWorkspace>("Workspace deleted successfully", deletedWorkspace, StatusCodes.OK);
    } catch (error) {
      return ServiceResponse.failure("Error deleting workspace", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const workspaceService = new WorkspaceService();
