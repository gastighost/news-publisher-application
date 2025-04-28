import express, { Application } from "express";
import cors from "cors";
import errorHandler from "./errors/errorHandler";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use(errorHandler);

export default app;
