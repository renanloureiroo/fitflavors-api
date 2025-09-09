import { MealNotFoundByIdError } from '../errors/meal-not-found-by-id.error';
import { MealsRepository } from '../repositories/meals.repository';

interface FetchMealRequest {
  id: string;
  userId: string;
}

export class FetchMealUsecase {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({ id, userId }: FetchMealRequest) {
    const meal = await this.mealsRepository.findByIdAndUserId(id, userId);

    if (!meal) {
      throw new MealNotFoundByIdError();
    }

    return meal;
  }
}
