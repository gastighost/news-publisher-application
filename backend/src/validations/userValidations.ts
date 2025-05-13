import { Role, Status } from "@prisma/client";
import z from "zod";

const RoleEnum = z.nativeEnum(Role);
const StatusEnum = z.nativeEnum(Status);

export const userInputSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
  type: RoleEnum.optional().default(Role.READER),
  userStatus: StatusEnum.optional(),
});

export type UserInput = z.infer<typeof userInputSchema>;

export const loginInputSchema = z.object({
  emailOrUsername: z.string(),
  password: z.string().min(8),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const updateUserStatusSchema = z.object({
  userStatus: z.nativeEnum(Status, {
    errorMap: () => ({
      message: `Status must be one of the following: ${Status}.`,
    }),
  }),
});

export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
