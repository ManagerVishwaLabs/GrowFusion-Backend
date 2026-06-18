import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

import { UserRole } from "./constants";
import { ErrorCode } from "./errors";

interface AccessTokenPayload extends JwtPayload {
  userId: string;
  username: string;
  role: string;
  company: string;
  jti: string;
}

interface RefreshTokenPayload extends JwtPayload {
  sub: string;
  exp: number;
  jti: string;
}

class AppError extends Error {
  constructor(public code: ErrorCode) {
    super(code);
  }
}

interface ErrorResponse {
  success: false;
  code: ErrorCode;
  error?: string | unknown;
  statusCode?: number;
  message?: string;
}

interface SuccessResponse<T = unknown> {
  success: true;
  data?: T;
  statusCode?: number;
  redirectUrl?: string;
}

type ControllerType<T> = {
  data: T;
  req?: Request;
  res?: Response;
};

type ControllerResponse<T = unknown> = ErrorResponse | SuccessResponse<T>;

type LibraryResponse<T = unknown> = ErrorResponse | SuccessResponse<T>;

type ValidatorResponse = ErrorCode | undefined;

type DocumentId = string | mongoose.Types.ObjectId;

type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export {
  AccessTokenPayload,
  AppError,
  ControllerResponse,
  ControllerType,
  DocumentId,
  LibraryResponse,
  RefreshTokenPayload,
  UserRoleType,
  ValidatorResponse,
};
