import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../prisma/prisma_config";
import { Role } from "@prisma/client";

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


passport.serializeUser((user: any, done) => {
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


export const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Authentication required" });
};

export const requireRole = (roles: Role[]) => {
    return (req: any, res: any, next: any) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Authentication required" });
        }
        if (!roles.includes(req.user.type)) {
            return res.status(403).json({ message: "Insufficient permissions" });
        }
        next();
    };
};

export default passport;
