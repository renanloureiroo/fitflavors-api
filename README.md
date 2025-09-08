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

> **🎯 Ponto de entrada**: Toda documentação está organizada em [docs/](docs/) com navegação intuitiva

### 🚀 **Começar Aqui**

| Para...                 | Comece por                                                   | Descrição                          |
| ----------------------- | ------------------------------------------------------------ | ---------------------------------- |
| **Desenvolvedores**     | [docs/README.md](docs/README.md)                             | Guia completo de desenvolvimento   |
| **Arquitetos**          | [docs/project-architecture.md](docs/project-architecture.md) | Visão arquitetural do sistema      |
| **Novos Colaboradores** | [docs/project/README.md](docs/project/README.md)             | Documentação específica do projeto |

### 🏗️ **Arquitetura & Estrutura**

- **[Visão Geral](docs/project-architecture.md)** - Arquitetura serverless, tecnologias e fluxos
- **[Estrutura do Código](docs/folder-architecture.md)** - Organização de pastas e responsabilidades
- **[Decisões Arquiteturais](docs/adrs/)** - ADRs documentando escolhas técnicas

### 📊 **Dados & Entidades**

- **[ERD - Diagrama de Entidades](docs/project/erd.md)** - Estrutura do banco de dados e relacionamentos

### 🔌 **Endpoints da API**

- **[Sign Up](docs/endpoints/signup-c4.md)** - Criação de conta de usuário
- **[Sign In](docs/endpoints/signin-c4.md)** - Autenticação de usuário
- **[Profile](docs/endpoints/profile-c4.md)** - Perfil do usuário (protegido)
- **[Create Meal](docs/endpoints/create-meal-c4.md)** - Criação de refeição (protegido)
- **[List Meals](docs/endpoints/list-meals-c4.md)** - Listagem de refeições (protegido)

### 📝 **Templates & Padrões**

- **[Templates](docs/templates/)** - Modelos para ADRs, endpoints e PRs

## 🔌 API Endpoints

| Método | Endpoint  | Descrição                   | Auth |
| ------ | --------- | --------------------------- | ---- |
| `POST` | `/signup` | Criação de conta de usuário | ❌   |
| `POST` | `/signin` | Autenticação de usuário     | ❌   |
| `GET`  | `/me`     | Perfil do usuário           | ✅   |
| `POST` | `/meals`  | Criação de refeição         | ✅   |
| `GET`  | `/meals`  | Listagem de refeições       | ✅   |

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
