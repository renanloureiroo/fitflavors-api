import { ListMealsDTO } from '../dtos/list-meals.dto';
import { Meal } from '../entities/meal';
import { MealsRepository } from '../repositories/meals.repository';

export class ListMealsUsecase {
  constructor(private readonly mealsRepository: MealsRepository) {}

  async execute(data: ListMealsDTO & { userId: string }): Promise<Meal[]> {
    const meals = await this.mealsRepository.findByUserIdAndDate(
      data.userId,
      data.date
    );

    return meals;
  }
}
