import mongoose from "mongoose";
import { ErrorCode } from "./errors";
import { UserRole } from "../utils/commonConstants";

class AppError extends Error {
  constructor(public code: ErrorCode) {
    super(code);
  }
}

interface ErrorResponse {
  success: false;
  code: ErrorCode;
}

interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
}

type ControllerResponse<T = unknown> = ErrorResponse | SuccessResponse<T>;

type LibraryResponse<T = unknown> = ErrorResponse | SuccessResponse<T>;

type ValidatorResponse = ErrorCode | undefined;

type DocumentId = string | mongoose.Types.ObjectId;

type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export {
  AppError,
  ControllerResponse,
  LibraryResponse,
  ValidatorResponse,
  DocumentId,
  UserRoleType,
};
