# 🚀 Turbofy - Comandos do Projeto

Este documento lista todos os comandos disponíveis para desenvolvimento, build, deploy e manutenção do projeto Turbofy.

## 📦 Gerenciamento de Dependências

### Instalação
```bash
# Instalar todas as dependências (workspace)
pnpm install

# Instalar dependências de um workspace específico
pnpm --filter backend install
pnpm --filter frontend install
```

### Adicionar Dependências
```bash
# Adicionar dependência no backend
pnpm --filter backend add <package-name>

# Adicionar dependência de desenvolvimento
pnpm --filter backend add -D <package-name>

# Adicionar dependência no frontend
pnpm --filter frontend add <package-name>
```

### Remover Dependências
```bash
pnpm --filter backend remove <package-name>
pnpm --filter frontend remove <package-name>
```

## 🔧 Backend

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento (hot reload)
cd backend
pnpm dev

# Ou do root
pnpm --filter backend dev
```

### Build
```bash
# Compilar TypeScript
pnpm --filter backend build

# Verificar tipos sem compilar
pnpm --filter backend type-check
```

### Prisma
```bash
# Gerar Prisma Client
pnpm --filter backend prisma:generate

# Criar nova migration
pnpm --filter backend prisma migrate dev --name <migration-name>

# Aplicar migrations
pnpm --filter backend prisma migrate deploy

# Abrir Prisma Studio (GUI para DB)
pnpm --filter backend prisma:studio

# Resetar banco de dados (CUIDADO: apaga todos os dados)
pnpm --filter backend prisma migrate reset

# Seed do banco de dados
pnpm --filter backend prisma db seed
```

### Testes
```bash
# Rodar todos os testes
pnpm --filter backend test

# Rodar testes em modo watch
pnpm --filter backend test:watch

# Rodar testes com cobertura
pnpm --filter backend test:coverage

# Rodar testes específicos
pnpm --filter backend test <test-file>
```

## 🎨 Frontend

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
cd frontend
pnpm dev

# Ou do root
pnpm --filter frontend dev
```

### Build
```bash
# Build de produção
pnpm --filter frontend build

# Iniciar servidor de produção (após build)
pnpm --filter frontend start
```

### Linting
```bash
# Verificar erros de lint
pnpm --filter frontend lint

# Corrigir erros de lint automaticamente
pnpm --filter frontend lint:fix
```

### Type Checking
```bash
# Verificar tipos TypeScript
pnpm --filter frontend type-check
```

## 🏗️ Infraestrutura (SST)

### Desenvolvimento
```bash
# Iniciar ambiente de desenvolvimento SST
pnpm dev

# Ou explicitamente
sst dev
```

### Build
```bash
# Build da infraestrutura
pnpm build

# Ou
sst build
```

### Deploy
```bash
# Deploy para staging
sst deploy --stage staging

# Deploy para produção
sst deploy --stage production

# Ou usando pnpm
pnpm deploy --stage production
```

### Remover Stack
```bash
# Remover stack (CUIDADO: apaga recursos)
sst remove

# Remover stack específico
sst remove --stage staging
```

### Outros Comandos SST
```bash
# Ver logs
sst logs

# Abrir console AWS
sst console

# Verificar status
sst status
```

## 🧪 Testes

### Todos os Workspaces
```bash
# Rodar testes em todos os workspaces
pnpm test

# Rodar testes com cobertura
pnpm test:coverage
```

### Backend Específico
```bash
# Testes unitários
pnpm --filter backend test:unit

# Testes de integração
pnpm --filter backend test:integration

# Testes E2E
pnpm --filter backend test:e2e
```

## 🔍 Qualidade de Código

### Linting
```bash
# Lint em todos os workspaces
pnpm lint

# Lint e corrigir
pnpm lint:fix
```

### Type Checking
```bash
# Verificar tipos em todos os workspaces
pnpm type-check
```

### Formatação
```bash
# Formatar código (se configurado Prettier)
pnpm format

# Verificar formatação
pnpm format:check
```

## 🗄️ Banco de Dados

### Migrations
```bash
# Criar migration
cd backend
pnpm prisma migrate dev --name <nome-da-migration>

# Aplicar migrations em produção
pnpm prisma migrate deploy

# Ver status das migrations
pnpm prisma migrate status
```

### Seed
```bash
# Executar seed
pnpm --filter backend prisma db seed
```

