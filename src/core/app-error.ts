export class AppError<T extends Array<unknown> = Array<unknown>> extends Error {
  public status: number;
  public errors: T = [] as unknown as T;
  public timestamp: string;

  constructor(message: string, statusCode: number, errors?: T) {
    super(message);
    this.name = 'AppError';
    this.status = statusCode;
    this.timestamp = new Date().toISOString();
    this.errors = errors ?? ([] as unknown as T);
  }
}
