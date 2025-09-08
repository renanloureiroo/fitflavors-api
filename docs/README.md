# 📚 Documentação - FitFlavors API

> **Hub Central da Documentação** - Navegação otimizada para desenvolvedores, arquitetos e stakeholders

## 🎯 **Navegação Rápida**

### **👨‍💻 Para Desenvolvedores**

1. **[Arquitetura Geral](./project-architecture.md)** - Entenda o sistema
2. **[Estrutura do Código](./folder-architecture.md)** - Organização de pastas
3. **[ERD - Banco de Dados](./project/erd.md)** - Entidades e relacionamentos
4. **[Endpoints](./endpoints/)** - Documentação das APIs

### **🏗️ Para Arquitetos**

1. **[Decisões Arquiteturais](./adrs/)** - ADRs e justificativas
2. **[Arquitetura Geral](./project-architecture.md)** - Visão técnica completa
3. **[Estrutura do Código](./folder-architecture.md)** - Padrões de organização

### **📊 Para Product Managers**

1. **[Endpoints](./endpoints/)** - Funcionalidades disponíveis
2. **[ERD - Banco de Dados](./project/erd.md)** - Estrutura de dados
3. **[Arquitetura Geral](./project-architecture.md)** - Capacidades técnicas

## 📁 **Estrutura da Documentação**

### **🏗️ Arquitetura**

- **[Visão Geral](./project-architecture.md)** - Arquitetura serverless, tecnologias e fluxos
- **[Estrutura do Código](./folder-architecture.md)** - Organização de pastas e responsabilidades
- **[Decisões Arquiteturais](./adrs/)** - ADRs documentando escolhas técnicas

### **📊 Dados & Entidades**

- **[ERD - Diagrama de Entidades](./project/erd.md)** - Estrutura do banco de dados e relacionamentos

### **🔌 Endpoints da API**

- **[Sign Up](./endpoints/signup-c4.md)** - Criação de conta de usuário
- **[Sign In](./endpoints/signin-c4.md)** - Autenticação de usuário
- **[Profile](./endpoints/profile-c4.md)** - Perfil do usuário (protegido)
- **[Create Meal](./endpoints/create-meal-c4.md)** - Criação de refeição (protegido)
- **[List Meals](./endpoints/list-meals-c4.md)** - Listagem de refeições (protegido)

### **📝 Templates & Padrões**

- **[Templates](./templates/)** - Modelos para ADRs, endpoints e PRs

## 🔗 **Referências Rápidas**

| Tópico             | Arquivo                                              | Descrição                               |
| ------------------ | ---------------------------------------------------- | --------------------------------------- |
| **🏗️ Arquitetura** | [project-architecture.md](./project-architecture.md) | Visão geral da arquitetura serverless   |
| **📁 Estrutura**   | [folder-architecture.md](./folder-architecture.md)   | Organização do código                   |
| **📊 Dados**       | [erd.md](./project/erd.md)                           | Diagrama de entidades e relacionamentos |
| **🔌 APIs**        | [endpoints/](./endpoints/)                           | Documentação dos endpoints              |
| **📋 Decisões**    | [adrs/](./adrs/)                                     | Decisões arquiteturais (ADRs)           |
| **📝 Templates**   | [templates/](./templates/)                           | Modelos e padrões                       |

## 🚀 **Tecnologias**

- **Runtime**: Node.js 22.x (ARM64)
- **Framework**: Serverless Framework
- **Cloud**: AWS (Lambda + API Gateway)
- **Database**: Neon (PostgreSQL)
- **ORM**: Drizzle ORM
- **Auth**: JWT + Lambda Authorizer
- **Language**: TypeScript

---

**📞 Suporte**: [Issues](https://github.com/seu-usuario/fitflavors-api/issues) | **📅 Atualizado**: 2024-12-19
