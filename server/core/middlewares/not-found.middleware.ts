import { Request, Response } from "express";

const notFoundMiddleware = (_req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
    success: false,
  });
};

export default notFoundMiddleware;
