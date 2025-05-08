import { Role, Status } from "@prisma/client";

import {
  registerUser,
  loginUser,
  getUsers,
  updateUserStatus,
} from "./userService";
import { CustomError } from "../errors/CustomError";
import prisma from "../prisma/prisma_config";

beforeAll(async () => {
  await prisma.$connect();
  await prisma.postLike.deleteMany();
  await prisma.postComment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("User Service Integration Tests", () => {
  const testUser = {
    email: "test@example.com",
    username: "testuser",
    password: "password123",
    firstName: "Test",
    lastName: "User",
    type: Role.READER,
    bio: "This is a test user.",
    avatar: "https://example.com/avatar.png",
  };

  test("should register a new user", async () => {
    const newUser = await registerUser(testUser);

    expect(newUser).toHaveProperty("id");
    expect(newUser.email).toBe(testUser.email);
    expect(newUser.username).toBe(testUser.username);
  });

  test("should not allow duplicate user registration", async () => {
    await expect(registerUser(testUser)).rejects.toThrow(CustomError);
  });

  test("should fail registration with missing required fields", async () => {
    const invalidUser = { ...testUser, email: undefined };
    await expect(registerUser(invalidUser as any)).rejects.toThrow();
  });

  test("should login a user with valid credentials", async () => {
    const user = await loginUser(testUser.email, testUser.password);

    expect(user).toHaveProperty("id");
    expect(user.email).toBe(testUser.email);
  });

  test("should fail login with invalid credentials", async () => {
    await expect(loginUser(testUser.email, "wrongpassword")).rejects.toThrow(
      CustomError
    );
  });

  test("should fail login with non-existent email", async () => {
    await expect(
      loginUser("nonexistent@example.com", "password123")
    ).rejects.toThrow(CustomError);
  });

  test("should retrieve all users", async () => {
    const users = await getUsers();

    expect(users.length).toBeGreaterThan(0);
    expect(users[0]).toHaveProperty("email");
    expect(users[0]).toHaveProperty("username");
  });

  test("should update user status", async () => {
    const user = await prisma.user.findFirst({
      where: { email: testUser.email },
    });
    const updatedUser = await updateUserStatus(user!.id, Status.SUSPENDED);

    expect(updatedUser.userStatus).toBe(Status.SUSPENDED);
  });

  test("should fail to update status for non-existent user", async () => {
    await expect(updateUserStatus(9999, Status.BLOCKED)).rejects.toThrow();
  });

  test("should handle multiple users correctly", async () => {
    const secondUser = {
      email: "second@example.com",
      username: "seconduser",
      password: "password456",
      firstName: "Second",
      lastName: "User",
      type: Role.WRITER,
    };

    await registerUser(secondUser);

    const users = await getUsers();

    expect(users.length).toBe(2);
    expect(users.find((u) => u.email === secondUser.email)).toBeDefined();
  });

  test("should hash passwords correctly", async () => {
    const user = await prisma.user.findFirst({
      where: { email: testUser.email },
    });

    expect(user!.password).not.toBe(testUser.password);
    const isPasswordValid = await loginUser(testUser.email, testUser.password);
    expect(isPasswordValid).toBeTruthy();
  });
});
