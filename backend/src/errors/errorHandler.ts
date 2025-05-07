import { ErrorRequestHandler } from "express";
import { Request, Response } from "express";

import { CustomError } from "./CustomError";

const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next
) => {
  console.error(err.stack);

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  } else {
    res.status(500).json({
      message:
        "An unexpected error occurred. Please try again later or contact support if the issue persists.",
      err,
    });
  }
};

export default errorHandler;
