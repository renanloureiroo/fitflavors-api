import { AppError } from '@/core/app-error';

export class OTPRateLimitError extends AppError {
  constructor(retryAfterSeconds = 60) {
    super(
      `Muitas tentativas. Tente novamente em ${retryAfterSeconds} segundos.`,
      429
    );
  }
}
