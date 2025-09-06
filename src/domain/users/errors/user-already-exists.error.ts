import { AppError } from '@/core/app-error';

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super('Já existe um usuário com este email', 409);
  }
}
