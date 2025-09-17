import {
  APIGatewayRequestAuthorizerEventV2,
  APIGatewayAuthorizerResult,
} from 'aws-lambda';
import { JwtProviderImpl } from '@/infra/providers/jwt.provider';

export async function handler(
  event: APIGatewayRequestAuthorizerEventV2
): Promise<APIGatewayAuthorizerResult> {
  try {
    const token = event.headers?.authorization || event.headers?.Authorization;

    if (!token) {
      throw new Error('Token não fornecido');
    }

    const [_, cleanToken] = token.split(' ');

    const jwtProvider = new JwtProviderImpl();

    const payload = jwtProvider.verifyToken(cleanToken!);

    if (!payload) {
      throw new Error('Token inválido');
    }

    // Para HTTP API Gateway v2, retornamos Allow com contexto
    return {
      principalId: payload.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
      context: {
        sub: payload.sub,
        email: payload.email,
        userId: payload.sub,
        'user-id': payload.sub,
        'user-email': payload.email,
      },
    };
  } catch (error) {
    console.error('Authorization error:', error);
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*',
          },
        ],
      },
    };
  }
}
