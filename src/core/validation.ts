export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationOptions {
  message?: string;
}

export type ErrorResponse<T extends Array<unknown> = Array<unknown>> = {
  timestamp: string;
  status: number;
  errors: T;
  message: string;
};
