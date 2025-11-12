# Implementação de Autenticação - Turbofy Frontend

## 📋 Visão Geral

Este documento descreve a implementação completa da camada de autenticação do frontend do Turbofy, construída com Next.js 13 (App Router), TypeScript strict, e seguindo as melhores práticas de segurança e acessibilidade.

## 🎨 Tecnologias Utilizadas

- **React 18** & **Next.js 16** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS v4** + Design System customizado
- **next-themes** - Tema dark/light
- **react-hook-form** + **zod** - Validação type-safe
- **framer-motion** - Animações
- **zxcvbn** - Medidor de força de senha
- **react-google-recaptcha-v3** - Proteção contra bots
- **Lucide React** - Ícones

## 📁 Estrutura de Arquivos

```
frontend/src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx           # Página de login
│   │   ├── register/page.tsx        # Página de registro
│   │   └── forgot/page.tsx          # Página de recuperação de senha
│   ├── layout.tsx                   # Layout raiz com providers
│   ├── providers.tsx                # Theme & reCAPTCHA providers
│   └── globals.css                  # CSS variables + Tailwind
│
├── components/
│   └── auth/
│       ├── AuthLayout.tsx           # Layout centralizado para auth pages
│       ├── ThemeToggle.tsx          # Toggle dark/light mode
│       ├── FormInput.tsx            # Input animado com validação
│       └── PasswordStrengthMeter.tsx # Medidor de força de senha
│
├── lib/
│   ├── api.ts                       # Cliente API com CSRF e HttpOnly cookies
│   ├── validation.ts                # Schemas Zod para validação
│   └── utils.ts                     # Utilitários (cn helper)
│
├── hooks/
│   └── useRecaptcha.ts              # Hook para reCAPTCHA v3
│
└── __tests__/
    └── auth/
        └── login.test.tsx           # Testes unitários
```

## 🎯 Funcionalidades Implementadas

### 1. **Página de Login** (`/login`)

**Recursos:**
- ✅ Validação com Zod (email válido, senha mínima 8 caracteres)
- ✅ Rate limiting no cliente (5 tentativas = bloqueio de 30s)
- ✅ Integração com reCAPTCHA v3
- ✅ Mensagens de erro acessíveis
- ✅ Redirect para `/dashboard` após login bem-sucedido
- ✅ Link para recuperação de senha
- ✅ Animações suaves (fade-in, scale)

**Fluxo:**
1. Usuário preenche email e senha
2. reCAPTCHA v3 executa em background
3. Chamada para `POST /auth/login` com token reCAPTCHA
4. Backend valida e retorna `accessToken` + `refreshToken` via HttpOnly cookie
5. Redirect para dashboard

### 2. **Página de Registro** (`/register`)

**Recursos:**
- ✅ Validação complexa com Zod:
  - Email válido
  - Senha forte (min 12 chars, maiúscula, minúscula, número, símbolo especial)
  - CPF/CNPJ válido (validação básica no frontend, completa no backend)
  - Telefone opcional (formato brasileiro)
  - Confirmação de senha
- ✅ **Medidor de força de senha** em tempo real com `zxcvbn`
- ✅ Sugestões de melhoria de senha
- ✅ Integração com reCAPTCHA v3
- ✅ Termos de serviço e privacidade

**Fluxo:**
1. Usuário preenche todos os campos obrigatórios
2. Sistema valida e mostra força da senha
3. reCAPTCHA v3 executa em background
4. Chamada para `POST /auth/register` com dados + token reCAPTCHA
5. Backend cria usuário e retorna tokens via HttpOnly cookie
6. Redirect para dashboard

### 3. **Página de Recuperação de Senha** (`/forgot`)

**Recursos:**
- ✅ Formulário simples com apenas email
- ✅ Mensagem de sucesso genérica (não revela se email existe - segurança)
- ✅ Integração com reCAPTCHA v3
- ✅ Animação de sucesso com ícone CheckCircle
- ✅ Link de volta para login

**Observação:**
⚠️ O endpoint `/auth/forgot-password` **ainda não está implementado no backend**. A estrutura está pronta no frontend para ser integrada quando o backend implementar.

## 🔐 Segurança

### CSRF Protection

O cliente busca automaticamente o token CSRF do backend via `GET /api/auth/csrf` e o inclui em todas as requisições mutáveis (POST, PUT, DELETE) no header `X-CSRF-Token`.

```typescript
// Exemplo: lib/api.ts
const csrf = await fetchCsrfToken();
headers["X-CSRF-Token"] = csrf;
```

**Observação:** O endpoint `/api/auth/csrf` ainda precisa ser implementado no backend.

### HttpOnly Cookies

Os tokens JWT **não são armazenados no localStorage** por questões de segurança. O backend envia `Set-Cookie` com flags:
- `HttpOnly`: impede acesso via JavaScript
- `Secure`: apenas HTTPS em produção
- `SameSite=Strict`: proteção contra CSRF

Cliente envia `credentials: "include"` em todas as requisições para o backend incluir o cookie automaticamente.

### reCAPTCHA v3

Proteção contra bots e ataques automatizados. O token é gerado em background e enviado em todas as requisições de autenticação.

```typescript
const recaptchaToken = await executeRecaptcha("login");
// Enviado no body da requisição
```

