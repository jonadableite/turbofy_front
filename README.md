# 🚀 Turbofy - Gateway de Pagamentos

Gateway de pagamentos completo com dashboard SaaS para gestão financeira, cobranças, relatórios e controle de repasses.

## 📋 Documentação do Projeto

Este projeto possui documentação detalhada para garantir consistência e qualidade:

- **[`.cursorrules`](.cursorrules)** - Regras principais do projeto (lidas automaticamente pelo Cursor)
- **[`PROJECT_RULES.md`](PROJECT_RULES.md)** - Regras detalhadas, arquitetura e padrões de código
- **[`PROJECT_COMMANDS.md`](PROJECT_COMMANDS.md)** - Comandos técnicos do projeto (build, deploy, testes)
- **[`USER_COMMANDS.md`](USER_COMMANDS.md)** - Comandos para desenvolvedores (workflow diário)

## 🏗️ Arquitetura

- **Arquitetura Hexagonal** (Ports & Adapters)
- **SOLID Principles**
- **Clean Code**
- **Type-Safe** (TypeScript strict, sem `any`)

## 🛠️ Stack Tecnológica

### Backend
- Node.js + TypeScript
- PostgreSQL + Prisma ORM
- RabbitMQ (Mensageria)
- Express
- Zod (Validação)

### Frontend
- Next.js 16+ (App Router)
- React 19+
- TailwindCSS v4
- Shadcn/ui, Aceternity UI, Magic UI

### Infraestrutura
- SST (Serverless Stack)
- AWS

## 🚀 Início Rápido

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Rodar migrations
pnpm --filter backend prisma migrate dev

# Iniciar desenvolvimento
pnpm dev
```

## 📁 Estrutura do Projeto

```
turbofy/
├── backend/          # Backend (Arquitetura Hexagonal)
│   ├── src/
│   │   ├── domain/      # Entidades e regras de negócio
│   │   ├── application/ # Casos de uso e serviços
│   │   ├── infrastructure/ # Implementações (DB, APIs, RabbitMQ)
│   │   └── ports/        # Interfaces
│   └── prisma/        # Schema e migrations
├── frontend/         # Frontend Next.js
│   └── src/
│       ├── app/      # Next.js App Router
│       ├── components/
│       └── lib/
└── sst.config.ts     # Configuração SST
```

## 💼 Funcionalidades

### Dashboard Proprietário
- 📊 Visualização de lucro e receitas
- 📈 Relatórios financeiros
- 💰 Análise de taxas
- 🔄 Conciliação bancária
- 💸 Split de pagamentos

### Dashboard Cliente
- 💳 Criação de cobranças (Pix, Boleto)
- 📋 Relatórios e extratos
- 🔑 Gerenciamento de chaves Pix
- 📄 Gerenciamento de boletos
- 💵 Acompanhamento de taxas

## 🔒 Regras Importantes

1. **NUNCA usar `any`** - Sempre tipar explicitamente
2. **Validar todos os inputs** com Zod
3. **Respeitar Arquitetura Hexagonal** - Sem dependências circulares
4. **Aplicar SOLID** em todo código
5. **Type-safe** em todas as operações
6. **Clean Code** - Código limpo e legível

## 📚 Documentação Adicional

Consulte os arquivos de documentação para mais detalhes:
- Regras e padrões: `PROJECT_RULES.md`
- Comandos técnicos: `PROJECT_COMMANDS.md`
- Comandos do usuário: `USER_COMMANDS.md`

## 🧪 Testes

```bash
# Rodar todos os testes
pnpm test

# Testes com cobertura
pnpm test:coverage
```

## 🚀 Deploy

```bash
# Build
pnpm build

# Deploy staging
pnpm deploy --stage staging

# Deploy produção
pnpm deploy --stage production
```

## 📝 Licença

ISC

---

**Desenvolvido com ❤️ seguindo as melhores práticas de arquitetura e código limpo.**

