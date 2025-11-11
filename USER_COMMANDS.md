# 👤 Turbofy - Comandos do Usuário

Este documento lista comandos e instruções específicas para usuários/desenvolvedores trabalharem no projeto Turbofy.

## 🚀 Início Rápido

### Primeira Configuração

```bash
# 1. Clonar repositório (se aplicável)
git clone <repository-url>
cd turbofy

# 2. Instalar dependências
pnpm install

# 3. Configurar variáveis de ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Configurar banco de dados local
# Editar backend/.env com suas credenciais PostgreSQL

# 5. Rodar migrations
pnpm --filter backend prisma migrate dev

# 6. Iniciar serviços
pnpm dev
```

## 🛠️ Comandos de Desenvolvimento Diário

### Iniciar Ambiente de Desenvolvimento

```bash
# Opção 1: Iniciar tudo (backend + frontend + SST)
pnpm dev

# Opção 2: Iniciar apenas backend
pnpm --filter backend dev

# Opção 3: Iniciar apenas frontend
pnpm --filter frontend dev

# Opção 4: Iniciar backend e frontend simultaneamente
pnpm --filter backend dev & pnpm --filter frontend dev
```

### Trabalhar com Banco de Dados

```bash
# Ver dados no banco (Prisma Studio)
pnpm --filter backend prisma:studio
# Abre em http://localhost:5555

# Criar nova migration
pnpm --filter backend prisma migrate dev --name <descricao-da-mudanca>

# Aplicar migrations pendentes
pnpm --filter backend prisma migrate deploy

# Resetar banco (CUIDADO: apaga todos os dados)
pnpm --filter backend prisma migrate reset
```

### Trabalhar com Código

```bash
# Verificar tipos TypeScript
pnpm type-check

# Verificar lint
pnpm lint

# Corrigir problemas de lint automaticamente
pnpm lint:fix

# Formatar código
pnpm format
```

## 📝 Workflow de Desenvolvimento

### Criar Nova Feature

```bash
# 1. Criar branch
git checkout -b feature/nome-da-feature

# 2. Desenvolver feature
# ... fazer alterações ...

# 3. Verificar código
pnpm type-check
pnpm lint
pnpm test

# 4. Commitar
git add .
git commit -m "feat: descrição da feature"

# 5. Push
git push origin feature/nome-da-feature
```

### Criar Nova Entidade/Model

```bash
# 1. Adicionar model no Prisma schema
# Editar: backend/prisma/schema.prisma

# 2. Criar migration
pnpm --filter backend prisma migrate dev --name add-nova-entidade

# 3. Gerar Prisma Client
pnpm --filter backend prisma generate

# 4. Criar entidade de domínio
# Criar: backend/src/domain/entities/NovaEntidade.ts

# 5. Criar repositório (port)
# Criar: backend/src/domain/repositories/INovaEntidadeRepository.ts

# 6. Implementar repositório
# Criar: backend/src/infrastructure/database/prisma/PrismaNovaEntidadeRepository.ts

# 7. Criar caso de uso
# Criar: backend/src/application/use-cases/nova-entidade/CreateNovaEntidadeUseCase.ts
```

### Criar Nova API Endpoint

```bash
# 1. Criar DTO
# Criar: backend/src/application/dto/CreateNovaEntidadeDTO.ts

# 2. Criar controller
# Criar: backend/src/infrastructure/http/controllers/NovaEntidadeController.ts

# 3. Criar rotas
# Criar/Editar: backend/src/infrastructure/http/routes/nova-entidade.routes.ts

# 4. Registrar rotas
# Editar: backend/src/infrastructure/http/server.ts
```

### Criar Novo Componente Frontend

```bash
# 1. Criar componente
# Criar: frontend/src/components/features/NovoComponente.tsx

# 2. Criar tipos (se necessário)
# Criar: frontend/src/types/novo-componente.ts

# 3. Criar hook customizado (se necessário)
# Criar: frontend/src/hooks/useNovoComponente.ts

# 4. Usar componente
# Importar e usar em páginas/outros componentes
```

## 🧪 Testes

### Rodar Testes

```bash
# Todos os testes
pnpm test

# Apenas backend
pnpm --filter backend test

# Apenas frontend
pnpm --filter frontend test

# Testes em modo watch
pnpm --filter backend test:watch

# Testes com cobertura
pnpm --filter backend test:coverage
```

### Criar Novo Teste

