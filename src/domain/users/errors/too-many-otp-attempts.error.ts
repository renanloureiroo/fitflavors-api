import { AppError } from '@/core/app-error';

export class TooManyOTPAttemptsError extends AppError {
  constructor() {
    super('Máximo de tentativas excedido. Solicite um novo código.', 429);
  }
}
