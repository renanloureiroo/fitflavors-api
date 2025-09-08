import { AppError } from '../app-error';
import { HttpHandler } from '../http/http-handler';

export class HandlerAppError {
  static handle(error: unknown) {
    if (error instanceof AppError) {
      return HttpHandler.response(error.status, {
        status: error.status,
        message: error.message,
        errors: error.errors,
        timestamp: error.timestamp,
      });
    }

    // Log detalhado para erros não tratados (apenas em desenvolvimento)
    if (error instanceof Error) {
      console.error('Unhandled error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    return HttpHandler.internalError();
  }
}
