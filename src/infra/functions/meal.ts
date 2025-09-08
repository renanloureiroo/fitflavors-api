import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

import { LambdaEventMapper } from '@/infra/mappers/lambda-event.mapper';
import { CreateMealController } from '@/domain/meals/controllers/create-meal.controller';

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const result = await CreateMealController.handle(
    LambdaEventMapper.toHttpRequest(event)
  );
  return LambdaEventMapper.toLambdaResponse(result);
}
