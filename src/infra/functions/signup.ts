import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { SignUpController } from '@/domain/users/controllers/sign-up.controller';
import { LambdaEventMapper } from '@/infra/mappers/lambda-event.mapper';

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const result = await SignUpController.handle(
    LambdaEventMapper.toHttpRequest(event)
  );
  return LambdaEventMapper.toLambdaResponse(result);
}
