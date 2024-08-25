import { Role } from "@/api/users/model";
import { type Document, Schema, type Types, model, ObjectId } from "mongoose";
import { z } from "zod";

export interface IWorkspace extends Document {
  name: string;
  company: Types.ObjectId;
  users: {
    user: Types.ObjectId;
    role: Role;
  }[];
}

const IWorkspaceSchema = new Schema<IWorkspace>({
  name: { type: String, required: true },
  company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  users: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: Role, required: true },
    },
  ],
});

export const Workspace = model<IWorkspace>("Workspace", IWorkspaceSchema);

export const WorkspaceSchema = z.object({
  _id: z.string(),
  name: z.string(),
  company: z.string(),
  users: z.array(
    z.object({
      user: z.string(),
      role: z.nativeEnum(Role),
    }),
  ),
});

export const CreateWorkspaceSchema = z.object({
  name: z.string(),
  companyId: z.string(),
  userId: z.string(),
});