### Backup e Restore
```bash
# Backup (exemplo PostgreSQL)
pg_dump -h localhost -U postgres -d turbofy > backup.sql

# Restore
psql -h localhost -U postgres -d turbofy < backup.sql
```

## 🐰 RabbitMQ

### Desenvolvimento Local
```bash
# Iniciar RabbitMQ via Docker
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=admin \
  rabbitmq:3-management

# Acessar Management UI
# http://localhost:15672
# Usuário: admin / Senha: admin
```

### Verificar Conexão
```bash
# Testar conexão (se houver script)
pnpm --filter backend test:rabbitmq
```

## 🧹 Limpeza

### Limpar Builds
```bash
# Limpar builds de todos os workspaces
pnpm clean

# Limpar build específico
pnpm --filter backend clean
pnpm --filter frontend clean
```

### Limpar Node Modules
```bash
# Remover node_modules e reinstalar
rm -rf node_modules backend/node_modules frontend/node_modules
pnpm install
```

### Limpar Cache
```bash
# Limpar cache do pnpm
pnpm store prune

# Limpar cache do Next.js
pnpm --filter frontend clean:cache
```

## 📊 Monitoramento e Logs

### Logs do Backend
```bash
# Ver logs em desenvolvimento
pnpm --filter backend dev | tee logs/backend.log

# Ver logs de produção (se configurado)
pnpm --filter backend logs
```

### Logs do Frontend
```bash
# Ver logs em desenvolvimento
pnpm --filter frontend dev | tee logs/frontend.log
```

### Logs SST
```bash
# Ver logs do SST
sst logs <function-name>

# Ver logs de um stack específico
sst logs --stack <stack-name>
```

## 🔐 Variáveis de Ambiente

### Setup
```bash
# Copiar arquivo de exemplo
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Editar variáveis
# Use seu editor preferido para editar .env
```

### Validação
```bash
# Validar variáveis de ambiente (se houver script)
pnpm --filter backend validate:env
pnpm --filter frontend validate:env
```

## 🚀 Deploy Completo

### Pipeline de Deploy
```bash
# 1. Instalar dependências
pnpm install

# 2. Build
pnpm build

# 3. Rodar testes
pnpm test

# 4. Aplicar migrations
pnpm --filter backend prisma migrate deploy

# 5. Deploy infraestrutura
pnpm deploy --stage production
```

## 📦 Scripts Personalizados

### Criar Scripts Customizados

Adicione scripts no `package.json` do workspace:

```json
{
  "scripts": {
    "dev:all": "concurrently \"pnpm --filter backend dev\" \"pnpm --filter frontend dev\"",
    "build:all": "pnpm --filter backend build && pnpm --filter frontend build",
    "test:all": "pnpm --filter backend test && pnpm --filter frontend test"
  }
}
```

## 🆘 Troubleshooting

### Problemas Comuns

#### Porta já em uso
```bash
# Encontrar processo usando porta
# Windows
netstat -ano | findstr :3000
# Linux/Mac
lsof -i :3000

# Matar processo
# Windows
taskkill /PID <pid> /F
# Linux/Mac
kill -9 <pid>
```

#### Dependências desatualizadas
```bash
# Atualizar todas as dependências
pnpm update --recursive

# Atualizar dependência específica
pnpm --filter backend update <package-name>
```

#### Problemas com Prisma
```bash
# Regenerar Prisma Client
pnpm --filter backend prisma generate

# Resetar banco (CUIDADO: apaga dados)
pnpm --filter backend prisma migrate reset
```

#### Cache do TypeScript
```bash
# Limpar cache do TypeScript
rm -rf backend/.tsbuildinfo frontend/.tsbuildinfo
pnpm --filter backend build
```

## 📝 Convenções de Comandos

### Nomenclatura
- `dev`: Servidor de desenvolvimento
- `build`: Build de produção
- `test`: Rodar testes
- `lint`: Verificar código
- `format`: Formatar código
- `clean`: Limpar builds/cache
- `deploy`: Deploy para produção
- `migrate`: Migrations de banco

### Flags Comuns
- `--filter <workspace>`: Executar em workspace específico
- `--stage <stage>`: Ambiente (dev, staging, production)
- `--watch`: Modo watch
- `--coverage`: Com cobertura
- `--verbose`: Modo verboso

---

**Nota**: Sempre verifique o `package.json` de cada workspace para comandos específicos adicionais.

