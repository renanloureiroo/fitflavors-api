# 🧭 Fluxo de Navegação da Documentação

## 📍 **Ponto de Entrada Principal**

```
README.md (raiz do projeto)
├── docs/README.md (hub central)
├── docs/project-architecture.md (arquitetos)
└── docs/project/README.md (desenvolvedores)
```

## 🎯 **Fluxos de Navegação por Perfil**

### **👨‍💻 Desenvolvedores**

```
README.md (raiz)
└── docs/README.md
    ├── project-architecture.md (entender sistema)
    ├── folder-architecture.md (estrutura do código)
    ├── project/erd.md (entidades e dados)
    └── endpoints/ (APIs disponíveis)
        ├── signup-c4.md
        ├── signin-c4.md
        └── profile-c4.md
```

### **🏗️ Arquitetos**

```
README.md (raiz)
└── docs/README.md
    ├── adrs/ (decisões arquiteturais)
    │   ├── adr-001-serverless-architecture.md
    │   └── adr-002-authentication-validation.md
    ├── project-architecture.md (visão técnica)
    └── folder-architecture.md (padrões de organização)
```

### **📊 Product Managers**

```
README.md (raiz)
└── docs/README.md
    ├── endpoints/ (funcionalidades)
    │   ├── signup-c4.md
    │   ├── signin-c4.md
    │   └── profile-c4.md
    ├── project/erd.md (estrutura de dados)
    └── project-architecture.md (capacidades técnicas)
```

## 🔗 **Referências Cruzadas**

### **Arquitetura → Dados**

- `project-architecture.md` → `project/erd.md`
- `folder-architecture.md` → `project/erd.md`

### **Endpoints → Dados**

- `endpoints/signup-c4.md` → `project/erd.md`
- `endpoints/signin-c4.md` → `project/erd.md`
- `endpoints/profile-c4.md` → `project/erd.md`

### **ADRs → Arquitetura**

- `adrs/adr-001-serverless-architecture.md` → `project-architecture.md`
- `adrs/adr-002-authentication-validation.md` → `project-architecture.md`

## 📋 **Princípios de Navegação**

1. **Ponto Único de Entrada**: README.md da raiz
2. **Navegação por Perfil**: Fluxos específicos para cada tipo de usuário
3. **Referências Cruzadas**: Links entre documentos relacionados
4. **Eliminação de Duplicações**: Informações centralizadas com referências
5. **Manutenibilidade**: Estrutura simples e consistente

## 🎯 **Benefícios da Estrutura**

- **Navegação Intuitiva**: Cada perfil tem seu caminho otimizado
- **Manutenção Simplificada**: Informações centralizadas
- **Referências Claras**: Links diretos entre documentos relacionados
- **Eliminação de Duplicações**: Cada tópico documentado uma única vez
- **Escalabilidade**: Fácil adição de novos documentos

---

**📅 Atualizado**: 2024-12-19 | **👥 Equipe**: FitFlavors Development
