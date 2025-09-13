import { AppError } from '@/core/app-error';
import { DrizzleMealsRepository } from '@/infra/db/drizzle/repositories/drizzle-meals.repository';
import { InputTypeEnum, MealStatusEnum } from '../entities/meal';
import { OpenaiAiGateway } from '@/infra/gateways/openai-ai.gateway';

import { S3StorageGateway } from '@/infra/gateways/s3-storage.gateway';

export class ProcessMealController {
  static async handle(fileKey: string): Promise<void> {
    const s3StorageGateway = new S3StorageGateway();
    const mealRepository = new DrizzleMealsRepository();
    const openaiAiGateway = new OpenaiAiGateway();

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
      if (meal.inputType === InputTypeEnum.AUDIO) {
        const fileBuffer = await s3StorageGateway.getFile(meal.inputFileKey);
        const text = await openaiAiGateway.transcribeAudio(fileBuffer);
        console.log('text', text);
      }
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
