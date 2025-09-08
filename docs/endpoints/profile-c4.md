# C4 Model - Profile Endpoint (GET /me)

## 🎯 Context (Nível 1)

```mermaid
graph TB
    User[Usuário Autenticado]
    WebApp[Aplicação Web]
    MobileApp[Aplicação Mobile]
    FitFlavorsAPI[FitFlavors API]
    Database[(PostgreSQL)]

    User -->|Acessa perfil| WebApp
    User -->|Acessa perfil| MobileApp
    WebApp -->|GET /me + JWT| FitFlavorsAPI
    MobileApp -->|GET /me + JWT| FitFlavorsAPI
    FitFlavorsAPI -->|Busca dados| Database

    classDef user fill:#e1f5fe
    classDef client fill:#f3e5f5
    classDef api fill:#e8f5e8
    classDef database fill:#fff3e0

    class User user
    class WebApp,MobileApp client
    class FitFlavorsAPI api
    class Database database
```

**Descrição:** O endpoint de Profile permite que usuários autenticados acessem seus dados pessoais e de fitness, incluindo informações calculadas como metas nutricionais.

## 🏗️ Container (Nível 2)

```mermaid
graph TB
    Client[Cliente Autenticado]
    APIGateway[API Gateway]
    Authorizer[Lambda Authorizer]
    ProfileLambda[Profile Lambda]
    Database[(PostgreSQL)]

    Client -->|GET /me + Authorization| APIGateway
    APIGateway -->|Validate JWT| Authorizer
    Authorizer -->|Policy + Context| APIGateway
    APIGateway -->|Invoke with Context| ProfileLambda
    ProfileLambda -->|Query User Data| Database
    ProfileLambda -->|Return Profile| APIGateway
    APIGateway -->|200 OK + Profile| Client

    classDef client fill:#e1f5fe
    classDef gateway fill:#f3e5f5
    classDef authorizer fill:#ffebee
    classDef lambda fill:#e8f5e8
    classDef database fill:#fff3e0

    class Client client
    class APIGateway gateway
    class Authorizer authorizer
    class ProfileLambda lambda
    class Database database
```

**Componentes:**

- **API Gateway**: Recebe requisições HTTP e valida JWT
- **Lambda Authorizer**: Valida token JWT e retorna contexto do usuário
- **Profile Lambda**: Busca e retorna dados do perfil do usuário
- **PostgreSQL**: Armazena dados do usuário

## 🔧 Component (Nível 3)

```mermaid
graph TB
    LambdaHandler[Lambda Handler]
    ProfileController[Profile Controller]
    FetchProfileUsecase[Fetch Profile Usecase]
    UserRepository[User Repository]
    UserPresenter[User Presenter]
    Database[(PostgreSQL)]

    LambdaHandler -->|Map Event + Context| ProfileController
    ProfileController -->|Execute| FetchProfileUsecase
    FetchProfileUsecase -->|Find User| UserRepository
    FetchProfileUsecase -->|Format Data| UserPresenter
    UserRepository -->|Query| Database

    classDef handler fill:#e1f5fe
    classDef controller fill:#f3e5f5
    classDef usecase fill:#e8f5e8
    classDef provider fill:#fff3e0
    classDef database fill:#ffebee

    class LambdaHandler handler
    class ProfileController controller
    class FetchProfileUsecase usecase
    class UserRepository,UserPresenter provider
    class Database database
```

**Fluxo de Execução:**

1. **Lambda Handler** mapeia evento API Gateway para HttpRequest
2. **Profile Controller** recebe requisição com contexto do usuário
3. **Fetch Profile Usecase** executa lógica de busca de perfil
4. **User Repository** busca dados do usuário por ID
5. **User Presenter** formata dados para resposta

## 💻 Code (Nível 4)

### **Estrutura de Arquivos**

```
src/
├── infra/functions/
│   ├── authorizer.ts                    # Lambda Authorizer
│   └── profile.ts                       # Lambda Handler
├── domain/users/controllers/
│   └── profile.controller.ts            # Controller
├── domain/users/usecases/
│   └── fetch-profile.usecase.ts         # Use Case
├── domain/users/repositories/
│   └── user.repository.ts               # Repository Interface
├── infra/db/drizzle/repositories/
│   └── drizzle-user.repository.ts       # Repository Implementation
├── domain/users/presenters/
│   └── user.presenter.ts                # Data Presenter
└── domain/users/dtos/
    └── fetch-profile-response.dto.ts    # Response DTO
```

