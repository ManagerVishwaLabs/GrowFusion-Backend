import { NextFunction, Request, Response } from "express";

export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  console.log(`[REQ] METHOD: ${req.method}, URL: ${req.url}`);
  console.log("Body:", req.body);
  req.body = req?.body || {};

  next();
};

export const responseLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const originalSend = res.send;

  res.send = function (data: unknown) {
    console.log(`[RES] METHOD: ${req.method}, URL: ${req.url}`);
    console.log("Response:", data);

    return originalSend.call(this, data);
  };

  next();
};

export const notFoundMiddleware = (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};
