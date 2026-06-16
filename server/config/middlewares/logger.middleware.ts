import { NextFunction, Request, Response } from "express";

const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  console.log(`[REQ] METHOD: ${req.method}, URL: ${req.url}`);
  console.log("Body:", req.body);

  next();
};

const responseLogger = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;

  res.send = function (data: unknown) {
    console.log(`[RES] METHOD: ${req.method}, URL: ${req.url}`);
    console.log("Response:", data);

    return originalSend.call(this, data);
  };

  next();
};

export { requestLogger, responseLogger };
