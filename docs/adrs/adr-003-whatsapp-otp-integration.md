# ADR-003: Integração de OTP via WhatsApp na Arquitetura Serverless Atual

**Data:** 17 de setembro de 2025  
**Status:** Aceita  
**Decisor(es):** Equipe de Desenvolvimento FitFlavors  
**Consultado(s):** Arquiteto de Software, DevOps  
**Impactado(s):** Desenvolvedores Frontend/Backend, Usuários Finais

## Resumo

Decidiu-se implementar o sistema de OTP (One-Time Password) para validação de números de WhatsApp integrando diretamente à arquitetura serverless atual, utilizando a API oficial do WhatsApp Business, em vez de criar um projeto separado ou migrar para uma arquitetura tradicional com servidor.

## Contexto

O FitFlavors API necessita de um sistema de verificação por OTP via WhatsApp para:

1. **Validar números de telefone** dos usuários durante o cadastro
2. **Aumentar a segurança** do processo de autenticação
3. **Melhorar a experiência do usuário** com verificação via WhatsApp
4. **Atender requisitos de negócio** para comunicação direta com usuários

A aplicação atual utiliza:
- Arquitetura serverless com AWS Lambda
- Clean Architecture e Domain-Driven Design (DDD)
- Node.js 22.x com TypeScript
- Drizzle ORM com PostgreSQL (Neon)
- JWT para autenticação

## Decisão

**Implementar o sistema de OTP integrando à arquitetura serverless atual**, criando funcionalidades de OTP como **subdomínio de `users`** dentro da estrutura existente, mantendo os padrões arquiteturais estabelecidos e aproveitando a infraestrutura já configurada.

## Alternativas Consideradas

### Alternativa 1: Projeto Serverless Separado

**Prós:**
- Isolamento completo da funcionalidade
- Deploy independente
- Possibilidade de diferentes tecnologias

**Contras:**
- Duplicação de infraestrutura (DB, auth, monitoramento)
- Complexidade de integração API-to-API
- Overhead de manutenção de múltiplos projetos
- Inconsistência arquitetural
- Custos adicionais de infraestrutura

### Alternativa 2: Migração para API Tradicional com Servidor

**Prós:**
- Controle total sobre o ambiente de execução
- Facilidade para implementações complexas de longo prazo
- Melhor para casos de uso com estado persistente

**Contras:**
- Perda dos benefícios serverless (escalabilidade automática, custo por uso)
- Necessidade de gerenciar infraestrutura de servidor
- Migração complexa da arquitetura existente
- Custos operacionais mais altos
- Quebra da consistência arquitetural atual

### Alternativa 3: Integração na Arquitetura Atual (Escolhida)

**Prós:**
- Mantém consistência arquitetural (Clean Architecture + DDD)
- Reutiliza infraestrutura existente (DB, JWT, monitoramento)
- Escalabilidade automática do AWS Lambda
- Custo otimizado (paga apenas pelo uso)
- Manutenção unificada
- Deploy e CI/CD já configurados

**Contras:**
- Limite de tempo de execução do Lambda (15 min - não impacta OTP)
- Dependência da infraestrutura AWS
- Cold start potencial (mitigado com Provisioned Concurrency se necessário)

## Consequências

### Positivas

- **Consistência Arquitetural**: Mantém padrões de Clean Architecture e DDD
- **Reutilização de Infraestrutura**: Aproveita DB, JWT, providers e gateways existentes
- **Escalabilidade Automática**: Lambda escala conforme demanda de OTPs
- **Custo Otimizado**: Serverless com pagamento por uso
- **Manutenção Simplificada**: Um único projeto e stack tecnológico
- **Time-to-Market Reduzido**: Aproveita estrutura e padrões já estabelecidos

### Negativas

- **Dependência de Cold Start**: Possível latência inicial em períodos de baixo uso
- **Limitações do Lambda**: Restrições de memória e tempo de execução
- **Acoplamento**: OTP fica acoplado à aplicação principal

### Riscos

- **Rate Limiting da API WhatsApp**: Necessário implementar controle de frequência
- **Falhas de Entrega**: WhatsApp pode falhar na entrega de mensagens
- **Custos de WhatsApp API**: Cobrança por mensagem enviada
- **Aprovação de Templates**: Dependência de aprovação do WhatsApp para templates de mensagem

## Implementação

### Estrutura de Código

```
src/domain/users/
├── controllers/          # Existing + request-otp, verify-otp
├── usecases/            # Existing + Request/Verify OTP business logic
├── entities/            # Existing + OTP Verification entity
├── repositories/        # Existing + OTP persistence contracts
├── providers/           # Existing + WhatsApp provider
├── errors/             # Existing + OTP-specific errors
└── dtos/               # Existing + Request/Response DTOs

src/infra/
├── functions/          # Lambda handlers
├── providers/          # WhatsApp implementation
└── db/drizzle/        # OTP repository implementation
```

### Alterações no Schema

```sql
-- Nova tabela para verificações OTP
CREATE TABLE otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL
);

-- Adição de campos na tabela users
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) UNIQUE;
ALTER TABLE users ADD COLUMN phone_verified BOOLEAN NOT NULL DEFAULT false;
```

### Endpoints

- `POST /request-otp` - Solicita código OTP via WhatsApp
- `POST /verify-otp` - Valida código OTP recebido

### Integrações

- **WhatsApp Business API**: Para envio de mensagens OTP
- **Drizzle ORM**: Para persistência de verificações
- **JWT Provider**: Para geração de tokens pós-verificação

## Monitoramento

### Métricas de Sucesso

- **Taxa de Entrega**: % de OTPs entregues com sucesso
- **Taxa de Verificação**: % de OTPs verificados corretamente
- **Tempo de Resposta**: Latência dos endpoints de OTP
- **Rate de Falhas**: Errors na integração com WhatsApp API

### Alertas

- Falhas consecutivas na API do WhatsApp
- Taxa de verificação abaixo de 85%
- Latência acima de 5 segundos
- Rate limiting atingido

### Logs

- Tentativas de envio de OTP
- Códigos gerados e verificações
- Erros de integração com WhatsApp
- Tentativas de verificação incorretas

## Referências

- [WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [ADR-001: Arquitetura Serverless](./adr-001-serverless-architecture.md)
- [ADR-002: Validação de Autenticação](./adr-002-authentication-validation.md)

---

**Nota:** Esta decisão alinha-se com os princípios arquiteturais já estabelecidos no projeto, mantendo a consistência e aproveitando os investimentos em infraestrutura serverless já realizados.