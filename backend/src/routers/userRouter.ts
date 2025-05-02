import { Router } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

import {
  userInputSchema,
  loginInputSchema,
} from "../validations/userValidations";

const prisma = new PrismaClient();

const router = Router();

router.post("/register", async (req, res) => {
  const userInput = userInputSchema.parse(req.body);

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: userInput.email }, { username: userInput.username }],
    },
  });

  if (existingUser) {
    res.status(400).json({ message: "Email or username already in use." });
    return;
  }

  const hashedPassword = await bcrypt.hash(userInput.password, 12);

  const newUser = await prisma.user.create({
    data: { ...userInput, password: hashedPassword },
  });

  res.status(201).json({ message: "Registered a new user!", newUser });
});

router.post("/login", async (req, res) => {
  const { email, password } = loginInputSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  res.status(200).json({ message: "Login successful!" });
});

export default router;
