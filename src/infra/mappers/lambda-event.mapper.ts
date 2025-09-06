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
  >(raw: APIGatewayProxyEventV2): HttpRequest<T> {
    return {
      body: JSON.parse(raw.body ?? '{}') as T,
      params: raw.pathParameters ?? {},
      queryParams: raw.queryStringParameters ?? {},
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
