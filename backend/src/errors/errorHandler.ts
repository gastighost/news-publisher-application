import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Something broke!",
    err,
  });
};

export default errorHandler;
