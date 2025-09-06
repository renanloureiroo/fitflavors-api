import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { SignInController } from '@/domain/users/controllers/sign-in.controller';
import { LambdaEventMapper } from '@/infra/mappers/lambda-event.mapper';

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const result = await SignInController.handle(
    LambdaEventMapper.toHttpRequest(event)
  );
  return LambdaEventMapper.toLambdaResponse(result);
}
