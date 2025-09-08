# Arquitetura de Pastas - FitFlavors API

## 📁 Visão Geral

O projeto FitFlavors API segue uma arquitetura baseada em **Clean Architecture** e **Domain-Driven Design (DDD)**, organizando o código em camadas bem definidas com responsabilidades específicas.

## 🏗️ Estrutura Principal

```
fitflavors-api/
├── docs/                          # Documentação do projeto
├── src/                          # Código fonte principal
│   ├── core/                     # Camada de infraestrutura compartilhada
│   ├── domain/                   # Camada de domínio (regras de negócio)
│   └── infra/                    # Camada de infraestrutura
├── serverless.yml               # Configuração do Serverless Framework
├── package.json                 # Dependências e scripts
├── tsconfig.json               # Configuração do TypeScript
└── drizzle.config.ts           # Configuração do Drizzle ORM
```

## 🎯 Camadas da Arquitetura

### 1. **Core** - Infraestrutura Compartilhada

```
src/core/
├── app-error.ts                 # Classe base para erros da aplicação
├── entitiy.ts                   # Classe base para entidades
├── optional.ts                  # Utilitário para valores opcionais
├── unique-entity-id.ts          # Geração de IDs únicos
├── validation.ts                # Validações compartilhadas
├── decorators/
│   └── valid.decorator.ts       # Decorator para validação de dados
├── http/
│   ├── http-handler.ts          # Utilitários para respostas HTTP
│   └── types/
│       ├── error.ts             # Tipos de erro HTTP
│       └── http.ts              # Tipos de requisição/resposta HTTP
└── utils/
    ├── handler-app-error.ts     # Handler centralizado de erros
    └── validation-formatter.ts  # Formatador de erros de validação
```

**Responsabilidades:**

- Utilitários compartilhados entre camadas
- Classes base e abstrações comuns
- Tipos e interfaces fundamentais
- Validações genéricas

### 2. **Domain** - Regras de Negócio

```
src/domain/
└── users/                       # Agregado de usuários
    ├── controllers/             # Controladores de entrada
    │   ├── profile.controller.ts
    │   ├── sign-in.controller.ts
    │   └── sign-up.controller.ts
    ├── dtos/                    # Data Transfer Objects
    │   ├── create-account-response.dto.ts
    │   ├── create-account.dto.ts
    │   ├── fetch-profile-response.dto.ts
    │   ├── fetch-profile.dto.ts
    │   └── login-response.dto.ts
    ├── entities/                # Entidades de domínio
    │   └── user.ts
    ├── errors/                  # Erros específicos do domínio
    │   ├── invalid-credentials.error.ts
    │   ├── invalid-token.error.ts
    │   └── user-already-exists.error.ts
    ├── presenters/              # Apresentação de dados
    │   └── user.presenter.ts
    ├── providers/               # Interfaces de provedores
    │   ├── crypt.provider.ts
    │   └── jwt.provider.ts
    ├── repositories/            # Interfaces de repositórios
    │   └── user.repository.ts
    ├── services/                # Serviços de domínio
    │   └── calculate-goal.ts
    └── usecases/                # Casos de uso
        ├── create-account.usecase.ts
        ├── fetch-profile.usecase.ts
        ├── refresh-token.usecase.ts
        └── sign-in.usecase.ts
```

**Responsabilidades:**

- Regras de negócio puras
- Entidades e agregados
- Casos de uso
- Interfaces de repositórios e provedores
- Erros específicos do domínio

### 3. **Infra** - Infraestrutura e Implementações

```
src/infra/
├── containers/                  # Injeção de dependências (futuro)
├── db/                         # Camada de banco de dados
│   └── drizzle/
│       ├── index.ts            # Configuração do Drizzle
│       ├── schema.ts           # Schema do banco de dados
│       ├── mapper/
│       │   └── drizzle.mapper.ts
│       └── repositories/
│           └── drizzle-user.repository.ts
├── env/                        # Configuração de ambiente
│   └── index.ts
├── functions/                  # Funções Lambda
│   ├── authorizer.ts           # Lambda Authorizer
│   ├── profile.ts              # Endpoint de perfil
│   ├── signin.ts               # Endpoint de login
│   └── signup.ts               # Endpoint de cadastro
├── mappers/                    # Mapeadores de dados
│   └── lambda-event.mapper.ts  # Mapeamento de eventos Lambda
└── providers/                  # Implementações de provedores
    ├── jwt.provider.ts         # Implementação JWT
    └── password.provider.ts    # Implementação de criptografia
```

**Responsabilidades:**

- Implementações concretas das interfaces do domínio
- Configuração de banco de dados
- Funções Lambda
- Mapeamento de dados externos
- Configuração de ambiente

## 📋 Padrões de Organização

### **Por Agregado (Domain)**

Cada agregado (ex: `users`) contém todos os elementos relacionados:

- Controllers, DTOs, Entities, Errors, etc.

### **Por Responsabilidade (Core)**

Elementos compartilhados organizados por função:

- HTTP, Validation, Utils, etc.

### **Por Tecnologia (Infra)**

Implementações organizadas por tecnologia:

- Database, Functions, Providers, etc.

## 🔄 Fluxo de Dependências

```
Infra → Domain ← Core
  ↓       ↑
Functions Controllers
```

- **Core**: Não depende de nenhuma camada
- **Domain**: Pode depender apenas do Core
- **Infra**: Pode depender do Domain e Core

## 📝 Convenções de Nomenclatura

### **Arquivos**

- `kebab-case.ts` para arquivos
- `PascalCase.ts` para classes e interfaces
- `camelCase.ts` para funções e variáveis

### **Pastas**

- `kebab-case/` para pastas
- Nomes descritivos e específicos

### **Sufixos**

- `.controller.ts` - Controladores
- `.usecase.ts` - Casos de uso
- `.entity.ts` - Entidades
- `.dto.ts` - Data Transfer Objects
- `.error.ts` - Erros customizados
- `.provider.ts` - Provedores de serviços
- `.repository.ts` - Repositórios

## 🎯 **Benefícios**

- **Separação de Responsabilidades**: Cada camada tem função específica
- **Testabilidade**: Regras de negócio isoladas e fáceis de testar
- **Escalabilidade**: Fácil adição de novos agregados
- **Manutenibilidade**: Código organizado e previsível

## 📚 **Documentação Relacionada**

- **[Arquitetura Geral](./project-architecture.md)** - Visão geral da arquitetura serverless
- **[ERD - Diagrama de Entidades](./project/erd.md)** - Estrutura do banco de dados
- **[Decisões Arquiteturais](./adrs/)** - ADRs documentando escolhas técnicas
- **[Endpoints da API](./endpoints/)** - Documentação dos endpoints

---

**📅 Atualizado**: 2024-12-19 | **👥 Equipe**: FitFlavors Development
