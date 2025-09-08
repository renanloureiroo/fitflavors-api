import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { HttpRequest, HttpResponse } from '@/core/http/types/http';

/**
 * @description Mapeia o evento da lambda para o tipo HttpRequest e o tipo HttpResponse
 */
export class LambdaEventMapper {
  /**
   * @description Mapeia o evento da lambda para o tipo HttpRequest
   * @param event - APIGatewayProxyResultV2
   * @returns toHttpRequest
   * @see https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html#typescript-handler-event
   */
  static toHttpRequest<
    T extends Record<string, unknown> = Record<string, unknown>,
    P extends Record<string, unknown> = Record<string, unknown>,
    Q extends Record<string, unknown> = Record<string, unknown>,
  >(raw: APIGatewayProxyEventV2): HttpRequest<T, P, Q> {
    return {
      body: JSON.parse(raw.body ?? '{}') as T,
      params: (raw.pathParameters ?? {}) as P,
      queryParams: (raw.queryStringParameters ?? {}) as Q,
      headers: raw.headers
        ? Object.fromEntries(
            Object.entries(raw.headers).map(([key, value]) => [
              key,
              value ?? '',
            ])
          )
        : {},
      context: {
        // Informações do usuário autenticado vindas do JWT Authorizer
        // Para JWT authorizers, o contexto vem em requestContext.authorizer.jwt.claims
        userId:
          (raw.requestContext as any)?.authorizer?.jwt?.claims?.sub ||
          (raw.requestContext as any)?.authorizer?.sub ||
          (raw.requestContext as any)?.authorizer?.userId ||
          (raw.requestContext as any)?.authorizer?.['user-id'],
        email:
          (raw.requestContext as any)?.authorizer?.jwt?.claims?.email ||
          (raw.requestContext as any)?.authorizer?.email ||
          (raw.requestContext as any)?.authorizer?.['user-email'],
      },
    };
  }

  /**
   * @description Mapeia o tipo HttpResponse para o tipo da resposta da lambda
   * @param response - HttpResponse
   * @returns APIGatewayProxyResultV2
   * @see https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html#typescript-handler-response
   */
  static toLambdaResponse<
    T extends Record<string, unknown> = Record<string, unknown>,
  >(raw: HttpResponse<T>): APIGatewayProxyResultV2 {
    return {
      statusCode: raw.statusCode,
      body: JSON.stringify(raw.body),
    };
  }
}
