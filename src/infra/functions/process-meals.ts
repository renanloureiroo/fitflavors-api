import { ProcessMealController } from '@/domain/meals/controllers/process-meal.controller';
import { SQSEvent } from 'aws-lambda';

export const handler = async (event: SQSEvent) => {
  await Promise.all(
    event.Records.map(async record => {
      const { fileKey } = JSON.parse(record.body);
      await ProcessMealController.handle(fileKey);
    })
  );
};
