import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { type Document, Schema, type Types, model } from "mongoose";
import { z } from "zod";

extendZodWithOpenApi(z);

export enum Role {
  Admin = "admin",
  Creator = "creator",
  Member = "member",
}

enum Provider {
  Google = "google",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  provider: Provider;
  company: Types.ObjectId;
  workspaces: {
    workspace: Types.ObjectId;
    role: Role;
  }[];
}

const IUserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  googleId: { type: String, unique: false },
  avatar: { type: String },
  provider: { type: String, enum: Provider, required: false },
  company: { type: Schema.Types.ObjectId, ref: "Company", required: false },
  workspaces: [
    {
      workspace: { type: Schema.Types.ObjectId, ref: "Workspace" },
      role: { type: String, enum: Role, required: true },
    },
  ],
});

export const User = model<IUser>("User", IUserSchema);

// Validation user schema
export const UserSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  googleId: z.string().nullable(),
  avatar: z.string().nullable(),
  provider: z.nativeEnum(Provider),
  company: z.string().nullable(),
  workspaces: z.array(
    z.object({
      workspace: z.string(),
      role: z.nativeEnum(Role),
    }),
  ),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export const CreateUserSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    company: z.string().nullable().optional(),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export const GoogleLoginSchema = z.object({
  body: z.object({
    googleId: z.string(),
    email: z.string().email(),
    name: z.string().optional(),
    avatar: z.string().optional(),
  }),
});
