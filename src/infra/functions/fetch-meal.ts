import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LambdaEventMapper } from '../mappers/lambda-event.mapper';
import { FetchMealController } from '@/domain/meals/controllers/fetch-meal.controller';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const httpRequest = LambdaEventMapper.toHttpRequest(event);

  return await FetchMealController.handle(httpRequest);
};
