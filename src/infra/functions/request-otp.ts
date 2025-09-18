import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import { LambdaEventMapper } from '../mappers/lambda-event.mapper';
import { RequestOTPController } from '@/domain/users/controllers/request-otp.controller';

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const httpRequest = LambdaEventMapper.toHttpRequest<{ phoneNumber: string }>(
    event
  );
  const httpResponse = await RequestOTPController.handle(httpRequest);

  return LambdaEventMapper.toLambdaResponse(httpResponse);
};
