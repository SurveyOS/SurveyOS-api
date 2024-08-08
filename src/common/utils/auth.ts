import type { User } from "@/api/users/model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "./envConfig";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateJWT = (user: User): string => {
  return jwt.sign({ id: user._id, email: user.email }, env.JWT_SECRET, { expiresIn: "1h" });
};
