import { logger } from "@/server";
import _ from "lodash";
import { User } from "../users/model";
import { type IWorkspace, Workspace } from "./model";

export class WorkspaceRepository {
  async create(workspace: IWorkspace) {
    try {
      const newWorkspace = await Workspace.create(workspace);
      User.findByIdAndUpdate(workspace.users[0].user, {
        $push: {
          workspaces: {
            workspace: newWorkspace._id,
            role: workspace.users[0].role,
          },
        },
      });

      return newWorkspace;
    } catch (error) {
      logger.error(`Error creating workspace: ${error}`);
      return null;
    }
  }

  async update(id: string, workspace: IWorkspace) {
    try {
      const oldWorkspace = await Workspace.findById(id);
      const updatedWorkspace = await Workspace.findByIdAndUpdate(id, workspace);

      if (_.isEqual(oldWorkspace?.users, updatedWorkspace?.users)) {
        const removedUsers =
          oldWorkspace?.users && updatedWorkspace?.users
            ? _.differenceBy(oldWorkspace?.users, updatedWorkspace?.users, "user")
            : [];

        const addedUsers =
          oldWorkspace?.users && updatedWorkspace?.users
            ? _.differenceBy(updatedWorkspace?.users, oldWorkspace?.users, "user")
            : [];

        const updatedUsers =
          oldWorkspace?.users && updatedWorkspace?.users
            ? _.intersectionBy(oldWorkspace?.users, updatedWorkspace?.users, "user")
            : [];

        await User.updateMany(
          {
            _id: {
              $in: [
                ...removedUsers.map((user) => user.user),
                ...updatedUsers.map((user) => user.user),
                ...addedUsers.map((user) => user.user),
              ],
            },
          },
          {
            $pull: {
              workspaces: {
                workspace: id,
              },
            },
          },
        );
      }

      return updatedWorkspace;
    } catch (error) {
      logger.error(`Error updating workspace: ${error}`);
      return null;
    }
  }

  async findOneById(id: string) {
    try {
      const workspace = await Workspace.findById(id).populate("company").populate("users.user");
      return workspace;
    } catch (error) {
      logger.error(`Error finding workspace by id: ${error}`);
      return null;
    }
  }

  async delete(id: string) {
    try {
      const deletedWorkspace = await Workspace.findByIdAndDelete(id);

      if (deletedWorkspace) {
        await User.updateMany(
          {
            _id: {
              $in: deletedWorkspace.users.map((user) => user.user),
            },
          },
          {
            $pull: {
              workspaces: {
                workspace: id,
              },
            },
          },
        );
      }

      return deletedWorkspace;
    } catch (error) {
      logger.error(`Error deleting workspace: ${error}`);
      return null;
    }
  }
}
