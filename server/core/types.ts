import mongoose from "mongoose";
import { ErrorCode } from "./errors";

export class AppError extends Error {
  constructor(public code: ErrorCode) {
    super(code);
  }
}

export interface SuccessResponse<T = unknown> {
  code?: ErrorCode;
  data?: T;
}

export type ControllerResponse<T = unknown> = ErrorCode | SuccessResponse<T>;

export type ValidatorResponse = ErrorCode | undefined;

export type DocumentId = string | mongoose.Types.ObjectId;