### **Fluxo de Dados**

```mermaid
sequenceDiagram
    participant C as Cliente
    participant AG as API Gateway
    participant A as Authorizer
    participant LH as Lambda Handler
    participant PC as Profile Controller
    participant FPU as Fetch Profile Usecase
    participant UR as User Repository
    participant UP as User Presenter
    participant DB as Database

    C->>AG: GET /me + Authorization header
    AG->>A: Validate JWT token
    A->>A: Verify token signature & expiration
    A-->>AG: Policy + User context {userId, email}
    AG->>LH: Invoke Lambda with context
    LH->>PC: Map to HttpRequest + context
    PC->>FPU: Execute usecase with userId
    FPU->>UR: Find user by ID
    UR->>DB: SELECT user by id
    DB-->>UR: User data
    UR-->>FPU: User entity
    FPU->>UP: Format user data
    UP-->>FPU: Formatted profile
    FPU-->>PC: Profile data
    PC-->>LH: HTTP Response
    LH-->>AG: Lambda Response
    AG-->>C: 200 OK + Profile
```

### **Validação de Autenticação**

```typescript
// No Lambda Authorizer
const payload = jwtProvider.verifyToken(cleanToken);
if (!payload) {
  throw new Error('Token inválido');
}

return {
  principalId: payload.sub,
  context: {
    userId: payload.sub,
    email: payload.email,
  },
};
```

### **Resposta de Sucesso**

```typescript
{
  "profile": {
    "id": "user-123",
    "name": "João Silva",
    "email": "joao@example.com",
    "gender": "male",
    "goal": "lose",
    "birthDate": "1990-01-01",
    "height": 175,
    "weight": 80,
    "activityLevel": 3,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### **Tratamento de Erros**

- **401 Unauthorized**: Token JWT inválido ou expirado
- **403 Forbidden**: Token válido mas sem permissão
- **404 Not Found**: Usuário não encontrado
- **500 Internal Server Error**: Erro interno do servidor

## 📊 Métricas e Monitoramento

### **Métricas de Sucesso**

- Taxa de acesso ao perfil bem-sucedido
- Tempo de resposta do endpoint
- Tempo de validação do JWT
- Uso de memória da Lambda

### **Métricas de Erro**

- Taxa de tokens inválidos
- Taxa de usuários não encontrados
- Erros de banco de dados
- Timeouts do authorizer

### **Métricas de Segurança**

- Tentativas de acesso com token inválido
- Taxa de tokens expirados
- Acessos negados pelo authorizer

### **Logs Importantes**

- Tentativas de acesso ao perfil
- Validação de JWT (sucesso/falha)
- Erros de busca de usuário
- Problemas de conectividade com banco

## 🔒 Considerações de Segurança

- **Validação rigorosa** de JWT no API Gateway
- **Contexto do usuário** passado pelo authorizer
- **Isolamento de dados** por usuário
- **Logs de auditoria** para acessos ao perfil
- **Rate limiting** para prevenir abuso
- **Não exposição** de dados sensíveis

## 🚀 Melhorias Futuras

1. **Cache** de dados do perfil
2. **Paginação** para dados históricos
3. **Versionamento** de API
4. **Métricas de negócio** (frequência de acesso)
5. **Logs de auditoria** mais detalhados
6. **Validação adicional** de permissões
7. **Rate limiting** por usuário
8. **Monitoramento** de acessos suspeitos

## 🔄 Fluxo de Autorização

```mermaid
graph LR
    Request[Requisição GET /me]
    JWT[Validar JWT]
    Policy[Gerar Política]
    Context[Adicionar Contexto]
    Allow[Permitir Acesso]
    Deny[Negar Acesso]

    Request --> JWT
    JWT -->|Válido| Policy
    JWT -->|Inválido| Deny
    Policy --> Context
    Context --> Allow

    classDef success fill:#e8f5e8
    classDef error fill:#ffebee

    class Request,JWT,Policy,Context,Allow success
    class Deny error
```

## 📈 Performance

### **Otimizações Implementadas**

- Validação de JWT no API Gateway (cache de 300s)
- Consulta direta por ID (índice primário)
- Resposta mínima com dados essenciais

### **Métricas de Performance**

- Latência do authorizer: < 100ms
- Latência da Lambda: < 200ms
- Latência total: < 300ms
- Throughput: 1000+ req/s
