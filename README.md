<!--
title: 'AWS Simple HTTP Endpoint example in NodeJS'
description: 'This template demonstrates how to make a simple HTTP API with Node.js running on AWS Lambda and API Gateway using the Serverless Framework.'
layout: Doc
framework: v4
platform: AWS
language: nodeJS
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, Inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->

# FitFlavors API

API para o sistema FitFlavors construída com Node.js, TypeScript e Serverless Framework.

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação
- **Serverless Framework** - Framework para deploy em AWS Lambda
- **ESLint** - Linter para análise de código
- **Prettier** - Formatador de código
- **Zod** - Validação de schemas

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia o servidor local com hot reload

# Qualidade de código
npm run lint             # Executa o ESLint
npm run lint:fix         # Executa o ESLint e corrige problemas automaticamente
npm run format           # Formata o código com Prettier
npm run format:check     # Verifica se o código está formatado
npm run type-check       # Verifica tipos TypeScript
npm run check            # Executa todas as verificações (type-check + lint + format:check)
```

## 🚀 Deploy

Para fazer deploy da aplicação:

```bash
serverless deploy
```

## Usage

### Deployment

In order to deploy the example, you need to run the following command:

```
serverless deploy
```

After running deploy, you should see output similar to:

```
Deploying "serverless-http-api" to stage "dev" (us-east-1)

✔ Service deployed to stack serverless-http-api-dev (91s)

endpoint: GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/
functions:
  hello: serverless-http-api-dev-hello (1.6 kB)
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [HTTP API (API Gateway V2) event docs](https://www.serverless.com/framework/docs/providers/aws/events/http-api).

### Invocation

After successful deployment, you can call the created application via HTTP:

```
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/
```

Which should result in response similar to:

```json
{ "message": "Go Serverless v4! Your function executed successfully!" }
```

### Local development

The easiest way to develop and test your function is to use the `dev` command:

```
serverless dev
```

This will start a local emulator of AWS Lambda and tunnel your requests to and from AWS Lambda, allowing you to interact with your function as if it were running in the cloud.

Now you can invoke the function as before, but this time the function will be executed locally. Now you can develop your function locally, invoke it, and see the results immediately without having to re-deploy.

When you are done developing, don't forget to run `serverless deploy` to deploy the function to the cloud.
