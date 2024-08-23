// model.ts
import { type Document, Schema, type Types, model } from "mongoose";
import { z } from "zod";

// Define the interface
export interface IQuestion extends Document {
  type: string;
  postSubmit?: string;
  onLoad?: string;
  label: string;
  isRequired: boolean;
  validations: string[];
  isDeleted: boolean;
}

// Define the Mongoose schema
const QuestionSchema = new Schema<IQuestion>({
  type: { type: String, required: true },
  postSubmit: { type: String, default: "" },
  onLoad: { type: String, default: "" },
  label: { type: String, required: true },
  isRequired: { type: Boolean, required: true },
  validations: { type: [String], default: [] },
    isDeleted: { type: Boolean, default: false },
});

// Create the Mongoose model
export const Question = model<IQuestion>("Question", QuestionSchema);

// Define Zod schema for validation
export const QuestionZodSchema = z.object({
    _id: z.string(),
  type: z.string(),
  postSubmit: z.string().default(""),
  onLoad: z.string().default(""),
  label: z.string(),
  isRequired: z.boolean(),
  validations: z.array(z.string()).default([]),
  isDeleted: z.boolean().default(false),
});


// Schema for updates
export const UpdateQuestionSchema = QuestionZodSchema.omit({ _id: true });

// Schema for deletion
export const DeleteQuestionSchema = z.object({
  _id: z.string().uuid(),
});

// Define schema without `_id` for creation
export const CreateQuestionSchema = QuestionZodSchema.omit({ _id: true });
