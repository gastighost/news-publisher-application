import { z } from "zod";

export const postInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  titleImage: z.string().optional(),
  commentsEnabled: z.boolean().optional(),
});

export const commentInputSchema = z.object({
  comment: z.string().nonempty("Comment is required"),
});
