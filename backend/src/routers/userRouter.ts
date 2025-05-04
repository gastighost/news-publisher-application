import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";

import prisma from "../prisma/prisma_config";
import passport from "../auth/passportAuth";
import {
  userInputSchema,
  loginInputSchema,
} from "../validations/userValidations";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
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

router.post("/login", async (req: Request, res: Response) => {
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

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=true`,
    session: true,
  }),
  (req: Request, res: Response) => {
    res.redirect(process.env.FRONTEND_URL || "/");
  }
);

router.get("/status", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ authenticated: true, user: req.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

export default router;
