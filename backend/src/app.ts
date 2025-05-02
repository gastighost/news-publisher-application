import express, { Application } from "express";
import cors from "cors";
import session from "express-session";
import passport from "./auth/passportAuth";

import errorHandler from "./errors/errorHandler";
import userRouter from "./routers/userRouter";
import testRouter from "./routers/testRouter";

const app: Application = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, 
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", userRouter);
app.use(testRouter);

app.use(errorHandler);

export default app;