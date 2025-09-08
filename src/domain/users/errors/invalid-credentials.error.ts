import { AppError } from '@/core/app-error';

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('Credenciais inválidas', 401);
  }
}
