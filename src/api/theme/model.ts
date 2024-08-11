import { Document, Schema, model, Types, UpdateQuery } from "mongoose";
import { z } from "zod";

// Interface for Theme
export interface ITheme extends Document {
  type: "public" | "private";
  questionColor: string;
  answerColor: string;
  buttonColor: string;
  progressBar: string;
  background: string;
  isCustomized: boolean;
  customized: {
    companyLogo: string;
    shortTextMessage: string;
    avatarImage: string;
  };
  version: number;
  companyId?: Types.ObjectId;
}

// Mongoose schema for Theme
const ThemeSchema = new Schema<ITheme>({
  type: { type: String, enum: ["public", "private"], required: true },
  questionColor: String,
  answerColor: String,
  buttonColor: String,
  progressBar: String,
  background: String,
  isCustomized: Boolean,
  customized: {
    companyLogo: String,
    shortTextMessage: String,
    avatarImage: String,
  },
  version: { type: Number, default: 1 },
  companyId: { type: Types.ObjectId, ref: "Company", default: null },
});

// Middleware to increment version on update
ThemeSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as UpdateQuery<any>;
  if (update !== null) {
    update.$inc = update.$inc || {};
    update.$inc.version = 1;
  }
  next();
});

export const Theme = model<ITheme>("Theme", ThemeSchema);

// Interface for ThemeHistory
export interface IThemeHistory extends Document {
  type: "public" | "private";
  questionColor: string;
  answerColor: string;
  buttonColor: string;
  progressBar: string;
  background: string;
  isCustomized: boolean;
  customized: {
    companyLogo: string;
    shortTextMessage: string;
    avatarImage: string;
  };
  version: number;
  updatedAt: Date;
  companyId?: Types.ObjectId;
}

// Mongoose schema for ThemeHistory
const ThemeHistorySchema = new Schema<IThemeHistory>({
  type: { type: String, enum: ["public", "private"], required: true },
  questionColor: String,
  answerColor: String,
  buttonColor: String,
  progressBar: String,
  background: String,
  isCustomized: Boolean,
  customized: {
    companyLogo: String,
    shortTextMessage: String,
    avatarImage: String,
  },
  version: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
  companyId: { type: Types.ObjectId, ref: "Company", default: null },
});

export const ThemeHistory = model<IThemeHistory>(
  "ThemeHistory",
  ThemeHistorySchema
);

// Zod schema for validation
export const ThemeZodSchema = z.object({
  _id: z.string(),
  type: z.enum(["public", "private"]),
  questionColor: z.string(),
  answerColor: z.string(),
  buttonColor: z.string(),
  progressBar: z.string(),
  background: z.string(),
  isCustomized: z.boolean(),
  customized: z.object({
    companyLogo: z.string(),
    shortTextMessage: z.string(),
    avatarImage: z.string(),
  }),
  version: z.number().optional(),
  companyId: z.string().optional(),
});

export const CreateThemeSchema = ThemeZodSchema.omit({ version: true, _id: true });
export const UpdateThemeSchema = ThemeZodSchema.omit({ _id: true });
export const DeleteThemeSchema = z.object({
  _id: z.string().uuid(),
});
