import { Router, Request, Response } from "express";
import { Role } from "@prisma/client";

import { env } from "../utils/validateEnv";
import passport from "../auth/passportAuth";
import { requireAuth, requireRole } from "../auth/passportAuth";
import {
  userInputSchema,
  loginInputSchema,
  updateUserStatusSchema,
} from "../validations/userValidations";
import {
  getUsers,
  loginUser,
  registerUser,
  updateUserStatus,
} from "../services/userService";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const userInput = userInputSchema.parse(req.body);

  const newUser = await registerUser(userInput);

  res.status(201).json({ message: "Registered a new user!", newUser });
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = loginInputSchema.parse(req.body);

  await loginUser(email, password);

  res.status(200).json({ message: "Login successful!" });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${env.FRONTEND_URL}/`,
    session: true,
  }),
  (req: Request, res: Response) => {
    res.redirect(`${env.FRONTEND_URL}/`);
  }
);

router.get("/status", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ authenticated: true, user: req.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

router.get(
  "/users",
  requireAuth,
  requireRole([Role.ADMIN]),
  async (req, res) => {
    const users = await getUsers();

    res.status(200).json({ users });
  }
);

router.patch(
  "/users/:userId/status",
  requireAuth,
  requireRole([Role.ADMIN]),
  async (req, res) => {
    const { userId } = req.params;
    const { userStatus } = updateUserStatusSchema.parse(req.body);

    const updatedUser = await updateUserStatus(parseInt(userId), userStatus);

    res.status(200).json({
      message: `User status updated to ${userStatus}.`,
      user: updatedUser,
    });
  }
);

export default router;
