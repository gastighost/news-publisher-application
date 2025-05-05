import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

/**
 * Schema for validating environment variables.
 *
 * ### Adding a New Environment Variable
 * 1. Add the variable to your `.env` file:
 *    ```
 *    NEW_VARIABLE=some_value
 *    ```
 * 2. Extend the `envSchema` below every time a new environment variable is added:
 *    ```typescript
 *    NEW_VARIABLE: z.string().nonempty("NEW_VARIABLE is required"),
 *    ```
 *    Use `.url()`, `.number()`, or `.optional()` as needed.
 * 3. Access it via the `env` object:
 *    ```typescript
 *    console.log(env.NEW_VARIABLE);
 *    ```
 */
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
});

/**
 * Parses and validates the environment variables using the defined schema.
 *
 * If validation fails, the application will log the errors and throw an exception,
 * preventing the server from starting with invalid or missing environment variables.
 */
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

/**
 * The validated environment variables.
 *
 * This object contains all the environment variables that passed validation,
 * ensuring they are safe to use throughout the application.
 *
 * Example usage:
 * ```typescript
 * import { env } from "./utils/validateEnv";
 *
 * console.log(env.PORT); // Access the validated PORT variable
 * console.log(env.DATABASE_URL); // Access the validated DATABASE_URL variable
 * ```
 */
export const env = parsedEnv.data;
