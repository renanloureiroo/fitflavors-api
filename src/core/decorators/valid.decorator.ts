import { ZodType, ZodError } from 'zod';
import { ValidationFormatter } from '@/core/utils/validation-formatter';
import { HttpRequest, HttpResponse } from '@/core/http/types/http';

// Tipos para as opções de validação
type ValidationTarget = 'body' | 'params' | 'queryParams';

interface ValidationOptions {
  message?: string;
  target?: ValidationTarget;
}

interface MultiValidationOptions {
  message?: string;
  body?: ZodType<Record<string, unknown>>;
  params?: ZodType<Record<string, unknown>>;
  queryParams?: ZodType<Record<string, unknown>>;
}

// Decorator para parâmetros de função
export function Valid<T extends Record<string, unknown>>(
  schemaOrOptions: ZodType<T> | MultiValidationOptions,
  options?: ValidationOptions
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const originalMethod = target[propertyKey];

    target[propertyKey] = async function (...args: unknown[]) {
      const request = args[parameterIndex] as HttpRequest<T>;

      try {
        let validatedRequest: HttpRequest<T>;

        if (typeof schemaOrOptions === 'object' && 'body' in schemaOrOptions) {
          // Validação múltipla
          validatedRequest = processValidation(request, [
            {
              type: 'multi',
              schemas: schemaOrOptions,
            },
          ]);
        } else {
          // Validação simples
          validatedRequest = processValidation(request, [
            {
              type: 'single',
              schema: schemaOrOptions as ZodType<T>,
              options: options || { target: 'body' },
            },
          ]);
        }

        // Substituir o parâmetro original pelo validado
        args[parameterIndex] = validatedRequest;

        // Chamar o método original com os argumentos atualizados
        return await originalMethod.apply(this, args);
      } catch (error: unknown) {
        // Se for um erro de validação, retornar diretamente
        if (error && typeof error === 'object' && 'statusCode' in error) {
          return error;
        }
        throw error;
      }
    };

    return target[propertyKey];
  };
}

// Função para processar validações de parâmetros
export function processValidation<T extends Record<string, unknown>>(
  request: HttpRequest<T>,
  validationMetadata: Array<{
    type: 'single' | 'multi';
    schema?: ZodType<T>;
    options?: ValidationOptions;
    schemas?: MultiValidationOptions;
  }>
): HttpRequest<T> {
  const validatedRequest = { ...request };

  for (const metadata of validationMetadata) {
    if (!metadata) continue;

    if (metadata.type === 'single') {
      const { schema, options } = metadata;
      const targetProperty = options?.target || 'body';

      try {
        (validatedRequest as Record<string, unknown>)[targetProperty] =
          schema!.parse((request as Record<string, unknown>)[targetProperty]);
      } catch (error) {
        if (error instanceof ZodError) {
          const errorResponse = ValidationFormatter.formatZodError(
            error,
            options?.message
          );
          throw {
            statusCode: errorResponse.status,
            body: errorResponse,
          };
        }
        throw error;
      }
    } else if (metadata.type === 'multi') {
      const { schemas } = metadata;

      try {
        if (schemas?.body) {
          validatedRequest.body = schemas.body.parse(request.body) as T;
        }
        if (schemas?.params) {
          validatedRequest.params = schemas.params.parse(request.params) as T;
        }
        if (schemas?.queryParams) {
          validatedRequest.queryParams = schemas.queryParams.parse(
            request.queryParams
          ) as T;
        }
      } catch (error) {
        if (error instanceof ZodError) {
          const errorResponse = ValidationFormatter.formatZodError(
            error,
            schemas?.message
          );
          throw {
            statusCode: errorResponse.status,
            body: errorResponse,
          };
        }
        throw error;
      }
    }
  }

  return validatedRequest;
}

// Função auxiliar para usar com métodos estáticos
export function withValidation<T extends Record<string, unknown>>(
  schema: ZodType<T>,
  handler: (request: HttpRequest<T>) => Promise<HttpResponse>,
  options?: ValidationOptions
) {
  return async (request: HttpRequest<T>): Promise<HttpResponse> => {
    try {
      const targetProperty = options?.target || 'body';

      // Validar a propriedade especificada
      const validatedData = schema.parse(request[targetProperty]);

      // Substituir a propriedade original pela validada
      const validatedRequest = {
        ...request,
        [targetProperty]: validatedData,
      };

      // Chamar o handler com os dados validados
      return await handler(validatedRequest);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorResponse = ValidationFormatter.formatZodError(
          error,
          options?.message
        );

        return {
          statusCode: errorResponse.status,
          body: errorResponse,
        };
      }

      // Re-throw outros erros
      throw error;
    }
  };
}

// Função para validar múltiplas propriedades
export function withMultiValidation<T extends Record<string, unknown>>(
  schemas: MultiValidationOptions,
  handler: (request: HttpRequest<T>) => Promise<HttpResponse>
) {
  return async (request: HttpRequest<T>): Promise<HttpResponse> => {
    try {
      const validatedRequest = { ...request };

      // Validar body se schema fornecido
      if (schemas.body) {
        validatedRequest.body = schemas.body.parse(request.body) as T;
      }

      // Validar params se schema fornecido
      if (schemas.params) {
        validatedRequest.params = schemas.params.parse(request.params) as T;
      }

      // Validar queryParams se schema fornecido
      if (schemas.queryParams) {
        validatedRequest.queryParams = schemas.queryParams.parse(
          request.queryParams
        ) as T;
      }

      // Chamar o handler com os dados validados
      return await handler(validatedRequest);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorResponse = ValidationFormatter.formatZodError(
          error,
          schemas.message
        );

        return {
          statusCode: errorResponse.status,
          body: errorResponse,
        };
      }

      // Re-throw outros erros
      throw error;
    }
  };
}
