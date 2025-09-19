import { AppError } from '@/core/app-error';

export class InvalidOTPError extends AppError {
  constructor() {
    super('Código OTP inválido', 400);
  }
}
