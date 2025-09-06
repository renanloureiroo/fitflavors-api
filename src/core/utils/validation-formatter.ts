import { ZodError } from 'zod';
import { ErrorResponse, ValidationError } from '@/core/validation';

export class ValidationFormatter {
  static formatZodError(
    error: ZodError,
    customMessage?: string
  ): ErrorResponse<ValidationError[]> {
    const errors: ValidationError[] = error.issues.map(issue => ({
      field: issue.path.length === 0 ? 'root' : issue.path.join('.'),
      message: issue.message || 'Campo inválido',
    }));

    return {
      timestamp: new Date().toISOString(),
      status: 400,
      errors,
      message: customMessage || 'Dados inválidos fornecidos',
    };
  }
}
