# Sistema de Roteamento Seguro e Otimizado

## Visão Geral

Este documento descreve o sistema completo de roteamento seguro implementado no Turbofy, que gerencia o acesso às páginas com base no estado de autenticação do usuário.

## Arquitetura

### Componentes Principais

1. **Middleware do Next.js** (`src/middleware.ts`)
   - Proteção de rotas no nível do servidor
   - Verificação de cookies HttpOnly
   - Redirecionamento automático

2. **Contexto de Autenticação** (`src/contexts/auth-context.tsx`)
   - Gerenciamento global do estado de autenticação
   - Validação de tokens
   - Logout automático por inatividade

3. **Route Guard** (`src/components/routing/route-guard.tsx`)
   - Proteção de componentes no cliente
   - Loading states durante verificação

4. **Utilitários de Autenticação** (`src/lib/auth.ts`)
   - Gerenciamento seguro de tokens
   - Validação de tokens
   - Proteção CSRF

5. **Sistema de Lazy Loading** (`src/lib/route-loader.ts`)
   - Carregamento sob demanda de rotas
   - Pré-carregamento inteligente
   - Cache de componentes

## Rotas Protegidas

As seguintes rotas requerem autenticação:

- `/dashboard`
- `/vitrine`
- `/vendas`
- `/financeiro`
- `/clientes`
- `/afiliados`
- `/produtos`
- `/configuracoes`
- `/integracoes`
- `/profile`

## Rotas Públicas

As seguintes rotas são acessíveis sem autenticação:

- `/login`
- `/register`
- `/forgot-password` ou `/forgot`
- `/healthz`
- `/`

## Segurança

### Tokens

- **Armazenamento**: Tokens são armazenados em cookies HttpOnly pelo servidor
- **Validação**: Tokens são validados no servidor antes de conceder acesso
- **Expiração**: Tokens de acesso expiram em 15 minutos
- **Renovação**: Tokens podem ser renovados usando refresh tokens

### Proteção CSRF

- Tokens CSRF são gerados pelo servidor
- Tokens são incluídos em todas as requisições mutáveis (POST, PUT, PATCH, DELETE)
- Validação no servidor antes de processar requisições

### Logout Automático

- Usuários são desconectados após 15 minutos de inatividade
- Atividade é rastreada através de eventos do mouse, teclado e scroll
- Limpeza automática de tokens ao desconectar

## Otimizações

### Lazy Loading

- Componentes de rotas são carregados sob demanda
- Redução do bundle inicial
- Melhor performance de carregamento

### Pré-carregamento

- Rotas prioritárias são pré-carregadas após 1 segundo
- Pré-carregamento ao passar o mouse sobre links
- Cache inteligente de componentes

### Cache

- Dados do usuário são cacheados em sessionStorage
- Tokens são validados antes de usar dados em cache
- Invalidação automática em caso de erro

## Uso

### Proteger uma Rota

```tsx
import { RouteGuard } from "@/components/routing/route-guard";

export default function ProtectedPage() {
  return (
    <RouteGuard requireAuth>
      <div>Conteúdo Protegido</div>
    </RouteGuard>
  );
}
```

### Usar Autenticação em Componentes

```tsx
import { useAuth } from "@/contexts/auth-context";

export default function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Não autenticado</div>;
  }

  return (
    <div>
      <p>Olá, {user?.email}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### Pré-carregar Rota

```tsx
import { preloadRoute } from "@/lib/route-loader";

function MyLink() {
  return (
    <a
      href="/dashboard"
      onMouseEnter={() => preloadRoute("/dashboard")}
    >
      Dashboard
    </a>
  );
}
```

## Testes

Testes estão disponíveis em `src/__tests__/routing/`:

- `middleware.test.ts` - Testes do middleware
- `auth-context.test.tsx` - Testes do contexto de autenticação
- `route-guard.test.tsx` - Testes do RouteGuard

Execute os testes com:

```bash
pnpm test
```

## Troubleshooting

### Problema: Redirecionamento infinito

**Solução**: Verifique se o endpoint `/auth/me` está retornando dados corretos e se os cookies estão sendo definidos corretamente.

### Problema: Token não é validado

**Solução**: Verifique se o token está sendo armazenado corretamente e se o servidor está validando o token nos cookies HttpOnly.

### Problema: CSRF token inválido

**Solução**: Certifique-se de que o token CSRF está sendo obtido antes de fazer requisições mutáveis e que está sendo incluído no header `X-CSRF-Token`.

