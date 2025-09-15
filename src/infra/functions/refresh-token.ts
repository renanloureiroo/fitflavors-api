import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { RefreshTokenController } from '@/domain/users/controllers/refresh-token.controller';
import { LambdaEventMapper } from '@/infra/mappers/lambda-event.mapper';

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const result = await RefreshTokenController.handle(
    LambdaEventMapper.toHttpRequest(event)
  );
  return LambdaEventMapper.toLambdaResponse(result);
}
