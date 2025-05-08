import { Role } from "@prisma/client";
import { CustomError } from "../errors/CustomError";
import prisma from "../prisma/prisma_config";

export const getAllPosts = async (offset: number, limit: number) => {
  return await prisma.post.findMany({
    where: { approved: true },
    orderBy: { date: "desc" },
    skip: offset,
    take: limit,
    select: {
      id: true,
      title: true,
      subtitle: true,
      titleImage: true,
      content: true,
      category: true,
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
};

export const getApprovedPostById = async (postId: number) => {
  const post = await prisma.post.findUnique({
    where: { id: postId, approved: true },
    select: {
      id: true,
      title: true,
      subtitle: true,
      titleImage: true,
      content: true,
      category: true,
      date: true,
      updatedDate: true,
      commentsEnabled: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      comments: {
        select: {
          id: true,
          comment: true,
          date: true,
          updatedDate: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              avatar: true,
            },
          },
        },
      },
      likes: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!post) {
    throw new CustomError("Post not found", 404);
  }

  return {
    ...post,
    likeCount: post.likes.length,
  };
};

export const addCommentToPost = async (
  postId: number,
  userId: number,
  comment: string
) => {
  return await prisma.postComment.create({
    data: {
      postId,
      userId,
      comment,
    },
  });
};

export const updateComment = async (
  userId: number,
  commentId: number,
  comment: string
) => {
  const existingComment = await prisma.postComment.findUnique({
    where: { id: commentId },
  });

  if (!existingComment) {
    throw new CustomError("Comment not found", 404);
  }

  if (existingComment.userId !== userId) {
    throw new CustomError("Unauthorized to update this comment", 403);
  }

  const updatedComment = await prisma.postComment.update({
    where: { id: commentId },
    data: { comment },
  });

  return updatedComment;
};

export const deleteComment = async (
  commentId: number,
  userId: number,
  userRole?: Role
) => {
  const existingComment = await prisma.postComment.findUnique({
    where: { id: commentId },
  });

  if (!existingComment) {
    throw new CustomError("Comment not found", 404);
  }

  if (existingComment.userId !== userId && userRole !== Role.ADMIN) {
    throw new CustomError("Unauthorized to delete this comment", 403);
  }

  await prisma.postComment.delete({
    where: { id: commentId },
  });
};

export const createPost = async (
  userId: number,
  postInput: {
    title: string;
    subtitle?: string;
    content: string;
    titleImage?: string;
    commentsEnabled?: boolean;
  }
) => {
  return await prisma.post.create({
    data: {
      title: postInput.title,
      subtitle: postInput.subtitle ?? null,
      content: postInput.content,
      titleImage: postInput.titleImage ?? null,
      commentsEnabled: postInput.commentsEnabled ?? true,
      authorId: userId,
    },
  });
};

export const updatePostStatus = async (postId: number, approved: boolean) => {
  return await prisma.post.update({
    where: { id: postId },
    data: { approved },
  });
};

export const deletePost = async (postId: number) => {
  return await prisma.post.delete({
    where: { id: postId },
  });
};
