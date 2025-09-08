# C4 Model - Sign In Endpoint

## 🎯 Context (Nível 1)

```mermaid
graph TB
    User[Usuário]
    WebApp[Aplicação Web]
    MobileApp[Aplicação Mobile]
    FitFlavorsAPI[FitFlavors API]
    Database[(PostgreSQL)]

    User -->|Faz login| WebApp
    User -->|Faz login| MobileApp
    WebApp -->|POST /signin| FitFlavorsAPI
    MobileApp -->|POST /signin| FitFlavorsAPI
    FitFlavorsAPI -->|Valida credenciais| Database

    classDef user fill:#e1f5fe
    classDef client fill:#f3e5f5
    classDef api fill:#e8f5e8
    classDef database fill:#fff3e0

    class User user
    class WebApp,MobileApp client
    class FitFlavorsAPI api
    class Database database
```

**Descrição:** O endpoint de Sign In permite que usuários autentiquem-se na aplicação FitFlavors usando email e senha, recebendo tokens JWT para acesso aos recursos protegidos.

## 🏗️ Container (Nível 2)

```mermaid
graph TB
    Client[Cliente]
    APIGateway[API Gateway]
    SignInLambda[Sign In Lambda]
    Database[(PostgreSQL)]

    Client -->|"POST /signin {email, password}"| APIGateway
    APIGateway -->|Invoke| SignInLambda
    SignInLambda -->|Validate Credentials| Database
    SignInLambda -->|Return JWT| APIGateway
    APIGateway -->|"200 OK {accessToken, refreshToken}"| Client

    classDef client fill:#e1f5fe
    classDef gateway fill:#f3e5f5
    classDef lambda fill:#e8f5e8
    classDef database fill:#fff3e0

    class Client client
    class APIGateway gateway
    class SignInLambda lambda
    class Database database
```

**Componentes:**

- **API Gateway**: Recebe requisições HTTP e roteia para Lambda
- **Sign In Lambda**: Valida credenciais e gera tokens JWT
- **PostgreSQL**: Consulta dados do usuário para validação

## 🔧 Component (Nível 3)

```mermaid
graph TB
    LambdaHandler[Lambda Handler]
    SignInController[Sign In Controller]
    SignInUsecase[Sign In Usecase]
    UserRepository[User Repository]
    JWTProvider[JWT Provider]
    PasswordProvider[Password Provider]
    Database[(PostgreSQL)]

    LambdaHandler -->|Map Event| SignInController
    SignInController -->|Execute| SignInUsecase
    SignInUsecase -->|Find User| UserRepository
    SignInUsecase -->|Verify Password| PasswordProvider
    SignInUsecase -->|Generate Token| JWTProvider
    UserRepository -->|Query| Database

    classDef handler fill:#e1f5fe
    classDef controller fill:#f3e5f5
    classDef usecase fill:#e8f5e8
    classDef provider fill:#fff3e0
    classDef database fill:#ffebee

    class LambdaHandler handler
    class SignInController controller
    class SignInUsecase usecase
    class UserRepository,JWTProvider,PasswordProvider provider
    class Database database
```

**Fluxo de Execução:**

1. **Lambda Handler** mapeia evento API Gateway para HttpRequest
2. **Sign In Controller** recebe requisição com email e senha
3. **Sign In Usecase** executa lógica de autenticação
4. **User Repository** busca usuário por email
5. **Password Provider** verifica senha com hash armazenado
6. **JWT Provider** gera tokens de acesso e refresh

## 💻 Code (Nível 4)

### **Estrutura de Arquivos**

```
src/
├── infra/functions/signin.ts           # Lambda Handler
├── domain/users/controllers/
│   └── sign-in.controller.ts           # Controller
├── domain/users/usecases/
│   └── sign-in.usecase.ts              # Use Case
├── domain/users/repositories/
│   └── user.repository.ts              # Repository Interface
├── infra/db/drizzle/repositories/
│   └── drizzle-user.repository.ts      # Repository Implementation
├── infra/providers/
│   ├── jwt.provider.ts                 # JWT Provider
│   └── password.provider.ts            # Password Provider
└── domain/users/errors/
    └── invalid-credentials.error.ts    # Error Handling
```

