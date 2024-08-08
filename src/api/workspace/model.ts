import { Role } from "@/api/users/model";
import { type Document, Schema, type Types, model } from "mongoose";

interface IWorkspace extends Document {
  name: string;
  company: Types.ObjectId;
  users: {
    user: Types.ObjectId;
    role: Role;
  }[];
}

const WorkspaceSchema = new Schema<IWorkspace>({
  name: { type: String, required: true },
  company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  users: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: Role, required: true },
    },
  ],
});

export const Workspace = model<IWorkspace>("Workspace", WorkspaceSchema);
