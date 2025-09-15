import { MealsRepository } from '../repositories/meals.repository';
import { MealNotFoundByIdError } from '../errors/meal-not-found-by-id.error';

type DeleteMealUseCaseParams = {
  mealId: string;
  userId: string;
};

export class DeleteMealUseCase {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({ mealId, userId }: DeleteMealUseCaseParams): Promise<void> {
    const meal = await this.mealsRepository.findByIdAndUserId(mealId, userId);

    if (!meal) {
      throw new MealNotFoundByIdError();
    }

    await this.mealsRepository.delete(mealId);
  }
}
