import mongoose from "mongoose";

import { UserRole } from "./constants";
import { ErrorCode } from "./errors";

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

type ControllerResponse<T = unknown> = ErrorResponse | SuccessResponse<T>;

type LibraryResponse<T = unknown> = ErrorResponse | SuccessResponse<T>;

type ValidatorResponse = ErrorCode | undefined;

type DocumentId = string | mongoose.Types.ObjectId;

type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export {
  AppError,
  ControllerResponse,
  DocumentId,
  LibraryResponse,
  UserRoleType,
  ValidatorResponse,
};
