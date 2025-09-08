# C4 Model - [NOME_DO_ENDPOINT] Endpoint

## 🎯 Context (Nível 1)

```mermaid
graph TB
    User[Usuário]
    WebApp[Aplicação Web]
    MobileApp[Aplicação Mobile]
    FitFlavorsAPI[FitFlavors API]
    Database[(PostgreSQL)]

    User -->|Acessa recurso| WebApp
    User -->|Acessa recurso| MobileApp
    WebApp -->|POST /endpoint| FitFlavorsAPI
    MobileApp -->|POST /endpoint| FitFlavorsAPI
    FitFlavorsAPI -->|Consulta dados| Database

    classDef user fill:#e1f5fe
    classDef client fill:#f3e5f5
    classDef api fill:#e8f5e8
    classDef database fill:#fff3e0

    class User user
    class WebApp,MobileApp client
    class FitFlavorsAPI api
    class Database database
```

**Descrição:** [Descrição detalhada do que o endpoint faz e qual problema resolve]

## 🏗️ Container (Nível 2)

```mermaid
graph TB
    Client[Cliente]
    APIGateway[API Gateway]
    EndpointLambda[Endpoint Lambda]
    Database[(PostgreSQL)]

    Client -->|POST /endpoint| APIGateway
    APIGateway -->|Invoke| EndpointLambda
    EndpointLambda -->|Query| Database
    EndpointLambda -->|Response| APIGateway
    APIGateway -->|200 OK| Client

    classDef client fill:#e1f5fe
    classDef gateway fill:#f3e5f5
    classDef lambda fill:#e8f5e8
    classDef database fill:#fff3e0

    class Client client
    class APIGateway gateway
    class EndpointLambda lambda
    class Database database
```

**Componentes:**

- **API Gateway**: Recebe requisições HTTP e roteia para Lambda
- **Endpoint Lambda**: [Descrição do que a Lambda faz]
- **PostgreSQL**: [Descrição da interação com o banco]

## 🔧 Component (Nível 3)

```mermaid
graph TB
    LambdaHandler[Lambda Handler]
    Controller[Controller]
    Usecase[Usecase]
    Repository[Repository]
    Database[(PostgreSQL)]

    LambdaHandler -->|Map Event| Controller
    Controller -->|Execute| Usecase
    Usecase -->|Query| Repository
    Repository -->|Query| Database

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
2. **Controller** recebe requisição e aplica validações
3. **Usecase** executa lógica de negócio
4. **Repository** consulta/persiste dados no banco

## 💻 Code (Nível 4)

### **Estrutura de Arquivos**

```
src/
├── infra/functions/
│   └── [nome].ts                          # Lambda Handler
├── domain/users/controllers/
│   └── [nome].controller.ts               # Controller
├── domain/users/usecases/
│   └── [nome].usecase.ts                  # Use Case
├── domain/users/repositories/
│   └── user.repository.ts                 # Repository Interface
├── infra/db/drizzle/repositories/
│   └── drizzle-user.repository.ts         # Repository Implementation
└── domain/users/dtos/
    ├── [nome]-request.dto.ts              # Request DTO
    └── [nome]-response.dto.ts             # Response DTO
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

    C->>AG: [MÉTODO] /[ENDPOINT] + [AUTH_HEADER]
    AG->>AUTH: Validate JWT Token
    AUTH->>AG: Policy + User Context
    AG->>LH: Invoke Lambda
    LH->>CTRL: Map to HttpRequest
    CTRL->>UC: Execute usecase
    UC->>REPO: [OPERATION] data
    REPO->>DB: [SQL_OPERATION]
    DB-->>REPO: [RESULT]
    REPO-->>UC: Return [ENTITY]
    UC-->>CTRL: Return [RESULT]
    CTRL-->>LH: Return HTTP response
    LH-->>AG: Lambda response
    AG-->>C: [STATUS_CODE] + [DATA]
