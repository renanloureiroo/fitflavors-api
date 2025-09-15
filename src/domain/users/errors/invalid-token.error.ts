import { AppError } from '@/core/app-error';

export class InvalidTokenError extends AppError {
  constructor() {
    super('Token inválido ou expirado', 401);
  }
}
