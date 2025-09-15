import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { LambdaEventMapper } from '../mappers/lambda-event.mapper';
import { DeleteMealController } from '@/domain/meals/controllers/delete-meal.controller';
import { DeleteMealDTO } from '@/domain/meals/dtos/delete-meal.dto';
import { DefaultType } from '@/core/http/types/http';

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const httpRequest = LambdaEventMapper.toHttpRequest<
    DefaultType,
    DeleteMealDTO,
    DefaultType
  >(event);

  return LambdaEventMapper.toLambdaResponse(
    await DeleteMealController.handle(httpRequest)
  );
};
