import { Role } from "@prisma/client";
import { Readable, PassThrough } from "stream";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

import {
  getAllPosts,
  getApprovedPostById,
  addCommentToPost,
  updateComment,
  deleteComment,
  createPost,
  updatePostStatus,
  deletePost,
} from "../postService";
import { CustomError } from "../../errors/CustomError";
import cloudinary from "../../config/cloudinaryConfig";
import prisma from "../../prisma/prisma_config";

jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn((options, callback) => {
        callback(null, {
          public_id: "mocked_public_id",
          secure_url: "https://mocked.cloudinary.url/image.png",
        });
      }),
    },
  },
}));

beforeAll(async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});

  await prisma.$connect();

  await prisma.postLike.deleteMany();
  await prisma.postComment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      email: "testuser@example.com",
      username: "testuser",
      password: "hashedpassword",
      firstName: "Test",
      lastName: "User",
      type: Role.READER,
    },
  });
});

afterAll(async () => {
  await prisma.$disconnect();

  await prisma.$disconnect();
});

describe("Post Service Integration Tests", () => {
  let testUserId: number;
  let testPostId: number;

  beforeEach(async () => {
    // Fetch the test user ID
    const user = await prisma.user.findFirst({
      where: { email: "testuser@example.com" },
    });
    testUserId = user!.id;

    const mockFile: Express.Multer.File = {
      fieldname: "titleImage",
      originalname: "image.png",
      encoding: "7bit",
      mimetype: "image/png",
      size: 1234,
      buffer: Buffer.from("mock image content"),
      stream: new Readable(),
      destination: "",
      filename: "",
      path: "",
    };

    const post = await createPost(testUserId, {
      title: "Test Post",
      subtitle: "Test Subtitle",
      content: "This is a test post.",
      titleImage: mockFile,
      commentsEnabled: true,
    });
    await updatePostStatus(post.id, true);
    testPostId = post.id;
  });

  afterEach(async () => {
    // Clear all dependent records after each test
    await prisma.postLike.deleteMany();
    await prisma.postComment.deleteMany();
    await prisma.post.deleteMany();
  });

  test("should fetch all approved posts", async () => {
    const posts = await getAllPosts(0, 10);

    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).toHaveProperty("id");
    expect(posts[0]).toHaveProperty("title");
  });

  test("should fetch a single approved post by ID", async () => {
    const post = await getApprovedPostById(testPostId);

    expect(post).toHaveProperty("id", testPostId);
    expect(post).toHaveProperty("title", "Test Post");
    expect(post).toHaveProperty("likeCount", 0);
  });

  test("should throw error for invalid post ID (null)", async () => {
    await expect(getApprovedPostById(null as any)).rejects.toThrow(
      PrismaClientValidationError
    );
  });

  test("should throw error for invalid post ID (NaN)", async () => {
    await expect(getApprovedPostById(NaN)).rejects.toThrow(
      PrismaClientValidationError
    );
  });

  test("should throw error for non-existent post ID", async () => {
    await expect(getApprovedPostById(9999)).rejects.toThrow(CustomError);
  });

  test("should add a comment to a post", async () => {
    const comment = await addCommentToPost(
      testPostId,
      testUserId,
      "This is a test comment."
    );

    expect(comment).toHaveProperty("id");
    expect(comment).toHaveProperty("comment", "This is a test comment.");
  });

  test("should throw error for invalid comment ID (null)", async () => {
    await expect(deleteComment(null as any, testUserId)).rejects.toThrow(
      PrismaClientValidationError
    );
  });

  test("should throw error for invalid comment ID (NaN)", async () => {
    await expect(deleteComment(NaN, testUserId)).rejects.toThrow(
      PrismaClientValidationError
    );
  });

  test("should update a comment", async () => {
    const comment = await addCommentToPost(
      testPostId,
      testUserId,
      "Another comment."
    );
    const updatedComment = await updateComment(
      testUserId,
      comment.id,
      "Updated comment."
    );

    expect(updatedComment).toHaveProperty("id", comment.id);
    expect(updatedComment).toHaveProperty("comment", "Updated comment.");
  });

  test("should throw error when updating a non-existent comment", async () => {
    await expect(
      updateComment(testUserId, 9999, "Invalid update")
    ).rejects.toThrow(CustomError);
  });

  test("should throw error for unauthorized comment update", async () => {
    const secondUser = await prisma.user.create({
      data: {
        email: "seconduser@example.com",
        username: "seconduser",
        password: "hashedpassword",
        firstName: "Second",
        lastName: "User",
        type: Role.READER,
      },
    });

    const comment = await addCommentToPost(
      testPostId,
      secondUser.id,
      "Comment by another user"
    );

    await expect(
      updateComment(testUserId, comment.id, "Updated comment")
    ).rejects.toThrow("Unauthorized to update this comment");
  });

  test("should delete a comment", async () => {
    const comment = await addCommentToPost(
      testPostId,
      testUserId,
      "Comment to delete."
    );
    await deleteComment(comment.id, testUserId);

    const deletedComment = await prisma.postComment.findUnique({
      where: { id: comment.id },
    });
    expect(deletedComment).toBeNull();
  });

  test("should throw error when deleting a non-existent comment", async () => {
    await expect(deleteComment(9999, testUserId)).rejects.toThrow(CustomError);
  });

  test("should create a new post", async () => {
    const newPost = await createPost(testUserId, {
      title: "New Test Post",
      content: "This is another test post.",
    });

    expect(newPost).toHaveProperty("id");
    expect(newPost).toHaveProperty("title", "New Test Post");
  });

  test("should update post approval status", async () => {
    const post = await createPost(testUserId, {
      title: "Post to Approve",
      content: "This post needs approval.",
    });

    const updatedPost = await updatePostStatus(post.id, true);

    expect(updatedPost).toHaveProperty("approved", true);
  });

  test("should delete a post", async () => {
    const post = await createPost(testUserId, {
      title: "Post to Delete",
      content: "This post will be deleted.",
    });

    await deletePost(post.id);

    const deletedPost = await prisma.post.findUnique({
      where: { id: post.id },
    });
    expect(deletedPost).toBeNull();
  });

  test("should throw error when deleting a non-existent post", async () => {
    await expect(deletePost(9999)).rejects.toThrow(
      PrismaClientKnownRequestError
    );
  });
});

it("should throw an error if Cloudinary upload fails", async () => {
  jest
    .spyOn(cloudinary.uploader, "upload_stream")
    .mockImplementationOnce(function (
      optionsOrCallback?: unknown,
      callbackMaybe?: unknown
    ) {
      const callback =
        typeof optionsOrCallback === "function"
          ? optionsOrCallback
          : callbackMaybe;
      const stream = new PassThrough();

      const originalEnd = stream.end;
      stream.end = function (
        chunk?: any,
        encodingOrCallback?: BufferEncoding | (() => void),
        cb?: () => void
      ) {
        if (typeof callback === "function") {
          callback(new Error("Cloudinary error"));
        }

        return originalEnd.call(this, chunk, encodingOrCallback as any, cb);
      };
      return stream;
    });

  const mockFile = {
    buffer: Buffer.from("fail"),
    originalname: "fail.png",
    fieldname: "titleImage",
    encoding: "7bit",
    mimetype: "image/png",
    size: 1234,
    stream: new PassThrough(),
    destination: "",
    filename: "",
    path: "",
  };

  await expect(
    createPost(1, {
      title: "Fail Post",
      content: "Should fail",
      titleImage: mockFile,
    })
  ).rejects.toThrow("Failed to upload image");
});
