# 🚀 Configuração do Monorepo Turbofy

Este documento descreve as configurações do monorepo e como executar o projeto completo.

## 📦 Scripts Disponíveis na Raiz

### Desenvolvimento

```bash
# Rodar frontend e backend juntos (recomendado)
pnpm dev

# Rodar apenas backend
pnpm dev:backend

# Rodar apenas frontend
pnpm dev:frontend

# Rodar via Docker Compose
pnpm dev:docker
```

### Build

```bash
# Build completo (backend + frontend)
pnpm build

# Build apenas backend
pnpm backend:build

# Build apenas frontend
pnpm frontend:build
```

### Testes

```bash
# Testes do backend
pnpm test

# Testes completos (backend + frontend)
pnpm test:all
```

### Outros

```bash
# Type check
pnpm type-check

# Lint
pnpm lint
```

## 🔧 Configuração

### Estrutura do Monorepo

```
turbofy/
├── backend/          # Backend Node.js + TypeScript
├── frontend/         # Frontend Next.js
├── package.json      # Configuração do workspace
└── pnpm-workspace.yaml
```

### Workspace

O projeto usa **pnpm workspaces** para gerenciar dependências:

- `backend/` - Servidor Express + Prisma
- `frontend/` - Next.js App Router
- Dependências compartilhadas na raiz

## ⚠️ Problema Conhecido: Prisma no Windows

Se você encontrar o erro `EPERM: operation not permitted` ao gerar o Prisma Client:

### Solução 1: Fechar Processos Node

1. Feche todos os processos Node.js (VS Code, terminal, etc.)
2. Execute novamente: `pnpm run backend:build`

### Solução 2: Limpar Cache do Prisma

```bash
# Na raiz do projeto
cd backend
rm -rf node_modules/.prisma
pnpm prisma generate
```

### Solução 3: Usar Script de Correção

O projeto inclui um script automático:

```bash
pnpm --filter backend prisma:generate:force
```

### Solução 4: Reiniciar o Computador

Se nada funcionar, reinicie o Windows para liberar arquivos travados.

## 🐳 Docker

### Desenvolvimento com Docker

```bash
# Iniciar todos os serviços (PostgreSQL, RabbitMQ, Mailhog, Backend, Frontend)
pnpm dev:docker

# Parar serviços
docker compose down

# Ver logs
docker compose logs -f
```

### Serviços Disponíveis

- **PostgreSQL**: `localhost:5433`
- **RabbitMQ Management**: `http://localhost:15672` (guest/guest)
- **Mailhog**: `http://localhost:8025`
- **Backend API**: `http://localhost:8080`
- **Frontend**: `http://localhost:3000`

## 📝 Próximos Passos

1. **Configurar variáveis de ambiente**:
   - Copie `backend/.env.example` para `backend/.env`
   - Ajuste as configurações conforme necessário

2. **Rodar migrations**:
   ```bash
   pnpm --filter backend prisma migrate dev
   ```

3. **Iniciar desenvolvimento**:
   ```bash
   pnpm dev
   ```

## 🔍 Troubleshooting

### Porta já em uso

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# Linux/Mac
lsof -i :3000
kill -9 <pid>
```

### Dependências desatualizadas

```bash
pnpm install
```

### Limpar tudo e reinstalar

```bash
rm -rf node_modules backend/node_modules frontend/node_modules
pnpm install
```