```bash
# 1. Criar arquivo de teste
# Criar: backend/src/application/services/__tests__/PaymentService.test.ts

# 2. Escrever testes
# Seguir padrão: Arrange, Act, Assert

# 3. Rodar teste específico
pnpm --filter backend test PaymentService.test.ts
```

## 🐛 Debugging

### Backend

```bash
# Iniciar com debug
pnpm --filter backend dev:debug

# Ou usar Node.js debugger
node --inspect backend/dist/index.js
```

### Frontend

```bash
# Next.js já tem hot reload
# Use React DevTools no navegador
```

### Banco de Dados

```bash
# Ver queries executadas (Prisma)
# Adicionar no .env:
# DEBUG=prisma:query

# Ou usar Prisma Studio
pnpm --filter backend prisma:studio
```

### RabbitMQ

```bash
# Verificar filas e mensagens
# Acessar: http://localhost:15672
# Usuário: admin / Senha: admin
```

## 📊 Monitoramento

### Ver Logs

```bash
# Logs do backend (em desenvolvimento)
# Logs aparecem no terminal onde rodou `pnpm dev`

# Logs do frontend
# Logs aparecem no terminal e no navegador (console)
```

### Verificar Status

```bash
# Status do SST
sst status

# Status das migrations
pnpm --filter backend prisma migrate status
```

## 🔐 Segurança

### Variáveis de Ambiente

```bash
# NUNCA commitar arquivos .env
# Sempre usar .env.example como template

# Verificar se .env está no .gitignore
cat .gitignore | grep .env
```

### Secrets

```bash
# Usar SST Secrets para produção
sst secret set DATABASE_URL <url>
sst secret set API_KEY <key>

# Listar secrets
sst secret list
```

## 🚀 Deploy

### Deploy para Staging

```bash
# 1. Build
pnpm build

# 2. Testes
pnpm test

# 3. Deploy
pnpm deploy --stage staging
```

### Deploy para Produção

```bash
# 1. Verificar que está na branch main/master
git checkout main

# 2. Pull latest
git pull origin main

# 3. Build
pnpm build

# 4. Testes
pnpm test

# 5. Aplicar migrations
pnpm --filter backend prisma migrate deploy

# 6. Deploy
pnpm deploy --stage production
```

## 📚 Comandos Úteis

### Git

```bash
# Ver status
git status

# Ver diferenças
git diff

# Ver histórico
git log --oneline

# Criar tag de versão
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Dependências

```bash
# Verificar dependências desatualizadas
pnpm outdated

# Atualizar dependências
pnpm update

# Verificar vulnerabilidades
pnpm audit

# Corrigir vulnerabilidades
pnpm audit fix
```

### Limpeza

```bash
# Limpar builds
pnpm clean

# Limpar node_modules
rm -rf node_modules backend/node_modules frontend/node_modules
pnpm install

# Limpar cache
pnpm store prune
```

## 🆘 Resolução de Problemas

### Problema: Porta já em uso

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# Linux/Mac
lsof -i :3000
kill -9 <pid>
```

### Problema: Erros de TypeScript

```bash
# Limpar cache
rm -rf backend/.tsbuildinfo frontend/.tsbuildinfo
pnpm type-check
```

### Problema: Prisma Client não encontrado

```bash
# Regenerar Prisma Client
pnpm --filter backend prisma generate
```

### Problema: Dependências não instaladas

```bash
# Limpar e reinstalar
rm -rf node_modules backend/node_modules frontend/node_modules pnpm-lock.yaml
pnpm install
```

### Problema: Migrations conflitantes

```bash
# Ver status
pnpm --filter backend prisma migrate status

# Resolver conflitos manualmente
# Editar migrations conflitantes

# Aplicar novamente
pnpm --filter backend prisma migrate deploy
```

## 📖 Recursos Adicionais

### Documentação

- `.cursorrules` - Regras do projeto para agentes
- `PROJECT_RULES.md` - Regras detalhadas
- `PROJECT_COMMANDS.md` - Comandos técnicos do projeto
- `README.md` - Documentação geral (se existir)

### Links Úteis

- Prisma Studio: http://localhost:5555
- Frontend Dev: http://localhost:3000
- Backend API: http://localhost:4000 (ou porta configurada)
- RabbitMQ Management: http://localhost:15672

### Suporte

- Verificar logs para erros
- Consultar documentação das tecnologias
- Revisar `.cursorrules` para padrões do projeto
- Verificar `PROJECT_RULES.md` para arquitetura

---

**Dica**: Sempre que tiver dúvidas sobre comandos, consulte este arquivo ou o `PROJECT_COMMANDS.md` para referência técnica completa.

