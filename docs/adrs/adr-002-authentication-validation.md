# ADR-002: Validação de Autenticação em Rotas Autenticadas

**Data:** 2025-09-08  
**Status:** Aceita  
**Decisor(es):** Equipe de Desenvolvimento  
**Consultado(s):** Arquitetos de Software, DevOps  
**Impactado(s):** Desenvolvedores, Equipe de Segurança

## Resumo

Decidimos implementar a validação de autenticação exclusivamente no nível do API Gateway usando Lambda Authorizer. Esta abordagem centraliza a validação de tokens JWT no gateway, garantindo performance otimizada e segurança robusta sem duplicação de código na aplicação.

## Contexto

A aplicação FitFlavors API é uma API serverless construída com AWS Lambda e API Gateway. Precisamos proteger rotas sensíveis que requerem autenticação de usuários, como:

- `/profile` - Perfil do usuário
- `/meals` - Refeições do usuário
- `/goals` - Metas do usuário
- `/workouts` - Treinos do usuário

### Requisitos Identificados

1. **Segurança**: Validação robusta de tokens JWT
2. **Performance**: Validação eficiente sem impactar latência
3. **Flexibilidade**: Diferentes níveis de proteção para diferentes endpoints
4. **Manutenibilidade**: Código limpo e reutilizável
5. **Observabilidade**: Logs e monitoramento de tentativas de acesso

### Restrições Técnicas

- Ambiente serverless (AWS Lambda)
- Uso de JWT para autenticação
- Necessidade de contexto do usuário nas funções Lambda
- Limitações de cold start em funções Lambda

## Decisão

Implementamos a validação de autenticação exclusivamente no nível do API Gateway com as seguintes características:

### 1. **Lambda Authorizer**

- **Arquivo**: `src/infra/functions/authorizer.ts`
- Validação de token JWT antes da execução da função principal
- Retorna política de autorização com contexto do usuário
- Bloqueia requisições inválidas no nível do gateway
- Passa contexto do usuário para a função Lambda principal

### 2. **Configuração no serverless.yml**

- Configuração declarativa de autorização por endpoint
- Reutilização do authorizer em múltiplas funções
- Controle granular de acesso por rota

### 3. **Contexto do Usuário**

- Informações do usuário disponíveis via `request.context`
- Dados extraídos do token JWT pelo authorizer
- Acesso direto a `userId`, `email` e outros dados do usuário

## Alternativas Consideradas

### Alternativa 1: Validação Apenas no API Gateway (Escolhida)

**Prós:**

- Performance máxima (validação única)
- Menor custo de execução Lambda
- Centralização da lógica de autenticação
- Configuração declarativa no serverless.yml
- Cache de políticas de autorização
- Bloqueio precoce de requisições inválidas

**Contras:**

- Dependência total do API Gateway
- Menos flexibilidade para validações customizadas complexas

### Alternativa 2: Validação Apenas na Aplicação

**Prós:**

- Controle total sobre a validação
- Flexibilidade máxima para lógica customizada
- Fácil implementação de diferentes níveis de acesso

**Contras:**

- Maior latência (execução da Lambda mesmo com token inválido)
- Maior custo (execução desnecessária de Lambdas)
- Duplicação de código de validação
- Menos eficiência para requisições inválidas

### Alternativa 3: Validação Dupla (Híbrida)

**Prós:**

- Segurança em múltiplas camadas
- Flexibilidade para validações customizadas
- Redundância de segurança

**Contras:**

- Complexidade adicional desnecessária
- Duplicação de código
- Maior superfície de manutenção
- Overhead de validação dupla

## Consequências

### Positivas

- **Performance Máxima**: Validação única no gateway, sem overhead na aplicação
- **Custo Otimizado**: Lambdas não executam para requisições inválidas
- **Simplicidade**: Arquitetura limpa e fácil de manter
- **Configuração Declarativa**: Controle via serverless.yml
- **Cache de Autorização**: API Gateway cacheia políticas de autorização
- **Observabilidade**: Logs centralizados no API Gateway
- **Escalabilidade**: Authorizer reutilizável para múltiplas funções

### Negativas

- **Dependência do API Gateway**: Menos controle sobre o fluxo de validação
- **Flexibilidade Limitada**: Dificuldade para validações customizadas complexas

### Riscos

- **Dependência de Serviço**: Risco de falha do API Gateway afetar toda autenticação
- **Limitações do Authorizer**: Restrições de timeout e recursos do Lambda Authorizer

## Implementação

### Estrutura de Arquivos

```
src/
├── infra/
│   ├── functions/
│   │   └── authorizer.ts               # Lambda Authorizer
│   └── providers/
│       └── jwt.provider.ts             # Validação JWT
└── domain/
    └── users/
        └── controllers/
            └── profile.controller.ts   # Controller que usa context
```

### Configuração no serverless.yml

```yaml
functions:
  authorizer:
    handler: src/infra/functions/authorizer.handler
    description: JWT Token Authorizer

  profile:
    handler: src/infra/functions/profile.handler
    events:
      - httpApi:
          path: /profile
          method: get
          authorizer:
            name: authorizer
            type: token
```

### Uso em Controllers

```typescript
export class ProfileController {
  static async handle(request: HttpRequest) {
    const { context } = request;
    // context.userId e context.email disponíveis
    // Validação já foi feita pelo API Gateway
  }
}
```

## Monitoramento

### Métricas a Acompanhar

1. **Taxa de Sucesso da Autenticação**
   - Requisições autorizadas vs negadas no API Gateway
   - Taxa de sucesso do Lambda Authorizer

2. **Performance**
   - Latência do Lambda Authorizer
   - Latência das funções Lambda principais
   - Tempo de cold start do authorizer
   - Cache hit rate das políticas de autorização

3. **Erros**
   - Tokens inválidos/expirados
   - Falhas na validação JWT
   - Erros de configuração do authorizer
   - Timeouts do authorizer

### Logs Implementados

- Logs de tentativas de acesso no authorizer
- Logs de erro com contexto do usuário
- Métricas de CloudWatch para monitoramento
- Logs de cache de autorização do API Gateway

## Referências

- [AWS API Gateway Request Authorizers](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-input.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Serverless Security Best Practices](https://serverless.com/framework/docs/providers/aws/guide/security/)
- [ADR-001: Serverless Architecture](./adr-001-serverless-architecture.md)

---

**Nota:** Esta decisão deve ser revisada periodicamente conforme a evolução da aplicação e novos requisitos de segurança.
