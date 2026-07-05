/** รูปแบบ response มาตรฐานจาก Kratom Finance API */

export type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export type ApiErrorBody = {
  status: number;
  message: string;
};

export type PaginatedData<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
