# Variáveis de Ambiente - Backend Turbofy

## Variáveis Obrigatórias

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/turbofy

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# RabbitMQ
RABBITMQ_URI=amqp://localhost:5672

# SMTP (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_SENDER_EMAIL=noreply@turbofy.com
SMTP_AUTH_DISABLED=false
```

## Variáveis Opcionais (Novas)

```bash
# Google reCAPTCHA v3 Secret Key
# Obter em: https://www.google.com/recaptcha/admin
RECAPTCHA_SECRET_KEY=6Lc...your_secret_key_here

# URL do Frontend (para links de email)
FRONTEND_URL=http://localhost:3001

# CORS Origin (restringir em produção)
CORS_ORIGIN=http://localhost:3001

# Node Environment
NODE_ENV=development

# Porta do servidor
PORT=3000
```

## Como Configurar

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o `.env` com suas credenciais reais

3. **IMPORTANTE**: Nunca commite o arquivo `.env` com credenciais reais!

## reCAPTCHA v3

### Obter Chaves

1. Acesse: https://www.google.com/recaptcha/admin
2. Clique em "+" para criar um novo site
3. Escolha "reCAPTCHA v3"
4. Adicione os domínios:
   - `localhost` (desenvolvimento)
   - Seu domínio de produção
5. Copie a **Secret Key** e cole no `.env` como `RECAPTCHA_SECRET_KEY`

### Nota

- A **Site Key** (pública) vai no frontend como `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- A **Secret Key** (privada) vai no backend como `RECAPTCHA_SECRET_KEY`

## SMTP

### Gmail (Exemplo)

1. Ative "Acesso a app menos seguro" ou use "Senha de app"
2. Gere uma senha de app em: https://myaccount.google.com/apppasswords
3. Use:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=seu-email@gmail.com
   SMTP_PASSWORD=senha-de-app-gerada
   ```

### Desenvolvimento Local

Para desenvolvimento sem SMTP real, defina:
```bash
SMTP_AUTH_DISABLED=true
```

Os emails serão logados mas não enviados.

## Validação

O backend valida todas as variáveis obrigatórias na inicialização. Se alguma estiver faltando ou inválida, o servidor não iniciará.

---

**Desenvolvido com ❤️ para o Turbofy Gateway de Pagamentos**

