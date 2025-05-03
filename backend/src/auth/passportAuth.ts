import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request, Response, NextFunction } from "express";
import { Role, User as PrismaUser } from "@prisma/client";

import prisma from "../prisma/prisma_config";

declare global {
  namespace Express {
    interface User extends PrismaUser {}
  }
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
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
            email: profile.emails?.[0]?.value || "",
            firstName: profile.name?.givenName || "",
            lastName: profile.name?.familyName || "",
            password: "",
            type: "READER" as Role,
            username: profile.displayName || `user_${Date.now()}`,
            avatar: profile.photos?.[0]?.value,
          },
        });
        return done(null, newUser);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

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
