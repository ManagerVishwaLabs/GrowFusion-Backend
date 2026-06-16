import {
  HydratedDocument,
  ProjectionType,
  QueryOptions,
  SortOrder,
} from "mongoose";

import { ErrorCode } from "../utils/errors";

type ErrorResponse = {
  success: false;
  code: ErrorCode;
  message?: string;
  error?: unknown;
};

type SuccessResponse<T = unknown> = {
  success: true;
  data: T;
};

type DBResponse<T = unknown> = ErrorResponse | SuccessResponse<T>;

type Doc<T extends object> = HydratedDocument<T>;

interface UpdateOptions extends QueryOptions {
  upsert?: boolean;
}

interface FindOptions<TSchema> extends QueryOptions {
  sort?: Record<string, SortOrder>;

  limit?: number;

  skip?: number;

  select?: ProjectionType<TSchema>;
}

export { DBResponse, Doc, FindOptions, UpdateOptions };
