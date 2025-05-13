import { Router } from "express";
import { Role } from "@prisma/client";
import { Request, Response } from "express";

import { requireAuth, requireRole } from "../auth/passportAuth";
import {
  commentInputSchema,
  postInputSchema,
  postUpdateStatusSchema,
} from "../validations/postValidations";
import {
  addCommentToPost,
  createPost,
  deleteComment,
  deletePost,
  getAllPosts,
  getApprovedPostById,
  updateComment,
  updatePostStatus,
} from "../services/postService";
import { CustomError } from "../errors/CustomError";
import upload from "../middleware/multer";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const offset = parseInt(req.query.offset as string) || 0;
  const limit = parseInt(req.query.limit as string) || 5;

  try {
    const posts = await getAllPosts(offset, limit);

    res.status(200).json({
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

router.get("/:postId", async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);

  if (isNaN(postId)) {
    throw new CustomError("Invalid post ID", 400);
  }

  const postWithLikeCount = await getApprovedPostById(postId);

  res
    .status(200)
    .json({ message: "Post successfully retrieved.", post: postWithLikeCount });
});

router.post(
  "/:postId/comments",
  requireAuth,
  async (req: Request, res: Response) => {
    const postId = parseInt(req.params.postId);
    const { comment } = commentInputSchema.parse(req.body);

    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError("User not authenticated", 401);
    }

    const newComment = await addCommentToPost(postId, userId, comment);

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  }
);

router.patch(
  "/comments/:commentId",
  requireAuth,
  async (req: Request, res: Response) => {
    const commentId = parseInt(req.params.commentId);
    const { comment } = commentInputSchema.parse(req.body);

    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError("User not authenticated", 401);
    }

    const updatedComment = await updateComment(userId, commentId, comment);

    res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  }
);

router.delete(
  "/comments/:commentId",
  requireAuth,
  async (req: Request, res: Response) => {
    const commentId = parseInt(req.params.commentId);

    const userId = req.user?.id;
    const userRole = req.user?.type;

    if (!userId) {
      throw new CustomError("User not authenticated", 401);
    }

    await deleteComment(commentId, userId, userRole);

    res.status(200).json({ message: "Comment deleted successfully" });
  }
);

router.post(
  "/",
  requireAuth,
  requireRole([Role.ADMIN, Role.WRITER]),
  upload.single("titleImage"),
  async (req: Request, res: Response) => {
    const postInput = postInputSchema.parse(req.body);

    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError("User not authenticated", 401);
    }

    const newPost = await createPost(userId, {
      ...postInput,
      titleImage: req.file,
    });

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  }
);

router.patch(
  "/:postId/status",
  requireAuth,
  requireRole([Role.ADMIN]),
  async (req: Request, res: Response) => {
    const postId = parseInt(req.params.postId);
    const { approved } = postUpdateStatusSchema.parse(req.body);

    const updatedPost = await updatePostStatus(postId, approved);

    res.status(200).json({
      message: `Post ${approved ? "approved" : "rejected"} successfully`,
      post: updatedPost,
    });
  }
);

router.delete(
  "/:postId",
  requireAuth,
  requireRole([Role.ADMIN]),
  async (req: Request, res: Response) => {
    const postId = parseInt(req.params.postId);

    await deletePost(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  }
);

export default router;
