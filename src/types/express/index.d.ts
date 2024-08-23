import type { IUser } from "@/api/users/model";

export interface RequestUser extends Pick<IUser, "id" | "email"> {}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}
