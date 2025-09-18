import { AppError } from '@/core/app-error';

export class ExpiredOTPError extends AppError {
  constructor() {
    super('Código OTP expirado. Solicite um novo código.', 400);
  }
}
