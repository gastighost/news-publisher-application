import { Router } from "express";

import prisma from "../prisma/prisma_config";
import { requireAuth, requireRole } from "../auth/passportAuth";
import { postInputSchema } from "../validations/postValidations";
import { Role } from "@prisma/client";

const router = Router();

/**
 * @route GET /
 * @description Fetch all approved posts for readership
 * @access Public
 * @returns {Object} - A list of approved posts
 */
router.get("/", async (req, res) => {
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

/**
 * @route POST /:postId/comments
 * @description Add a comment to a specific post
 * @access Authenticated users
 * @param {number} postId - The ID of the post to comment on
 * @body {string} comment - The content of the comment
 * @returns {Object} - The newly created comment
 */
router.post("/:postId/comments", requireAuth, async (req, res) => {
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

/**
 * @route PATCH /comments/:commentId
 * @description Update a specific comment
 * @access Authenticated users (comment owner only)
 * @param {number} commentId - The ID of the comment to update
 * @body {string} comment - The updated content of the comment
 * @returns {Object} - The updated comment
 */
router.patch("/comments/:commentId", requireAuth, async (req, res) => {
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

/**
 * @route DELETE /comments/:commentId
 * @description Delete a specific comment
 * @access Authenticated users (comment owner or admin)
 * @param {number} commentId - The ID of the comment to delete
 * @returns {Object} - A success message
 */
router.delete("/comments/:commentId", requireAuth, async (req, res) => {
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

/**
 * @route POST /
 * @description Create a new post
 * @access Authenticated users (Admin or Writer roles)
 * @body {Object} postInput - The post details (title, content, etc.)
 * @returns {Object} - The newly created post
 */
router.post(
  "/",
  requireAuth,
  requireRole([Role.ADMIN, Role.WRITER]),
  async (req, res) => {
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

/**
 * @route PATCH /:postId/approve
 * @description Approve a specific post
 * @access Admin only
 * @param {number} postId - The ID of the post to approve
 * @returns {Object} - The updated post
 */
router.patch(
  "/:postId/approve",
  requireAuth,
  requireRole([Role.ADMIN]),
  async (req, res) => {
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

/**
 * @route PATCH /:postId/reject
 * @description Reject a specific post
 * @access Admin only
 * @param {number} postId - The ID of the post to reject
 * @returns {Object} - The updated post
 */
router.patch(
  "/:postId/reject",
  requireAuth,
  requireRole(["ADMIN"]),
  async (req, res) => {
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

/**
 * @route DELETE /:postId
 * @description Delete a specific post
 * @access Admin only
 * @param {number} postId - The ID of the post to delete
 * @returns {Object} - A success message
 */
router.delete(
  "/:postId",
  requireAuth,
  requireRole(["ADMIN"]),
  async (req, res) => {
    const postId = parseInt(req.params.postId);

    await prisma.post.delete({
      where: { id: postId },
    });

    res.status(200).json({ message: "Post deleted successfully" });
  }
);

export default router;
