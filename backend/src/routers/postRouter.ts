import { Router } from "express";
import { Role } from "@prisma/client";
import { Request, Response } from "express";

import prisma from "../prisma/prisma_config";
import { requireAuth, requireRole } from "../auth/passportAuth";
import { postInputSchema } from "../validations/postValidations";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany({
    where: { approved: true },
    orderBy: { date: "desc" },
    select: {
      id: true,
      title: true,
      subtitle: true,
      titleImage: true,
      content: true,
      date: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  res.status(200).json({
    message: "Posts fetched successfully",
    posts,
  });
});

router.post("/:postId/comments", requireAuth, async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  const { comment } = req.body;

  if (!comment || comment.trim() === "") {
    res.status(400).json({ message: "Comment cannot be empty" });
    return;
  }

  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  const newComment = await prisma.postComment.create({
    data: {
      postId,
      userId,
      comment,
    },
  });

  res
    .status(201)
    .json({ message: "Comment added successfully", comment: newComment });
});

router.patch("/comments/:commentId", requireAuth, async (req: Request, res: Response) => {
  const commentId = parseInt(req.params.commentId);
  const { comment } = req.body;

  if (!comment || comment.trim() === "") {
    res.status(400).json({ message: "Comment cannot be empty" });
    return;
  }

  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  const existingComment = await prisma.postComment.findUnique({
    where: { id: commentId },
  });

  if (!existingComment) {
    res.status(404).json({ message: "Comment not found" });
    return;
  }

  if (existingComment.userId !== userId) {
    res
      .status(403)
      .json({ message: "You are not authorized to update this comment" });
    return;
  }

  const updatedComment = await prisma.postComment.update({
    where: { id: commentId },
    data: { comment },
  });

  res
    .status(200)
    .json({ message: "Comment updated successfully", comment: updatedComment });
});

router.delete("/comments/:commentId", requireAuth, async (req: Request, res: Response) => {
  const commentId = parseInt(req.params.commentId);

  const userId = req.user?.id;
  const userRole = req.user?.type;

  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  const existingComment = await prisma.postComment.findUnique({
    where: { id: commentId },
  });

  if (!existingComment) {
    res.status(404).json({ message: "Comment for deletion not found" });
    return;
  }

  if (existingComment.userId !== userId && userRole !== Role.ADMIN) {
    res
      .status(403)
      .json({ message: "You are not authorized to delete this comment" });
    return;
  }

  await prisma.postComment.delete({
    where: { id: commentId },
  });

  res.status(200).json({ message: "Comment deleted successfully" });
});

router.post(
  "/",
  requireAuth,
  requireRole([Role.ADMIN, Role.WRITER]),
  async (req: Request, res: Response) => {
    const postInput = postInputSchema.parse(req.body);

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const newPost = await prisma.post.create({
      data: {
        title: postInput.title,
        subtitle: postInput.subtitle || null,
        content: postInput.content,
        titleImage: postInput.titleImage || null,
        commentsEnabled: postInput.commentsEnabled ?? true,
        authorId: userId,
      },
    });

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  }
);

router.patch(
  "/:postId/approve",
  requireAuth,
  requireRole([Role.ADMIN]),
  async (req: Request, res: Response) => {
    const postId = parseInt(req.params.postId);

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { approved: true },
    });

    res
      .status(200)
      .json({ message: "Post approved successfully", post: updatedPost });
  }
);

router.patch(
  "/:postId/reject",
  requireAuth,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response) => {
    const postId = parseInt(req.params.postId);

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { approved: false },
    });

    res
      .status(200)
      .json({ message: "Post rejected successfully", post: updatedPost });
  }
);

router.delete(
  "/:postId",
  requireAuth,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response) => {
    const postId = parseInt(req.params.postId);

    await prisma.post.delete({
      where: { id: postId },
    });

    res.status(200).json({ message: "Post deleted successfully" });
  }
);

export default router;
