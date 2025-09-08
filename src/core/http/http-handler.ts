import { HttpResponse } from '@/core/http/types/http';
import { ErrorResponse, ValidationError } from '@/core/validation';

type DefaultType = Record<string, unknown>;

export class HttpHandler {
  static response<T extends DefaultType = DefaultType>(
    statusCode: number,
    body: T = {} as T
  ): HttpResponse<T> {
    return { statusCode, body };
  }

  static ok<T extends DefaultType = DefaultType>(
    body: T = {} as T
  ): HttpResponse<T> {
    return {
      statusCode: 200,
      body,
    };
  }

  static created<T extends DefaultType = DefaultType>(
    body: T = {} as T
  ): HttpResponse<T> {
    return {
      statusCode: 201,
      body,
    };
  }

  static badRequest<T extends DefaultType = DefaultType>(
    body: T = {} as T
  ): HttpResponse<T> {
    return {
      statusCode: 400,
      body,
    };
  }

  static validationError(
    errorResponse: ErrorResponse<ValidationError[]>
  ): HttpResponse {
    return {
      statusCode: errorResponse.status,
      body: errorResponse,
    };
  }

  static unauthorized(message: string = 'Não autorizado'): HttpResponse {
    return {
      statusCode: 401,
      body: { message },
    };
  }

  static forbidden(message: string = 'Acesso negado'): HttpResponse {
    return {
      statusCode: 403,
      body: { message },
    };
  }

  static notFound(message: string = 'Recurso não encontrado'): HttpResponse {
    return {
      statusCode: 404,
      body: { message },
    };
  }

  static internalError(
    message: string = 'Erro interno do servidor'
  ): HttpResponse {
    return {
      statusCode: 500,
      body: { message },
    };
  }
}
