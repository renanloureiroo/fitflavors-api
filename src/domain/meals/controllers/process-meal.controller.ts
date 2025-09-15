import { AppError } from '@/core/app-error';
import { DrizzleMealsRepository } from '@/infra/db/drizzle/repositories/drizzle-meals.repository';
import { InputTypeEnum, MealStatusEnum } from '../entities/meal';
import {
  MealDetails,
  OpenaiAiGateway,
} from '@/infra/gateways/openai-ai.gateway';

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

    if (
      meal.status === MealStatusEnum.FAILED ||
      meal.status === MealStatusEnum.SUCCESS
    ) {
      console.log('meal already processed');
      return;
    }

    meal.status = MealStatusEnum.PROCESSING;
    await mealRepository.update(meal);

    try {
      let mealDetails: MealDetails;
      if (meal.inputType === InputTypeEnum.AUDIO) {
        console.log('processing audio');
        const fileBuffer = await s3StorageGateway.getFile(meal.inputFileKey);

        const text = await openaiAiGateway.transcribeAudio(fileBuffer);

        mealDetails = await openaiAiGateway.getMealDetailsFormText({
          text,
          createdAt: meal.createdAt,
        });

        console.log('mealDetails', mealDetails);

        meal.name = mealDetails.name;
        meal.icon = mealDetails.icon;
        meal.foods = mealDetails.foods;
        meal.status = MealStatusEnum.SUCCESS;

        await mealRepository.update(meal);
      }
    } catch (error) {
      console.log('error', error);
      meal.status = MealStatusEnum.FAILED;
      await mealRepository.update(meal);
      throw new AppError('Failed to process meal', 500);
    }
  }
}