### **Fluxo de Dados**

```mermaid
sequenceDiagram
    participant C as Cliente
    participant AG as API Gateway
    participant LH as Lambda Handler
    participant SC as SignIn Controller
    participant SIU as SignIn Usecase
    participant UR as User Repository
    participant PP as Password Provider
    participant JP as JWT Provider
    participant DB as Database

    C->>AG: POST /signin {email, password}
    AG->>LH: Invoke Lambda
    LH->>SC: Map to HttpRequest
    SC->>SIU: Execute usecase
    SIU->>UR: Find user by email
    UR->>DB: SELECT user by email
    DB-->>UR: User data
    UR-->>SIU: User found/not found

    alt User not found
        SIU-->>SC: InvalidCredentialsError
        SC-->>LH: 401 Unauthorized
        LH-->>AG: Lambda Response
        AG-->>C: 401 Unauthorized
    else User found
        SIU->>PP: Verify password
        PP-->>SIU: Password valid/invalid

        alt Password invalid
            SIU-->>SC: InvalidCredentialsError
            SC-->>LH: 401 Unauthorized
            LH-->>AG: Lambda Response
            AG-->>C: 401 Unauthorized
        else Password valid
            SIU->>JP: Generate JWT tokens
            JP-->>SIU: Access & Refresh tokens
            SIU-->>SC: Result with tokens
            SC-->>LH: HTTP Response
            LH-->>AG: Lambda Response
            AG-->>C: 200 OK + Tokens
        end
    end
```

### **Validações**

```typescript
const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
```

### **Resposta de Sucesso**

```typescript
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **Resposta de Erro**

```typescript
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

### **Tratamento de Erros**

- **400 Bad Request**: Dados de validação inválidos
- **401 Unauthorized**: Credenciais inválidas
- **500 Internal Server Error**: Erro interno do servidor

## 📊 Métricas e Monitoramento

### **Métricas de Sucesso**

- Taxa de login bem-sucedido
- Tempo de resposta do endpoint
- Uso de memória da Lambda

### **Métricas de Erro**

- Taxa de credenciais inválidas
- Tentativas de login falhadas
- Erros de banco de dados

### **Métricas de Segurança**

- Tentativas de login por IP
- Taxa de ataques de força bruta
- Logs de credenciais inválidas

### **Logs Importantes**

- Tentativas de login (sucesso/falha)
- Erros de validação
- Falhas na verificação de senha
- Problemas de conectividade com banco

## 🔒 Considerações de Segurança

- **Validação de credenciais** rigorosa
- **Verificação segura** de senhas com bcrypt
- **Geração segura** de tokens JWT
- **Rate limiting** para prevenir ataques de força bruta
- **Logs de auditoria** para tentativas de login
- **Não exposição** de informações sensíveis em erros

## 🚀 Melhorias Futuras

1. **Rate limiting** por IP e usuário
2. **Detecção de ataques** de força bruta
3. **Notificações** de login suspeito
4. **MFA** (Multi-Factor Authentication)
5. **Sessões** com controle de dispositivos
6. **Logs de segurança** mais detalhados
7. **Blacklist** de IPs suspeitos

## 📚 Referências

- **[ERD - Entity Relationship Diagram](../project/erd.md)** - Diagrama de entidades e relacionamentos
- **[Arquitetura Geral](../project-architecture.md)** - Visão geral da arquitetura
- **[ADR-002: Autenticação](../adrs/adr-002-authentication-validation.md)** - Estratégia de autenticação
- **Entidade User**: `src/domain/users/entities/user.ts`
- **Sign In Usecase**: `src/domain/users/usecases/sign-in.usecase.ts`
- **JWT Provider**: `src/infra/providers/jwt.provider.ts`
