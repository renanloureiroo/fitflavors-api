import { LambdaEventMapper } from '@/infra/mappers/lambda-event.mapper';
import { ListMealsController } from '@/domain/meals/controllers/list-meals.controller';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ListMealsDTO } from '@/domain/meals/dtos/list-meals.dto';
import { DefaultType } from '@/core/http/types/http';

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const result = await ListMealsController.handle(
    LambdaEventMapper.toHttpRequest<DefaultType, DefaultType, ListMealsDTO>(
      event
    )
  );
  return LambdaEventMapper.toLambdaResponse(result);
};
