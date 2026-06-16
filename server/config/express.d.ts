import "express";
import { UserType } from "../database/models/user.model";

declare global {
  namespace Express {
    interface Request {
      user: UserType;
    }
  }
}

export {};
