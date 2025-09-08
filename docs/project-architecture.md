# Arquitetura do Projeto - FitFlavors API

## 🏗️ Visão Geral

O FitFlavors API é uma aplicação serverless construída com **AWS Lambda** e **API Gateway**, seguindo os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**. A aplicação é desenvolvida em **TypeScript** e utiliza **Drizzle ORM** para persistência de dados.

### 🎯 **Propósito**

API para aplicação de controle nutricional e fitness, permitindo que usuários:

- Criem e gerenciem suas contas
- Façam login de forma segura
- Acessem seus perfis e dados pessoais
- Calculem metas nutricionais baseadas em objetivos

### 🏛️ **Arquitetura Geral**

- **Padrão**: Clean Architecture + DDD
- **Deployment**: Serverless (AWS Lambda + API Gateway)
- **Banco de Dados**: PostgreSQL (Neon)
- **Autenticação**: JWT com Lambda Authorizer
- **ORM**: Drizzle ORM
- **Runtime**: Node.js 22.x (ARM64)

### 📊 **Endpoints Disponíveis**

- `POST /signup` - Criação de conta de usuário
- `POST /signin` - Autenticação de usuário
- `GET /me` - Perfil do usuário (protegido)

### 🔐 **Segurança**

- Validação de JWT no API Gateway
- Criptografia de senhas com bcrypt
- Isolamento de funções Lambda
- Políticas de autorização granulares

## 🎯 Tecnologias Principais

- **Runtime**: Node.js 22.x (ARM64)
- **Framework**: Serverless Framework
- **Cloud Provider**: AWS
- **Database**: Neon (PostgreSQL)
- **ORM**: Drizzle ORM
- **Authentication**: JWT + Lambda Authorizer
- **Language**: TypeScript

## 📊 Diagrama de Arquitetura

```mermaid
graph TB
    %% Cliente
    Client[👤 Cliente Web/Mobile]

    %% API Gateway
    APIGateway[🌐 API Gateway]

    %% Lambda Authorizer
    Authorizer[🔐 Lambda Authorizer<br/>JWT Validation]

    %% Lambda Functions
    SignIn[📝 Sign In Lambda]
    SignUp[📝 Sign Up Lambda]
    Profile[👤 Profile Lambda]

    %% Database
    Database[(🗄️ Neon PostgreSQL<br/>Drizzle ORM)]

    %% Fluxo de autenticação
    Client -->|1. Request + JWT| APIGateway
    APIGateway -->|2. Validate Token| Authorizer
    Authorizer -->|3. Policy + Context| APIGateway

    %% Rotas públicas
    APIGateway -->|4a. POST /signin| SignIn
    APIGateway -->|4b. POST /signup| SignUp

    %% Rotas protegidas
    APIGateway -->|4c. GET /me<br/>(Authorized)| Profile

    %% Acesso ao banco
    SignIn -->|Query| Database
    SignUp -->|Insert| Database
    Profile -->|Query| Database

    %% Respostas
    SignIn -->|5a. JWT Tokens| APIGateway
    SignUp -->|5b. JWT Tokens| APIGateway
    Profile -->|5c. User Data| APIGateway
    APIGateway -->|6. Response| Client

    %% Estilos
    classDef client fill:#e1f5fe
    classDef gateway fill:#f3e5f5
    classDef lambda fill:#e8f5e8
    classDef database fill:#fff3e0
    classDef authorizer fill:#ffebee

    class Client client
    class APIGateway gateway
    class SignIn,SignUp,Profile lambda
    class Database database
    class Authorizer authorizer
```

## 🔄 Fluxo de Requisições

### **1. Rotas Públicas (Sign In/Sign Up)**

```mermaid
sequenceDiagram
    participant C as Cliente
    participant AG as API Gateway
    participant L as Lambda Function
    participant DB as Database

    C->>AG: POST /signin {email, password}
    AG->>L: Invoke Lambda
    L->>DB: Query user data
    DB-->>L: User data
    L->>L: Validate credentials
    L->>L: Generate JWT tokens
    L-->>AG: {accessToken, refreshToken}
    AG-->>C: 200 OK + Tokens
```

### **2. Rotas Protegidas (Profile)**

```mermaid
sequenceDiagram
    participant C as Cliente
    participant AG as API Gateway
    participant A as Authorizer
    participant L as Lambda Function
    participant DB as Database

    C->>AG: GET /me + Authorization header
    AG->>A: Validate JWT token
    A->>A: Verify token signature
    A->>A: Check expiration
    A-->>AG: Policy + User context
    AG->>L: Invoke Lambda with context
    L->>DB: Query user profile
    DB-->>L: User profile data
    L-->>AG: User profile
    AG-->>C: 200 OK + Profile data
```

## 🏛️ Arquitetura de Camadas

```mermaid
graph TB
    %% Camadas
    subgraph "🌐 Presentation Layer"
        Controllers[Controllers]
        DTOs[DTOs]
        Presenters[Presenters]
    end

    subgraph "🎯 Domain Layer"
        Entities[Entities]
        UseCases[Use Cases]
        Services[Domain Services]
        Repositories[Repository Interfaces]
        Errors[Domain Errors]
    end

    subgraph "🔧 Infrastructure Layer"
        LambdaFunctions[Lambda Functions]
        Database[Database Implementation]
        Providers[External Providers]
        Mappers[Data Mappers]
    end

    subgraph "⚙️ Core Layer"
        BaseEntity[Base Entity]
        Validation[Validation]
        HTTP[HTTP Types]
        Utils[Utilities]
    end

    %% Dependências
    Controllers --> UseCases
    Controllers --> DTOs
    UseCases --> Entities
    UseCases --> Services
    UseCases --> Repositories
    UseCases --> Errors

    LambdaFunctions --> Controllers
    Database --> Repositories
    Providers --> UseCases
    Mappers --> Database

    Entities --> BaseEntity
    Controllers --> HTTP
    UseCases --> Validation

    %% Estilos
    classDef presentation fill:#e3f2fd
    classDef domain fill:#f1f8e9
    classDef infrastructure fill:#fff3e0
    classDef core fill:#fce4ec

    class Controllers,DTOs,Presenters presentation
    class Entities,UseCases,Services,Repositories,Errors domain
    class LambdaFunctions,Database,Providers,Mappers infrastructure
    class BaseEntity,Validation,HTTP,Utils core
```

