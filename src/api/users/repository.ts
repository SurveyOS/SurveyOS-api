import { User } from "./model";

export class UserRepository {
  async create(user: User) {
    return User.create(user);
  }

  async findOneByEmail(email: string) {
    return User.findOne({ email }).populate("company").populate("workspaces.workspace");
  }

  async findOneById(id: string) {
    return User.findById(id).populate("company").populate("workspaces.workspace");
  }

  async updateOneById(id: string, user: Partial<User>) {
    return User.findByIdAndUpdate(id, user, { new: true }).populate("company").populate("workspaces.workspace");
  }

  async deleteOneById(id: string) {
    return User.findByIdAndDelete(id);
  }
}
