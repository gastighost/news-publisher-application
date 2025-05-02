import z from "zod";

const RoleEnum = z.enum(["READER", "WRITER", "ADMIN"]);
const StatusEnum = z.enum(["ACTIVE", "SUSPENDED", "BLOCKED"]);

export const userInputSchema = z.object({
  email: z.string().email(),
  username: z.string().optional(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
  type: RoleEnum,
  userStatus: StatusEnum.optional(),
});

export const loginInputSchema = userInputSchema.pick({
  email: true,
  password: true,
});
