import { type Document, Schema, type Types, model } from "mongoose";
import { z } from "zod";

export interface ICompany extends Document {
  name: string;
  admins: Types.ObjectId[];
  users: Types.ObjectId[];
  workspaces: Types.ObjectId[];
}

const ICompanySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  admins: { type: [Schema.Types.ObjectId], ref: "User", required: true },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  workspaces: [{ type: Schema.Types.ObjectId, ref: "Workspace" }],
});

export const Company = model<ICompany>("Company", ICompanySchema);

export const CompanySchema = z.object({
  _id: z.string(),
  name: z.string(),
  admins: z.array(z.string()),
  users: z.array(z.string()),
  workspaces: z.array(z.string()),
});

export const CreateCompanySchema = z.object({
  name: z.string(),
  adminId: z.string(),
});

export const UpdateCompanySchema = z.object({
  companyId: z.string(),
  userId: z.string(),
  role: z.string(),
});

export const DeleteUserFromCompanySchema = z.object({
  companyId: z.string(),
  userId: z.string(),
});