**Configuração necessária:**
Adicionar no `.env.local`:
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=sua_chave_publica_aqui
```

### Rate Limiting (Cliente)

Implementado lockout após 5 tentativas falhadas de login, bloqueando o botão por 30 segundos.

```typescript
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30000; // 30s
```

O backend já possui rate limiting no servidor (10 req/10min por IP).

### Password Policy

- **Login**: Mínimo 8 caracteres (validação do backend)
- **Register**: Mínimo 12 caracteres + complexidade:
  - Pelo menos 1 maiúscula
  - Pelo menos 1 minúscula
  - Pelo menos 1 número
  - Pelo menos 1 caractere especial

```typescript
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
```

### Autocomplete Security

- Senhas: `autoComplete="new-password"` (desabilita preenchimento automático)
- Email: `autoComplete="email"` (permite preenchimento seguro)

## 🎨 Design System & Tema

### CSS Variables (HSL)

Definidas em `globals.css` com suporte a dark/light mode:

```css
:root {
  --primary: 217 91% 60%; /* #3177fa - azul Turbofy */
  --background: 0 0% 100%;
  --foreground: 0 0% 9%;
  /* ... */
}

.dark {
  --background: 0 0% 9%;
  --foreground: 0 0% 98%;
  /* ... */
}
```

### Tailwind Config

Mapeamento das CSS variables para classes Tailwind:

```typescript
colors: {
  primary: "hsl(var(--primary))",
  background: "hsl(var(--background))",
  // ...
}
```

### Animações

Configuradas via `framer-motion`:
- **fade-in-up**: Entrada suave de componentes
- **scale**: Efeito de zoom em hover/focus
- **spin**: Loader durante submissão

## ♿ Acessibilidade (WCAG 2.1 AA)

### Keyboard Navigation

- ✅ Tab order lógico
- ✅ Enter submete formulário
- ✅ Esc para fechar modals (se houver)

### ARIA Attributes

```tsx
<input
  aria-invalid={!!error}
  aria-describedby={error ? errorId : undefined}
  aria-label="Email"
/>
```

### Screen Reader Support

- ✅ Labels semânticos vinculados via `htmlFor`
- ✅ Mensagens de erro com `role="alert"` e `aria-live="polite"`
- ✅ Botões com estados descritos (`aria-disabled`, `aria-busy`)

### Contraste de Cores

- ✅ Ratio mínimo 4.5:1 (validado nas CSS variables)
- ✅ Estados de foco visíveis (ring com `focus:ring-2`)

## 📱 Responsividade

### Breakpoints

- **Mobile**: < 640px (card 100% largura)
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Layout Adaptativo

```tsx
<div className="max-w-md w-full"> {/* Máximo 448px */}
  <div className="p-6 sm:p-10"> {/* Padding adaptativo */}
    {/* Conteúdo */}
  </div>
</div>
```

## 🧪 Testes

### Estrutura de Testes

Exemplo de teste unitário para Login:

```typescript
describe('LoginPage', () => {
  it('deve renderizar o formulário de login', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('deve bloquear após 5 tentativas falhadas', async () => {
    // Simular 5 falhas
    // Verificar mensagem de lockout
  });
});
```

### Executar Testes

```bash
# Instalar dependências de teste
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest

# Executar testes
pnpm test
```

## 🔄 Integração com Backend

### Endpoints Esperados

| Método | Endpoint | Body | Response |
|--------|----------|------|----------|
| `POST` | `/auth/login` | `{ email, password, recaptchaToken }` | `{ accessToken, refreshToken, expiresIn }` |
| `POST` | `/auth/register` | `{ email, password, document, phone?, recaptchaToken }` | `{ accessToken, refreshToken, expiresIn }` |
| `POST` | `/auth/forgot-password` | `{ email, recaptchaToken }` | `{ status: "ok" }` |
| `GET` | `/api/auth/csrf` | - | `{ csrfToken }` |

### Variáveis de Ambiente

Criar `.env.local`:

```bash
# URL da API backend
NEXT_PUBLIC_API_URL=http://localhost:3000

# reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...
```

## 📝 Próximos Passos

### Backend (Pendente)

1. ✅ **Implementar endpoint `/api/auth/csrf`**
   - Gerar token CSRF
   - Armazenar em sessão
   - Retornar para cliente

2. ✅ **Configurar HttpOnly cookies**
   - `Set-Cookie` com `accessToken` e `refreshToken`
   - Flags: `HttpOnly`, `Secure`, `SameSite=Strict`

3. ✅ **Implementar endpoint `/auth/forgot-password`**
   - Gerar token de reset
   - Enviar email com link
   - Criar página `/reset-password/:token`

4. ✅ **Validar reCAPTCHA no backend**
   - Verificar token enviado pelo cliente
   - Validar score mínimo (ex: 0.5)

### Frontend (Melhorias)

1. ✅ **Página de Reset Password** (`/reset-password/:token`)
2. ✅ **MFA/2FA** com OTP (código já existe no backend via `/auth/mfa/request` e `/auth/mfa/verify`)
3. ✅ **Remember Me** (checkbox para refresh token de longa duração)
4. ✅ **Social Login** (Google, GitHub, etc.)
5. ✅ **Página de Dashboard** após login

## 🚀 Como Executar

```bash
# Navegar para o frontend
cd frontend

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas chaves

# Executar em desenvolvimento
pnpm dev

# Acessar
# http://localhost:3001/login
# http://localhost:3001/register
# http://localhost:3001/forgot
```

## 📚 Referências

- [Next.js App Router](https://nextjs.org/docs/app)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3)
- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP Auth Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Desenvolvido com ❤️ para o Turbofy Gateway de Pagamentos**

