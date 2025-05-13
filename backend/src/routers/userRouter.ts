import { Router, Request, Response, NextFunction } from "express";
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
  registerUser,
  updateUserStatus,
} from "../services/userService";
import { CustomError } from "../errors/CustomError";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const userInput = userInputSchema.parse(req.body);
  const newUser = await registerUser(userInput);
  res.status(201).json({ message: "Registered a new user!", newUser });
});

router.post(
  "/login",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      loginInputSchema.parse(req.body);
    } catch (error) {
      return next(new CustomError("Invalid input: " + (error as any).message, 400));
    }

    passport.authenticate(
      "local",
      (err: any, user: Express.User | false, info: any) => {
        if (err) {
          if (err instanceof CustomError) {
            return res.status(err.statusCode).json({ message: err.message });
          }
          return next(err);
        }
        if (!user) {
          return res.status(401).json({ message: info?.message || "Authentication failed - Invalid credentials" });
        }
        req.logIn(user, (loginErr: Error | null) => {
          if (loginErr) {
            return next(new CustomError("Login failed - Unable to establish session", 500));
          }
          return res.status(200).json({
            message: "Login successful",
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              type: user.type,
            },
          });
        });
      }
    )(req, res, next);
  }
);

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
