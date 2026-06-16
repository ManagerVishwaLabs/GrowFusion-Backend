import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import env from "../env";
import userLib from "../../library/user.lib";
import { AccessTokenPayload } from "../../utils/types";

const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization is required",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET,
    ) as AccessTokenPayload;

    const userData = await userLib.getUserByUsername(decoded.username);

    if (!userData.success) {
      return res.status(401).json({
        message: "Invalid session, please login again",
        success: false,
      });
    }

    if (!userData.data) {
      return res.status(401).json({
        message: "Invalid session, please login again",
        success: false,
      });
    }

    req.user = userData.data;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid session, please login again",
      success: false,
    });
  }
};

export { AuthMiddleware };
