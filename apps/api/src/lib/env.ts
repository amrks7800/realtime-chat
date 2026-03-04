import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
  MONGO_URI: z.string().min(1),
  BASE_URL: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_S3_BUCKET: z.string().min(1),
  AWS_REGION: z.string().min(1),
  GMP_API_KEY: z.string().min(1),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

export const env = envSchema.parse(process.env);

console.log("env", env);
