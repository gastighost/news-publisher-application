import express, { Application } from "express";
import cors from "cors";
import session from "express-session";

import passport from "./auth/passportAuth";
import { env } from "./utils/validateEnv";

import errorHandler from "./errors/errorHandler";
import userRouter from "./routers/userRouter";
import postRouter from "./routers/postRouter";


const app: Application = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", userRouter);
app.use("/api/posts", postRouter);

app.use(errorHandler);

export default app;
