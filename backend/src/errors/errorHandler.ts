import { ErrorRequestHandler } from "express";
import { Request, Response } from "express";

const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Something broke!",
    err,
  });
};

export default errorHandler;
