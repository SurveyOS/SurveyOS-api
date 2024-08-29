import { type Document, Schema, type Types, model } from "mongoose";
import { z } from "zod";

// Survey Interface
export interface ISurvey extends Document {
  workspaceId: Types.ObjectId;
  questions: Types.ObjectId[];
  theme: Types.ObjectId;
  language: string;
  config: Record<string, any>;
  type: "email" | "website" | "app";
  version: number;
  _id: Types.ObjectId;
  isDeleted?: boolean;
}

// Survey Schema
const SurveySchema = new Schema<ISurvey>({
  workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  theme: { type: Schema.Types.ObjectId, ref: "Theme", default: null },
  language: { type: String, required: true },
  config: { type: Schema.Types.Mixed },
  type: { type: String, enum: ["email", "website", "app"], required: true },
  version: { type: Number, default: 1, required: true },
  isDeleted: { type: Boolean, default: false },
});

// survey zod schema
export const SurveyZodSchema = z.object({
  _id: z.string(),
  workspaceId: z.string(),
  questions: z.array(z.string()),
  theme: z.string(),
  langugae: z.string(),
  config: z.record(z.any()),
  type: z.enum(["email", "website", "app"]),
  version: z.number(),
  isDeleted: z.boolean().optional(),
});

export const Survey = model<ISurvey>("Survey", SurveySchema);

// Survey History Interface
export interface ISurveyHistory extends Document {
  surveyId: Types.ObjectId;
  workspaceId: Types.ObjectId;
  questions: Types.ObjectId[];
  theme: Types.ObjectId;
  language: string;
  config: Record<string, any>;
  type: "email" | "website" | "app";
  version: number;
  timestamp: Date;
}

// Survey History Schema
const SurveyHistorySchema = new Schema<ISurveyHistory>({
  surveyId: { type: Schema.Types.ObjectId, ref: "Survey", required: true },
  workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  theme: { type: Schema.Types.ObjectId, ref: "Theme" },
  language: { type: String, required: true },
  config: { type: Schema.Types.Mixed },
  type: { type: String, enum: ["email", "website", "app"], required: true },
  version: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now, required: true },
});

export const SurveyHistory = model<ISurveyHistory>("SurveyHistory", SurveyHistorySchema);

// SurveyTemplate Schema
export interface ISurveyTemplate extends Omit<ISurvey, "workspaceId" | "updatedAt"> {
  tags: string[];
}

const SurveyTemplateSchema = new Schema<ISurveyTemplate>({
  tags: { type: [String], default: [] },
  type: { type: String, enum: ["email", "website", "app"], required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question", required: true }],
  theme: { type: Schema.Types.ObjectId, ref: "Theme", required: true },
  language: { type: String, required: true },
  config: { type: Schema.Types.Mixed, default: {} },
});

export const SurveyTemplate = model<ISurveyTemplate>("SurveyTemplate", SurveyTemplateSchema);
export const CreateSurveySchema = SurveyZodSchema.omit({ _id: true });
export const UpdateSurveySchema = SurveyZodSchema.omit({ _id: true });
export const DeleteSurveySchema = z.object({
  _id: z.string().uuid(),
});
