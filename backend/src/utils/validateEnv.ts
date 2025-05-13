import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), "PORT must be a valid number"),
  DATABASE_URL: z.string().nonempty("DATABASE_URL is required"),
  GOOGLE_CLIENT_ID: z.string().nonempty("GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().nonempty("GOOGLE_CLIENT_SECRET is required"),
  GOOGLE_CALLBACK_URL: z.string().nonempty("GOOGLE_CALLBACK_URL is required"),
  SESSION_SECRET: z.string().nonempty("SESSION_SECRET is required"),
  FRONTEND_URL: z.string().url("FRONTEND_URL must be a valid URL"),
  NODE_ENV: z
    .enum(["development", "test", "production"], {
      errorMap: () => ({
        message:
          "NODE_ENV must be either 'development', 'test', or 'production'",
      }),
    })
    .optional(),
  CLOUDINARY_CLOUD_NAME: z
    .string()
    .nonempty("CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().nonempty("CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z
    .string()
    .nonempty("CLOUDINARY_API_SECRET is required"),
});


const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const formattedErrors = parsedEnv.error.errors
    .map((err) => `${err.path.join(".")}: ${err.message}`)
    .join("\n");

  console.error("Environment variable validation failed:\n", formattedErrors);

  throw new Error(
    `Invalid or missing environment variables. Check your .env file. \nDetails:\n${formattedErrors}`
  );
}

export const env = parsedEnv.data;
