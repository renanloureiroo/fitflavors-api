# Sistema de Validação HTTP

Este módulo fornece um sistema completo de validação para requisições HTTP usando Zod, com formatação de erros amigável em português.

## Características

- ✅ Validação automática de body, params e queryParams
- ✅ Formatação de erros em português brasileiro
- ✅ Tipagem TypeScript completa
- ✅ Função `withValidation` para validação simples
- ✅ Função `withMultiValidation` para validação múltipla
- ✅ Formato de erro padronizado
- ✅ Mensagens de erro customizáveis

## Como Usar

### 1. Importar as dependências

```typescript
import { z } from 'zod';
import {
  withValidation,
  withMultiValidation,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '../core/http';
```

### 2. Definir os schemas de validação

```typescript
const userSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email deve ter formato válido'),
  age: z.number().min(18, 'Idade deve ser pelo menos 18 anos'),
});

const paramsSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
});

const querySchema = z.object({
  page: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val) : 10)),
});
```

### 3. Validação de uma propriedade (withValidation)

```typescript
export class UserController {
  // Validação do body (padrão)
  static createUser = withValidation(
    userSchema,
    async ({ body }: HttpRequest<UserRequest>): Promise<HttpResponse> => {
      return HttpHandler.created({ id: 'user-123', ...body });
    },
    { message: 'Dados do usuário inválidos' }
  );

  // Validação dos params
  static getUser = withValidation(
    paramsSchema,
    async ({ params }: HttpRequest<ParamsRequest>): Promise<HttpResponse> => {
      return HttpHandler.ok({ id: params.id, name: 'João' });
    },
    { target: 'params', message: 'Parâmetros inválidos' }
  );

  // Validação dos queryParams
  static listUsers = withValidation(
    querySchema,
    async ({
      queryParams,
    }: HttpRequest<QueryRequest>): Promise<HttpResponse> => {
      return HttpHandler.ok({ users: [], ...queryParams });
    },
    { target: 'queryParams', message: 'Parâmetros de consulta inválidos' }
  );
}
```

### 4. Validação de múltiplas propriedades (withMultiValidation)

```typescript
export class UserController {
  // Validação de body + params
  static updateUser = withMultiValidation(
    {
      body: userSchema.partial(),
      params: paramsSchema,
      message: 'Dados de atualização inválidos',
    },
    async ({
      body,
      params,
    }: HttpRequest<UserRequest & ParamsRequest>): Promise<HttpResponse> => {
      return HttpHandler.ok({ id: params.id, ...body });
    }
  );

  // Validação completa (body + params + queryParams)
  static searchUsers = withMultiValidation(
    {
      body: userSchema.partial(),
      params: paramsSchema,
      queryParams: querySchema,
      message: 'Parâmetros de busca inválidos',
    },
    async ({
      body,
      params,
      queryParams,
    }: HttpRequest<
      UserRequest & ParamsRequest & QueryRequest
    >): Promise<HttpResponse> => {
      return HttpHandler.ok({ id: params.id, ...body, ...queryParams });
    }
  );
}
```

### 5. Usar com decorator @Valid no parâmetro (Recomendado)

```typescript
export class UserController {
  // Validação apenas do body (padrão)
  static async createUser(
    @Valid(userSchema, { message: 'Dados do usuário inválidos' })
    request: HttpRequest<UserRequest>
  ): Promise<HttpResponse> {
    // O body já está validado automaticamente
    return HttpHandler.created({ id: 'user-123', ...request.body });
  }

  // Validação apenas dos params
  static async getUser(
    @Valid(paramsSchema, { target: 'params', message: 'ID inválido' })
    request: HttpRequest<ParamsRequest>
  ): Promise<HttpResponse> {
    // Os params já estão validados automaticamente
    return HttpHandler.ok({ id: request.params.id });
  }

  // Validação apenas dos queryParams
  static async listUsers(
    @Valid(querySchema, {
      target: 'queryParams',
      message: 'Parâmetros inválidos',
    })
    request: HttpRequest<QueryRequest>
  ): Promise<HttpResponse> {
    // Os queryParams já estão validados automaticamente
    return HttpHandler.ok({ users: [], ...request.queryParams });
  }

  // Validação múltipla (body + params)
  static async updateUser(
    @Valid({
      body: userSchema.partial(),
      params: paramsSchema,
      message: 'Dados inválidos',
    })
    request: HttpRequest<UserRequest & ParamsRequest>
  ): Promise<HttpResponse> {
    // Body e params já estão validados automaticamente
    return HttpHandler.ok({
      id: request.params.id,
      ...request.body,
    });
  }
}
```

### 6. Exemplo de uso em função Lambda

```typescript
export const handler = async (event: any) => {
  const request: HttpRequest<UserRequest> = {
    body: JSON.parse(event.body || '{}'),
    params: event.pathParameters || {},
    queryParams: event.queryStringParameters || {},
  };

  return await UserController.createUser(request);
};
```

## Formato de Resposta de Erro

Quando a validação falha, o sistema retorna uma resposta padronizada:

```json
{
  "statusCode": 400,
  "body": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "status": 400,
    "message": "Dados inválidos fornecidos",
    "errors": [
      {
        "field": "email",
        "message": "Email deve ter formato válido"
      },
      {
        "field": "age",
        "message": "Idade deve ser pelo menos 18 anos"
      }
    ]
  }
}
```

## Estrutura do Erro

Cada erro de validação contém:

- `field`: Caminho do campo (ex: "user.email", "address.zipCode")
- `message`: Mensagem de erro (usando as mensagens customizadas do Zod)

## Exemplo Completo

```typescript
import { z } from 'zod';
import {
  withValidation,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '../core/http';

const signUpSchema = z.object({
  goal: z.enum(['lose', 'maintain', 'gain']),
  gender: z.enum(['male', 'female']),
  birthDate: z.string().datetime(),
  height: z.number().positive('A altura deve ser um número positivo'),
  weight: z.number().positive('O peso deve ser um número positivo'),
  activityLevel: z
    .number()
    .min(1, 'Nível de atividade deve ser pelo menos 1')
    .max(5, 'Nível de atividade deve ser no máximo 5'),
  account: z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email deve ter um formato válido'),
    password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  }),
});

type SignUpRequest = z.infer<typeof signUpSchema>;

export class SignUpController {
  static handle = withValidation(
    signUpSchema,
    async ({ body }: HttpRequest<SignUpRequest>): Promise<HttpResponse> => {
      // Aqui o body já está validado e tipado corretamente
      console.log('Dados validados:', body);

      // Simular processamento de cadastro
      return HttpHandler.created({
        accessToken: '1234567890',
        user: {
          id: 'user-123',
          name: body.account.name,
          email: body.account.email,
        },
      });
    },
    {
      message: 'Dados de cadastro inválidos',
    }
  );
}
```

## Vantagens

1. **Simples**: Apenas 20 linhas de código no ValidationFormatter
2. **Validação Automática**: Não precisa verificar manualmente se os dados são válidos
3. **Tipagem Forte**: TypeScript sabe exatamente o tipo dos dados validados
4. **Erros Amigáveis**: Usa as mensagens customizadas do Zod
5. **Formato Padronizado**: Baseado no seu ErrorResponse
6. **Flexível**: Suporta schemas complexos e validações customizadas
7. **Reutilizável**: Pode ser usado em qualquer controller
