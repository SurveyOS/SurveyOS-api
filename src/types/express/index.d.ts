import type { IUser } from "@/api/users/model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