```

**Personalização do Diagrama:**

- Substitua `[MÉTODO]` pelo método HTTP (GET, POST, PUT, DELETE)
- Substitua `/[ENDPOINT]` pelo caminho do endpoint
- Substitua `[AUTH_HEADER]` por "JWT" se autenticado, ou remova se público
- Substitua `[OPERATION]` pela operação específica (Create, Read, Update, Delete)
- Substitua `[SQL_OPERATION]` pela operação SQL (INSERT, SELECT, UPDATE, DELETE)
- Substitua `[STATUS_CODE]` pelo código de status HTTP (200, 201, 400, etc.)
- Substitua `[DATA]` pela descrição dos dados retornados

### **Validações**

```typescript
const schema = z.object({
  // [Definir schema de validação]
  field1: z.string().min(1),
  field2: z.email(),
  field3: z.number().positive(),
});
```

### **Request Body**

```typescript
{
  // [Definir estrutura do request]
  "field1": "string",
  "field2": "email@example.com",
  "field3": 123
}
```

### **Response de Sucesso**

```typescript
{
  // [Definir estrutura da resposta de sucesso]
  "data": {
    "id": "user-123",
    "field1": "value1"
  }
}
```

### **Response de Erro**

```typescript
{
  "error": "[Tipo do erro]",
  "message": "[Descrição do erro]"
}
```

### **Tratamento de Erros**

- **400 Bad Request**: Dados de validação inválidos
- **401 Unauthorized**: Token JWT inválido ou expirado
- **403 Forbidden**: Usuário sem permissão
- **404 Not Found**: Recurso não encontrado
- **409 Conflict**: Conflito de dados
- **500 Internal Server Error**: Erro interno do servidor

## 📊 Métricas e Monitoramento

### **Métricas de Sucesso**

- Taxa de [ação] bem-sucedida
- Tempo de resposta do endpoint
- Uso de memória da Lambda
- [Métricas específicas do endpoint]

### **Métricas de Erro**

- Taxa de validação falhada
- Taxa de [erros específicos]
- Erros de banco de dados
- [Outras métricas de erro]

### **Métricas de Segurança**

- Tentativas de acesso não autorizado
- Taxa de tokens inválidos
- [Métricas de segurança específicas]

### **Logs Importantes**

- Tentativas de [ação] (sucesso/falha)
- Erros de validação
- [Logs específicos do endpoint]
- Problemas de conectividade com banco

## 🔒 Considerações de Segurança

- **Validação rigorosa** de dados de entrada
- **Autenticação** (se aplicável)
- **Autorização** (se aplicável)
- **Rate limiting** para prevenir abuso
- **Logs de auditoria** para [ação]
- **Não exposição** de dados sensíveis

## 🚀 Melhorias Futuras

1. **[Melhoria 1]**
2. **[Melhoria 2]**
3. **[Melhoria 3]**
4. **[Melhoria 4]**
5. **[Melhoria 5]**

## 📝 Checklist de Implementação

### **Desenvolvimento**

- [ ] Criar Lambda Handler
- [ ] Implementar Controller
- [ ] Implementar Use Case
- [ ] Criar DTOs (Request/Response)
- [ ] Implementar validações
- [ ] Adicionar tratamento de erros

### **Testes**

- [ ] Testes unitários para Use Case
- [ ] Testes de integração para Controller
- [ ] Testes de validação
- [ ] Testes de tratamento de erros

### **Deploy**

- [ ] Configurar no serverless.yml
- [ ] Configurar autorização (se necessário)
- [ ] Configurar variáveis de ambiente
- [ ] Testar em ambiente de desenvolvimento

### **Monitoramento**

- [ ] Configurar métricas de CloudWatch
- [ ] Configurar alertas
- [ ] Implementar logs estruturados
- [ ] Documentar métricas de negócio

---

**Nota:** Substitua todos os placeholders `[NOME]`, `[ENDPOINT]`, `[MÉTODO]`, etc. pelos valores específicos do seu endpoint.
