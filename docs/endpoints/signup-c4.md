# C4 Model - Sign Up Endpoint

## 🎯 Context (Nível 1)

```mermaid
graph TB
    User[Usuário]
    WebApp[Aplicação Web]
    MobileApp[Aplicação Mobile]
    FitFlavorsAPI[FitFlavors API]
    Database[(PostgreSQL)]

    User -->|Cria conta| WebApp
    User -->|Cria conta| MobileApp
    WebApp -->|POST /signup| FitFlavorsAPI
    MobileApp -->|POST /signup| FitFlavorsAPI
    FitFlavorsAPI -->|Salva dados| Database

    classDef user fill:#e1f5fe
    classDef client fill:#f3e5f5
    classDef api fill:#e8f5e8
    classDef database fill:#fff3e0

    class User user
    class WebApp,MobileApp client
    class FitFlavorsAPI api
    class Database database
```

**Descrição:** O endpoint de Sign Up permite que novos usuários criem contas na aplicação FitFlavors, fornecendo informações pessoais e de fitness para cálculo de metas nutricionais.

## 🏗️ Container (Nível 2)

```mermaid
graph TB
    Client[Cliente]
    APIGateway[API Gateway]
    SignUpLambda[Sign Up Lambda]
    Database[(PostgreSQL)]

    Client -->|"POST /signup {account, goal, gender, etc.}"| APIGateway
    APIGateway -->|Invoke| SignUpLambda
    SignUpLambda -->|Create User| Database
    SignUpLambda -->|Generate JWT| APIGateway
    APIGateway -->|"201 Created {accessToken, refreshToken}"| Client

    classDef client fill:#e1f5fe
    classDef gateway fill:#f3e5f5
    classDef lambda fill:#e8f5e8
    classDef database fill:#fff3e0

    class Client client
    class APIGateway gateway
    class SignUpLambda lambda
    class Database database
```

**Componentes:**

- **API Gateway**: Recebe requisições HTTP e roteia para Lambda
- **Sign Up Lambda**: Processa criação de conta e gera tokens JWT
- **PostgreSQL**: Armazena dados do usuário

## 🔧 Component (Nível 3)

```mermaid
graph TB
    LambdaHandler[Lambda Handler]
    SignUpController[Sign Up Controller]
    Validation[Validation Decorator]
    CreateAccountUsecase[Create Account Usecase]
    UserRepository[User Repository]
    JWTProvider[JWT Provider]
    PasswordProvider[Password Provider]
    CalculateGoalService[Calculate Goal Service]
    Database[(PostgreSQL)]

    LambdaHandler -->|Map Event| SignUpController
    SignUpController -->|Validate| Validation
    SignUpController -->|Execute| CreateAccountUsecase
    CreateAccountUsecase -->|Save| UserRepository
    CreateAccountUsecase -->|Generate Token| JWTProvider
    CreateAccountUsecase -->|Hash Password| PasswordProvider
    CreateAccountUsecase -->|Calculate Goals| CalculateGoalService
    UserRepository -->|Query/Insert| Database

    classDef handler fill:#e1f5fe
    classDef controller fill:#f3e5f5
    classDef usecase fill:#e8f5e8
    classDef provider fill:#fff3e0
    classDef database fill:#ffebee

    class LambdaHandler handler
    class SignUpController,Validation controller
    class CreateAccountUsecase usecase
    class UserRepository,JWTProvider,PasswordProvider,CalculateGoalService provider
    class Database database
```

**Fluxo de Execução:**

1. **Lambda Handler** mapeia evento API Gateway para HttpRequest
2. **Sign Up Controller** recebe requisição e aplica validação
3. **Create Account Usecase** executa lógica de negócio
4. **Providers** executam operações específicas (JWT, senha, metas)
5. **User Repository** persiste dados no banco

## 💻 Code (Nível 4)

### **Estrutura de Arquivos**

```
src/
├── infra/functions/signup.ts           # Lambda Handler
├── domain/users/controllers/
│   └── sign-up.controller.ts           # Controller
├── domain/users/usecases/
│   └── create-account.usecase.ts       # Use Case
├── domain/users/repositories/
│   └── user.repository.ts              # Repository Interface
├── infra/db/drizzle/repositories/
│   └── drizzle-user.repository.ts      # Repository Implementation
├── infra/providers/
│   ├── jwt.provider.ts                 # JWT Provider
│   └── password.provider.ts            # Password Provider
└── domain/users/services/
    └── calculate-goal.ts               # Goal Calculation Service
```

### **Fluxo de Dados**

```mermaid
sequenceDiagram
    participant C as Cliente
    participant AG as API Gateway
    participant LH as Lambda Handler
    participant SC as SignUp Controller
    participant V as Validation
    participant CAU as Create Account Usecase
    participant UR as User Repository
    participant JP as JWT Provider
    participant PP as Password Provider
    participant CGS as Calculate Goal Service
    participant DB as Database

    C->>AG: POST /signup {account, goal, gender, etc.}
    AG->>LH: Invoke Lambda
    LH->>SC: Map to HttpRequest
    SC->>V: Validate request data
    V-->>SC: Validation result
    SC->>CAU: Execute usecase
    CAU->>UR: Check if user exists
    UR->>DB: SELECT user by email
    DB-->>UR: User data
    UR-->>CAU: User exists check
    CAU->>PP: Hash password
    PP-->>CAU: Hashed password
    CAU->>CGS: Calculate nutritional goals
    CGS-->>CAU: Goals calculated
    CAU->>UR: Create user
    UR->>DB: INSERT user
    DB-->>UR: User created
    UR-->>CAU: User created
    CAU->>JP: Generate JWT tokens
    JP-->>CAU: Access & Refresh tokens
    CAU-->>SC: Result with tokens
    SC-->>LH: HTTP Response
    LH-->>AG: Lambda Response
    AG-->>C: 201 Created + Tokens
```

### **Validações**

```typescript
const schema = z.object({
  goal: z.enum(['lose', 'maintain', 'gain']),
  gender: z.enum(['male', 'female']),
  birthDate: z.iso.date(),
  height: z.number().positive(),
  weight: z.number().positive(),
  activityLevel: z.number().min(1).max(5),
  account: z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
  }),
});
```

### **Resposta de Sucesso**

```typescript
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **Tratamento de Erros**

- **400 Bad Request**: Dados de validação inválidos
- **409 Conflict**: Email já cadastrado
- **500 Internal Server Error**: Erro interno do servidor

## 📊 Métricas e Monitoramento

### **Métricas de Sucesso**

- Taxa de criação de contas bem-sucedidas
- Tempo de resposta do endpoint
- Uso de memória da Lambda

### **Métricas de Erro**

- Taxa de validação falhada
- Taxa de emails duplicados
- Erros de banco de dados

### **Logs Importantes**

- Tentativas de criação de conta
- Erros de validação
- Falhas na geração de JWT
- Problemas de conectividade com banco

## 🔒 Considerações de Segurança

- **Validação rigorosa** de dados de entrada
- **Criptografia de senhas** com bcrypt
- **Geração segura** de tokens JWT
- **Verificação de duplicatas** de email
- **Rate limiting** no API Gateway
- **Logs de auditoria** para tentativas de criação

## 🚀 Melhorias Futuras

1. **Verificação de email** obrigatória
2. **Validação de força** da senha
3. **Captcha** para prevenir spam
4. **Logs de auditoria** mais detalhados
5. **Métricas de negócio** (conversão, abandono)
