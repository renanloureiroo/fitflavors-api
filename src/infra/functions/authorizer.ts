import {
  APIGatewayRequestAuthorizerEvent,
  APIGatewayAuthorizerResult,
} from 'aws-lambda';
import { JwtProviderImpl } from '@/infra/providers/jwt.provider';

export async function handler(
  event: APIGatewayRequestAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> {
  try {
    const token = event.headers?.authorization || event.headers?.Authorization;

    if (!token) {
      throw new Error('Token não fornecido');
    }

    const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;

    const jwtProvider = new JwtProviderImpl();

    const payload = jwtProvider.verifyToken(cleanToken);

    if (!payload) {
      throw new Error('Token inválido');
    }

    // Construir o ARN base para permitir acesso a todos os métodos da API
    const methodArn = event.methodArn || '*';
    const resourceArn = methodArn.replace(/\/[^/]*$/, '/*');

    return {
      principalId: payload.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: resourceArn,
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
            Resource: event.methodArn,
          },
        ],
      },
    };
  }
}
