# C4 Model - Fetch Meal Endpoint

## 🎯 Context (Nível 1)

```mermaid
graph TB
    User[Usuário]
    WebApp[Aplicação Web]
    MobileApp[Aplicação Mobile]
    FitFlavorsAPI[FitFlavors API]
    Database[(PostgreSQL)]

    User -->|"Busca refeição específica"| WebApp
    User -->|"Busca refeição específica"| MobileApp
    WebApp -->|"GET /meals/{id}"| FitFlavorsAPI
    MobileApp -->|"GET /meals/{id}"| FitFlavorsAPI
    FitFlavorsAPI -->|"Consulta refeição"| Database

    classDef user fill:#e1f5fe
    classDef client fill:#f3e5f5
    classDef api fill:#e8f5e8
    classDef database fill:#fff3e0

    class User user
    class WebApp,MobileApp client
    class FitFlavorsAPI api
    class Database database
```

**Descrição:** Endpoint que permite buscar uma refeição específica pelo seu ID. O usuário pode acessar os detalhes completos de uma refeição que foi previamente cadastrada no sistema, incluindo informações sobre alimentos, status de processamento e metadados.

## 🏗️ Container (Nível 2)

```mermaid
graph TB
    Client[Cliente]
    APIGateway[API Gateway]
    Authorizer[Authorizer Lambda]
    FetchMealLambda[Fetch Meal Lambda]
    Database[(PostgreSQL)]

    Client -->|"GET /meals/{id} + JWT"| APIGateway
    APIGateway -->|"Validate Token"| Authorizer
    Authorizer -->|"Policy + User Context"| APIGateway
    APIGateway -->|"Invoke"| FetchMealLambda
    FetchMealLambda -->|"SELECT by ID"| Database
    FetchMealLambda -->|"Response"| APIGateway
    APIGateway -->|"200 OK / 404 Not Found"| Client

    classDef client fill:#e1f5fe
    classDef gateway fill:#f3e5f5
    classDef lambda fill:#e8f5e8
    classDef database fill:#fff3e0

    class Client client
    class APIGateway gateway
    class Authorizer,FetchMealLambda lambda
    class Database database
```

**Componentes:**

- **API Gateway**: Recebe requisições HTTP GET e roteia para Lambda
- **Authorizer Lambda**: Valida token JWT e extrai contexto do usuário
- **Fetch Meal Lambda**: Busca refeição específica no banco de dados
- **PostgreSQL**: Armazena dados das refeições e executa consulta por ID

## 🔧 Component (Nível 3)

```mermaid
graph TB
    LambdaHandler[Lambda Handler]
    Controller[FetchMealController]
    Usecase[FetchMealUsecase]
    Repository[DrizzleMealsRepository]
    Database[(PostgreSQL)]

    LambdaHandler -->|Map Event| Controller
    Controller -->|Execute| Usecase
    Usecase -->|Query by ID| Repository
    Repository -->|SELECT WHERE id| Database

    classDef handler fill:#e1f5fe
    classDef controller fill:#f3e5f5
    classDef usecase fill:#e8f5e8
    classDef provider fill:#fff3e0
    classDef database fill:#ffebee

    class LambdaHandler handler
    class Controller controller
    class Usecase usecase
    class Repository provider
    class Database database
```

**Fluxo de Execução:**

1. **Lambda Handler** mapeia evento API Gateway para HttpRequest
2. **Controller** recebe requisição e valida parâmetros (ID)
3. **Usecase** executa lógica de negócio e valida propriedade da refeição
4. **Repository** consulta refeição por ID no banco de dados

## 💻 Code (Nível 4)

### **Estrutura de Arquivos**

```
src/
├── infra/functions/
│   └── fetch-meal.ts                    # Lambda Handler
├── domain/meals/controllers/
│   └── fetch-meal.controller.ts         # Controller
├── domain/meals/usecases/
│   └── fetch-meal.usecase.ts            # Use Case
├── domain/meals/repositories/
│   └── meals.repository.ts              # Repository Interface
├── infra/db/drizzle/repositories/
│   └── drizzle-meals.repository.ts      # Repository Implementation
└── domain/meals/dtos/
    └── fetch-meal.dto.ts                # Request/Response DTOs
```

### **Fluxo de Dados**

