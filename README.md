# 🍎 FitFlavors API

> API serverless para aplicação de controle nutricional e fitness

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-orange)](https://aws.amazon.com/lambda/)
[![Serverless](https://img.shields.io/badge/Serverless-Framework-red)](https://www.serverless.com/)

## 🎯 Sobre o Projeto

API serverless desenvolvida para aplicações de controle nutricional e fitness. Permite que usuários criem contas, façam login e acessem perfis com metas nutricionais calculadas.

### ✨ Funcionalidades

- 🔐 **Autenticação JWT** com validação no API Gateway
- 👤 **Gestão de usuários** com perfis completos
- 🎯 **Cálculo de metas nutricionais** baseado em objetivos pessoais
- 🔒 **Segurança robusta** com criptografia de senhas

## 🚀 Quick Start

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/fitflavors-api.git
cd fitflavors-api

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute localmente
npm run dev
```

### Variáveis de Ambiente

```bash
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
ENCRYPT_SALTS=10
```

### Scripts

```bash
npm run dev          # Desenvolvimento local
npm run lint         # Linting do código
npm run format       # Formatação do código
npm run type-check   # Verificação de tipos
```

## 📚 Documentação

### 🏗️ Arquitetura

- **[Arquitetura do Projeto](docs/project-architecture.md)** - Visão geral e diagramas
- **[Arquitetura de Pastas](docs/folder-architecture.md)** - Organização do código
- **[ADR-001: Serverless](docs/adrs/adr-001-serverless-architecture.md)** - Decisão arquitetural
- **[ADR-002: Autenticação](docs/adrs/adr-002-authentication-validation.md)** - Validação de JWT

### 🔌 Endpoints (C4 Model)

- **[Sign Up](docs/endpoints/signup-c4.md)** - Criação de conta
- **[Sign In](docs/endpoints/signin-c4.md)** - Autenticação
- **[Profile](docs/endpoints/profile-c4.md)** - Perfil do usuário

### 📋 Templates

- **[Template de Endpoint](docs/endpoints/endpoint-template.md)** - Para novos endpoints
- **[Template de ADR](docs/adr-template.md)** - Para decisões arquiteturais

## 🔌 API Endpoints

| Método | Endpoint  | Descrição                   | Auth |
| ------ | --------- | --------------------------- | ---- |
| `POST` | `/signup` | Criação de conta de usuário | ❌   |
| `POST` | `/signin` | Autenticação de usuário     | ❌   |
| `GET`  | `/me`     | Perfil do usuário           | ✅   |

## 🧪 Testes

```bash
npm test              # Executar testes
npm run test:coverage # Com cobertura
```

## 🚀 Deploy

```bash
npm run deploy        # Deploy para produção
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ pela equipe FitFlavors**
