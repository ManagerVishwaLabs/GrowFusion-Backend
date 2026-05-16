export interface DBResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: unknown;
}
