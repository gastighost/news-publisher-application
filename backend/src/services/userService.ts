import bcrypt from "bcrypt";
import { Status } from "@prisma/client";

import prisma from "../prisma/prisma_config";
import { UserInput } from "../validations/userValidations";
import { CustomError } from "../errors/CustomError";

export const registerUser = async (userInput: UserInput) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: userInput.email }, { username: userInput.username }],
    },
  });

  if (existingUser) {
    throw new CustomError("User already exists.", 409);
  }

  const hashedPassword = await bcrypt.hash(userInput.password, 12);

  const newUser = await prisma.user.create({
    data: { ...userInput, password: hashedPassword },
  });

  return newUser;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new CustomError("Invalid credentials.", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new CustomError("Invalid credentials.", 401);
  }

  return user;
};

export const getUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      bio: true,
      avatar: true,
      type: true,
      registrationDate: true,
      lastLoginDate: true,
      userStatus: true,
    },
  });
};

export const updateUserStatus = async (userId: number, userStatus: Status) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { userStatus },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      userStatus: true,
    },
  });

  return updatedUser;
};
