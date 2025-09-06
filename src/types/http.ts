export type HttpRequest = {
  body: Record<string, any>;
  queryStringParameters: Record<string, any>;
  pathParameters: Record<string, any>;
};

export type HttpResponse = {
  statusCode: number;
  body?: Record<string, any>;
};
