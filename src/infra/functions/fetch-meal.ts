import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { LambdaEventMapper } from '../mappers/lambda-event.mapper';
import { FetchMealController } from '@/domain/meals/controllers/fetch-meal.controller';
import { FetchMealDTO } from '@/domain/meals/dtos/fetch-meal.dto';
import { DefaultType } from '@/core/http/types/http';

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const httpRequest = LambdaEventMapper.toHttpRequest<
    DefaultType,
    FetchMealDTO,
    DefaultType
  >(event);

  return LambdaEventMapper.toLambdaResponse(
    await FetchMealController.handle(httpRequest)
  );
};
