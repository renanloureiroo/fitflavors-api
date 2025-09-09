import { AppError } from '@/core/app-error';
import { DrizzleMealsRepository } from '@/infra/db/drizzle/repositories/drizzle-meals.repository';
import { MealStatusEnum } from '../entities/meal';

export class ProcessMealController {
  static async handle(fileKey: string): Promise<void> {
    const mealRepository = new DrizzleMealsRepository();
    const meal = await mealRepository.findByInputFileKey(fileKey);

    if (!meal) {
      throw new AppError('Meal not found', 404);
    }
    console.log('meal', meal);

    if (
      meal.status === MealStatusEnum.FAILED ||
      meal.status === MealStatusEnum.SUCCESS
    ) {
      console.log('meal already processed');
      return;
    }

    meal.status = MealStatusEnum.PROCESSING;
    console.log('meal updated');
    await mealRepository.update(meal);
    console.log('meal updated');

    try {
      // TODO: IA Process Meal
      meal.status = MealStatusEnum.SUCCESS;
      meal.name = 'Café da manhã';
      meal.icon = '🍞';
      meal.foods = [
        {
          name: 'Pão',
          quantity: '2 fatias',
          calories: 100,
          proteins: 10,
          carbohydrates: 150,
          fats: 10,
        },
      ];
      await mealRepository.update(meal);
      console.log('meal updated');
      return;
    } catch {
      meal.status = MealStatusEnum.FAILED;
      await mealRepository.update(meal);
      throw new AppError('Failed to process meal', 500);
    }
  }
}
