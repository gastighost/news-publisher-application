import { Role, Status } from "@prisma/client";
import z from "zod";

const RoleEnum = z.nativeEnum(Role);
const StatusEnum = z.nativeEnum(Status);

export const userInputSchema = z.object({
  email: z.string().email(),
  username: z.string().optional(),
  password: z.string().min(8),
  firstName: z.string(),
  lastName: z.string(),
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
  type: RoleEnum,
  userStatus: StatusEnum.optional(),
});

export type UserInput = z.infer<typeof userInputSchema>;

export const loginInputSchema = userInputSchema.pick({
  email: true,
  password: true,
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
