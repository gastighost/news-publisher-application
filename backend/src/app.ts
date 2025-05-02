import express, { Application } from "express";
import cors from "cors";

import errorHandler from "./errors/errorHandler";
import userRouter from "./routers/userRouter";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", userRouter);

app.use(errorHandler);

export default app;
