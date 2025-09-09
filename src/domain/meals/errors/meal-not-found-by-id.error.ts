import { AppError } from '@/core/app-error';

export class MealNotFoundByIdError extends AppError {
  constructor() {
    super('Refeição não encontrada com o ID informado', 400);
  }
}
