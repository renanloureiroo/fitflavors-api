import { AppError } from '@/core/app-error';

export class UserNotFoundError extends AppError {
  constructor() {
    super('Usuário não encontrado com o ID informado', 400);
  }
}
