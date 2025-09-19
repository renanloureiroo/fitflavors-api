import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import { LambdaEventMapper } from '../mappers/lambda-event.mapper';
import { VerifyOTPController } from '@/domain/users/controllers/verify-otp.controller';

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const httpRequest = LambdaEventMapper.toHttpRequest<{
    countryCode: string;
    areaCode: string;
    phoneNumber: string;
    code: string;
  }>(event);
  const httpResponse = await VerifyOTPController.handle(httpRequest);

  return LambdaEventMapper.toLambdaResponse(httpResponse);
};
