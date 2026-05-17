import {
  HydratedDocument,
  ProjectionType,
  QueryOptions,
  SortOrder,
} from "mongoose";

interface DBResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: unknown;
}

type Doc<T> = HydratedDocument<T>;

interface UpdateOptions extends QueryOptions {
  upsert?: boolean;
}

interface FindOptions<TSchema> extends QueryOptions {
  sort?: Record<string, SortOrder>;

  limit?: number;

  skip?: number;

  select?: ProjectionType<TSchema>;
}

export { DBResponse, Doc, UpdateOptions, FindOptions };
