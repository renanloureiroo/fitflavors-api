# ADR-001: Escolha da Arquitetura Serverless

**Data:** 2024-12-19  
**Status:** Aceita  
**Decisor(es):** Equipe de Desenvolvimento  
**Consultado(s):** Arquitetos de Software, DevOps Team  
**Impactado(s):** Toda a equipe de desenvolvimento

## Resumo

Decidimos adotar uma arquitetura serverless para a API do Fit Flavors, utilizando AWS Lambda com Serverless Framework para orquestração e deployment.

## Contexto

O Fit Flavors é uma aplicação de delivery de comida fitness que requer:

- **Escalabilidade automática** para lidar com picos de demanda (horários de refeições)
- **Custo otimizado** para um startup em fase inicial
- **Deploy rápido** e frequente de novas funcionalidades
- **Manutenção reduzida** de infraestrutura
- **Alta disponibilidade** para não perder vendas

O projeto iniciou com uma estrutura simples e precisava de uma arquitetura que permitisse crescimento rápido sem grandes investimentos em infraestrutura.

## Decisão

Adotamos uma arquitetura serverless baseada em:

- **AWS Lambda** para execução das funções
- **Serverless Framework** para orquestração e deployment
- **API Gateway** para roteamento e autenticação
- **CloudFormation** para infraestrutura como código
- **Estrutura modular** com separação por domínio (Clean Architecture)

## Alternativas Consideradas

### Alternativa 1: Arquitetura Monolítica Tradicional

**Prós:**

- Desenvolvimento mais simples inicialmente
- Menos complexidade de deployment
- Ferramentas maduras e bem documentadas

**Contras:**

- Custos fixos mesmo sem uso
- Escalabilidade limitada
- Manutenção de servidores
- Time to market mais lento para features

### Alternativa 2: Microserviços em Containers (ECS/EKS)

**Prós:**

- Controle total sobre o ambiente
- Facilidade de debug local
- Flexibilidade de runtime

**Contras:**

- Complexidade operacional alta
- Custos de infraestrutura
- Necessidade de expertise em DevOps
- Overhead de containers

### Alternativa 3: Arquitetura Serverless (Escolhida)

**Prós:**

- Pagamento apenas pelo uso (custo zero quando não há tráfego)
- Escalabilidade automática e ilimitada
- Manutenção mínima de infraestrutura
- Deploy rápido e simples
- Alta disponibilidade nativa

**Contras:**

- Cold start latency
- Limitações de timeout (15 min)
- Vendor lock-in com AWS
- Debugging mais complexo
- Limitações de memória e CPU

## Consequências

### Positivas

- **Redução de custos operacionais** em até 70% comparado a servidores tradicionais
- **Escalabilidade automática** permite lidar com picos de 100x o tráfego normal
- **Time to market** reduzido em 40% devido à simplicidade de deploy
- **Alta disponibilidade** nativa (99.95% SLA)
- **Foco no produto** ao invés de infraestrutura
- **Deploy contínuo** facilitado

### Negativas

- **Cold start** pode causar latência de 100-500ms na primeira requisição
- **Vendor lock-in** com AWS Lambda
- **Limitações de runtime** (Node.js, Python, etc.)
- **Debugging complexo** em ambiente distribuído
- **Limitações de memória** (até 10GB) e timeout (15 min)

### Riscos

- **Dependência de provedor** (AWS) para disponibilidade
- **Custos imprevistos** se não houver controle de limites
- **Curva de aprendizado** para equipe acostumada com servidores tradicionais
- **Limitações de integração** com sistemas legados

## Implementação

A implementação seguirá a estrutura já estabelecida:

```
src/
├── core/           # Camada de infraestrutura compartilhada
├── domain/         # Regras de negócio e casos de uso
└── infra/          # Implementações específicas (Lambda functions)
```

**Ferramentas escolhidas:**

- Serverless Framework para orquestração
- TypeScript para type safety
- Jest para testes
- ESLint + Prettier para qualidade de código
- AWS SDK v3 para integrações

## Monitoramento

**Métricas a serem monitoradas:**

- Latência de resposta (p95, p99)
- Taxa de erro
- Custo por requisição
- Cold start frequency
- Throughput (requests/segundo)

**Ferramentas:**

- CloudWatch para métricas básicas
- X-Ray para tracing distribuído
- Custom dashboards para métricas de negócio

## Referências

- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [Serverless Framework Documentation](https://www.serverless.com/framework/docs/)
- [Clean Architecture - Robert Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)

---

**Próximos ADRs relacionados:**

- ADR-002: Estratégia de Autenticação e Autorização
- ADR-003: Estratégia de Banco de Dados
- ADR-004: Estratégia de Observabilidade e Logging
