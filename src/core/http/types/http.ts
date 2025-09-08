type DefaultType = Record<string, unknown>;

export type HttpRequest<
  T extends DefaultType = DefaultType,
  P extends DefaultType = DefaultType,
  Q extends DefaultType = DefaultType,
> = {
  body: T;
  params: P;
  queryParams: Q;
  headers?: Record<string, string>;
  context: {
    userId: string;
    email: string;
  };
};

export type HttpResponse<T extends DefaultType = DefaultType> = {
  statusCode: number;
  body?: T;
};
