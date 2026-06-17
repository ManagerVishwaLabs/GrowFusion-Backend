import { NextFunction, Request, Response } from "express";

const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("[ERROR]", error);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorMiddleware;
