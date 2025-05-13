import { z } from "zod";

export const postInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  commentsEnabled: z
    .union([z.boolean(), z.string()])
    .transform((value) =>
      typeof value === "string" ? value === "true" : value
    )
    .optional(),
});

export const commentInputSchema = z.object({
  comment: z.string().nonempty("Comment is required"),
});

export const postUpdateStatusSchema = z.object({
  approved: z.boolean(),
});
