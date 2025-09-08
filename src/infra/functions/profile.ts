import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ProfileController } from '@/domain/users/controllers/profile.controller';
import { LambdaEventMapper } from '@/infra/mappers/lambda-event.mapper';

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const result = await ProfileController.handle(
    LambdaEventMapper.toHttpRequest(event)
  );
  return LambdaEventMapper.toLambdaResponse(result);
}
