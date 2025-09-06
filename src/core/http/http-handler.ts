import { HttpResponse } from '@/core/http/types/http';
import { ErrorResponse, ValidationError } from '@/core/validation';

export class HttpHandler {
  static ok(body: Record<string, unknown> = {}): HttpResponse {
    return {
      statusCode: 200,
      body,
    };
  }

  static created(body: Record<string, unknown> = {}): HttpResponse {
    return {
      statusCode: 201,
      body,
    };
  }

  static badRequest(body: Record<string, unknown> = {}): HttpResponse {
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
