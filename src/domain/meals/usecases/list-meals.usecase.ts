import { ListMealsDTO } from '../dtos/list-meals.dto';
import { Meal, MealStatusEnum } from '../entities/meal';
import { MealsRepository } from '../repositories/meals.repository';

export class ListMealsUsecase {
  constructor(private readonly mealsRepository: MealsRepository) {}

  async execute(data: ListMealsDTO & { userId: string }): Promise<Meal[]> {
    const meals = await this.mealsRepository.findByUserIdAndDateAndStatus(
      data.userId,
      data.date,
      MealStatusEnum.SUCCESS
    );

    return meals;
  }
}