```mermaid
sequenceDiagram
    participant C as Cliente
    participant AG as API Gateway
    participant AUTH as Authorizer
    participant LH as Lambda Handler
    participant CTRL as Controller
    participant UC as Usecase
    participant REPO as Repository
    participant DB as Database

    C->>AG: GET /meals/{id} + JWT
    AG->>AUTH: Validate JWT Token
    AUTH->>AG: Policy + User Context
    AG->>LH: Invoke Lambda
    LH->>CTRL: Map to HttpRequest
    CTRL->>UC: Execute usecase
    UC->>REPO: Find by ID
    REPO->>DB: SELECT WHERE id = ?
    DB-->>REPO: Meal data
    REPO-->>UC: Return Meal entity
    UC-->>CTRL: Return Meal
    CTRL-->>LH: Return HTTP response
    LH-->>AG: Lambda response
    AG-->>C: 200 OK + Meal data
```

### **Validações**

```typescript
const fetchMealSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
});
```

### **Request**

```http
GET /meals/{id}
Authorization: Bearer <jwt-token>
```

**Path Parameters:**

- `id` (string, required): UUID da refeição a ser buscada

### **Response de Sucesso (200 OK)**

```typescript
{
  "meal": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Café da manhã",
    "icon": "🥐",
    "status": "success",
    "inputType": "picture",
    "inputFileKey": "meals/user123/breakfast.jpg",
    "foods": [
      {
        "name": "Pão integral",
        "calories": 80,
        "quantity": 1
      }
    ],
    "createdAt": "2024-01-15T08:30:00.000Z",
    "updatedAt": "2024-01-15T08:30:00.000Z"
  }
}
```

### **Response de Erro**

```typescript
// 404 Not Found - Refeição não encontrada
{
  "error": "Not Found",
  "message": "Refeição não encontrada"
}

// 400 Bad Request - ID inválido
{
  "error": "Validation Error",
  "message": "ID deve ser um UUID válido"
}

// 401 Unauthorized - Token inválido
{
  "error": "Unauthorized",
  "message": "Token inválido ou expirado"
}
```

### **Tratamento de Erros**

- **400 Bad Request**: ID não é um UUID válido
- **401 Unauthorized**: Token JWT inválido ou expirado
- **404 Not Found**: Refeição não encontrada ou não pertence ao usuário
- **500 Internal Server Error**: Erro interno do servidor

## 📊 Métricas e Monitoramento

### **Métricas de Sucesso**

- Taxa de busca de refeição bem-sucedida
- Tempo de resposta do endpoint
- Uso de memória da Lambda
- Taxa de cache hit (se implementado)

### **Métricas de Erro**

- Taxa de validação falhada (ID inválido)
- Taxa de refeição não encontrada
- Erros de banco de dados
- Timeouts de consulta

### **Métricas de Segurança**

- Tentativas de acesso não autorizado
- Taxa de tokens inválidos
- Tentativas de acesso a refeições de outros usuários

### **Logs Importantes**

- Tentativas de busca de refeição (sucesso/falha)
- Erros de validação de ID
- Tentativas de acesso não autorizado
- Problemas de conectividade com banco

## 🔒 Considerações de Segurança

- **Validação rigorosa** de UUID no parâmetro ID
- **Autenticação obrigatória** via JWT
- **Autorização** - usuário só pode buscar suas próprias refeições
- **Rate limiting** para prevenir abuso
- **Logs de auditoria** para acessos a refeições
- **Não exposição** de dados sensíveis de outros usuários

## 🚀 Melhorias Futuras

1. **Cache Redis** para refeições frequentemente acessadas
2. **Paginação** para refeições com muitos alimentos
3. **Filtros avançados** por data, status, tipo de entrada
4. **Compressão** de resposta para refeições grandes
5. **Métricas de negócio** (refeições mais acessadas, etc.)

## 📝 Checklist de Implementação

### **Desenvolvimento**

- [x] Criar Lambda Handler
- [x] Implementar Controller
- [x] Implementar Use Case
- [x] Criar DTOs (Request/Response)
- [x] Implementar validações
- [x] Adicionar tratamento de erros

### **Testes**

- [ ] Testes unitários para Use Case
- [ ] Testes de integração para Controller
- [ ] Testes de validação de UUID
- [ ] Testes de autorização
- [ ] Testes de tratamento de erros

### **Deploy**

- [x] Configurar no serverless.yml
- [x] Configurar autorização
- [x] Configurar variáveis de ambiente
- [ ] Testar em ambiente de desenvolvimento

### **Monitoramento**

- [ ] Configurar métricas de CloudWatch
- [ ] Configurar alertas para erros 404
- [ ] Implementar logs estruturados
- [ ] Documentar métricas de negócio

---

**Nota:** Este endpoint é essencial para permitir que usuários visualizem detalhes específicos de suas refeições, sendo fundamental para a experiência do usuário na aplicação.