## 🔐 Sistema de Autenticação

```mermaid
graph LR
    %% Fluxo de autenticação
    subgraph "🔑 Authentication Flow"
        Login[User Login]
        JWT[Generate JWT]
        Token[Access Token]
        Refresh[Refresh Token]
    end

    subgraph "🛡️ Authorization Flow"
        Request[API Request]
        Authorizer[Lambda Authorizer]
        Validate[Validate JWT]
        Policy[Return Policy]
        Context[User Context]
    end

    Login --> JWT
    JWT --> Token
    JWT --> Refresh

    Request --> Authorizer
    Authorizer --> Validate
    Validate --> Policy
    Policy --> Context

    %% Estilos
    classDef auth fill:#e8f5e8
    classDef authz fill:#ffebee

    class Login,JWT,Token,Refresh auth
    class Request,Authorizer,Validate,Policy,Context authz
```

## 📊 Estrutura de Dados

### **Entidade User**

```mermaid
erDiagram
    USER {
        string id PK
        string name
        string email UK
        string password_hash
        string gender
        string goal
        date birth_date
        number height
        number weight
        number activity_level
        datetime created_at
        datetime updated_at
    }

    USER ||--o{ MEAL : has
    USER ||--o{ WORKOUT : has
    USER ||--o{ GOAL : has
```

## 🚀 Deploy e Infraestrutura

```mermaid
graph TB
    %% Ambiente de desenvolvimento
    subgraph "💻 Development"
        Local[Local Development]
        ServerlessOffline[Serverless Offline]
    end

    %% Ambiente de produção
    subgraph "☁️ Production"
        APIGatewayProd[API Gateway]
        LambdaProd[Lambda Functions]
        DatabaseProd[Neon Database]
        CloudWatch[CloudWatch Logs]
    end

    %% Deploy
    Local -->|serverless deploy| APIGatewayProd
    ServerlessOffline -->|Testing| Local

    APIGatewayProd --> LambdaProd
    LambdaProd --> DatabaseProd
    LambdaProd --> CloudWatch

    %% Estilos
    classDef dev fill:#e8f5e8
    classDef prod fill:#e3f2fd

    class Local,ServerlessOffline dev
    class APIGatewayProd,LambdaProd,DatabaseProd,CloudWatch prod
```

## 📈 Monitoramento e Observabilidade

```mermaid
graph TB
    %% Métricas
    subgraph "📊 Metrics"
        APIMetrics[API Gateway Metrics]
        LambdaMetrics[Lambda Metrics]
        DatabaseMetrics[Database Metrics]
    end

    %% Logs
    subgraph "📝 Logs"
        CloudWatchLogs[CloudWatch Logs]
        ErrorLogs[Error Tracking]
        AccessLogs[Access Logs]
    end

    %% Alertas
    subgraph "🚨 Alerts"
        ErrorAlerts[Error Alerts]
        PerformanceAlerts[Performance Alerts]
        SecurityAlerts[Security Alerts]
    end

    APIMetrics --> CloudWatchLogs
    LambdaMetrics --> ErrorLogs
    DatabaseMetrics --> AccessLogs

    CloudWatchLogs --> ErrorAlerts
    ErrorLogs --> PerformanceAlerts
    AccessLogs --> SecurityAlerts

    %% Estilos
    classDef metrics fill:#fff3e0
    classDef logs fill:#e8f5e8
    classDef alerts fill:#ffebee

    class APIMetrics,LambdaMetrics,DatabaseMetrics metrics
    class CloudWatchLogs,ErrorLogs,AccessLogs logs
    class ErrorAlerts,PerformanceAlerts,SecurityAlerts alerts
```

## 🎯 Benefícios da Arquitetura

### **Escalabilidade**

- ✅ Auto-scaling com AWS Lambda
- ✅ Gerenciamento automático de recursos
- ✅ Pay-per-use pricing model

### **Segurança**

- ✅ JWT com validação no API Gateway
- ✅ Isolamento de funções Lambda
- ✅ Criptografia de senhas com bcrypt

### **Manutenibilidade**

- ✅ Clean Architecture
- ✅ Separação clara de responsabilidades
- ✅ Código testável e modular

### **Performance**

- ✅ Validação de token no gateway
- ✅ Cache de políticas de autorização
- ✅ Otimização com ARM64

## 🔧 Configuração de Ambiente

### **Variáveis de Ambiente**

```bash
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
ENCRYPT_SALTS=10
```

### **Scripts Disponíveis**

```bash
npm run dev          # Desenvolvimento local
npm run lint         # Linting
npm run format       # Formatação
npm run type-check   # Verificação de tipos
npm run check        # Verificação completa
```

## 📚 Próximos Passos

1. **Implementar testes automatizados**
2. **Adicionar CI/CD pipeline**
3. **Implementar rate limiting**
4. **Adicionar cache Redis**
5. **Implementar observabilidade avançada**

---

**Nota:** Esta arquitetura foi projetada para ser escalável, segura e fácil de manter, seguindo as melhores práticas de desenvolvimento serverless.
