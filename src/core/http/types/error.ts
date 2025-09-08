// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefaultType = Array<Record<string, any>>;

export type ErrorResponse<T extends DefaultType = DefaultType> = {
  timestamp: string;
  status: number;
  errors: T;
  message: string;
};
