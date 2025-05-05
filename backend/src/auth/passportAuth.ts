import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request, Response, NextFunction } from "express";
import { Role, User as PrismaUser } from "@prisma/client";

import { env } from "../utils/validateEnv";
import prisma from "../prisma/prisma_config";

declare global {
  namespace Express {
    interface User extends PrismaUser {}
  }
}

export const googleVerify = async (
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: Function
) => {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: profile.emails?.[0]?.value,
      },
    });

    if (existingUser) {
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: { lastLoginDate: new Date() },
      });

      return done(null, updatedUser);
    }

    const newUser = await prisma.user.create({
      data: {
        email: profile.emails?.[0]?.value ?? "",
        firstName: profile.name?.givenName ?? "",
        lastName: profile.name?.familyName ?? "",
        password: "",
        type: Role.READER,
        username: profile.displayName ?? `user_${Date.now()}`,
        avatar: profile.photos?.[0]?.value,
      },
    });

    return done(null, newUser);
  } catch (error) {
    console.error("Error in GoogleStrategy:", error);

    if (error instanceof Error) {
      return done(error, undefined);
    }

    return done(new Error("An unknown error occurred"), undefined);
  }
};

export const googleStrategy = new GoogleStrategy(
  {
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: env.GOOGLE_CALLBACK_URL,
  },
  googleVerify
);

passport.use(googleStrategy);

passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
};

export const requireRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    if (!roles.includes(req.user.type)) {
      res.status(403).json({ message: "Insufficient permissions" });
      return;
    }
    next();
  };
};

export default passport;
