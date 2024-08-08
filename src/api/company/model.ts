import { type Document, Schema, type Types, model } from "mongoose";

interface ICompany extends Document {
  name: string;
  admins: Types.ObjectId[];
  users: Types.ObjectId[];
  workspaces: Types.ObjectId[];
}

const CompanySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  admins: { type: [Schema.Types.ObjectId], ref: "User", required: true },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  workspaces: [{ type: Schema.Types.ObjectId, ref: "Workspace" }],
});

export const Company = model<ICompany>("Company", CompanySchema);
