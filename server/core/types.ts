import mongoose from "mongoose";
import { ErrorCode } from "./errors";

class AppError extends Error {
  constructor(public code: ErrorCode) {
    super(code);
  }
}

interface SuccessResponse<T = unknown> {
  code?: ErrorCode;
  data?: T;
}

type ControllerResponse<T = unknown> = ErrorCode | SuccessResponse<T>;

type ValidatorResponse = ErrorCode | undefined;

type DocumentId = string | mongoose.Types.ObjectId;

export { AppError, ControllerResponse, ValidatorResponse, DocumentId };
