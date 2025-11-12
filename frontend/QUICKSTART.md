# 🚀 Quickstart - Autenticação Turbofy

## ⚡ Início Rápido (5 minutos)

### 1. Instalar Dependências

```bash
cd frontend
pnpm install
```

### 2. Configurar Ambiente

Crie `.env.local`:

```bash
# Copiar exemplo
cp ENV_EXAMPLE.md .env.local

# Editar com suas chaves
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc... # Obter em https://www.google.com/recaptcha/admin
```

### 3. Executar

```bash
pnpm dev
```

### 4. Acessar

- 🔐 Login: http://localhost:3001/login
- 📝 Registro: http://localhost:3001/register  
- 🔑 Recuperar Senha: http://localhost:3001/forgot

## 🎨 Testar Funcionalidades

### Login
1. Acesse http://localhost:3001/login
2. Digite um email válido
3. Digite uma senha (mínimo 8 caracteres)
4. Clique em "Entrar"
5. **Teste Rate Limiting**: Tente falhar 5 vezes e veja o bloqueio de 30s
6. **Teste Tema**: Clique no ícone de sol/lua no canto superior direito

### Registro
1. Acesse http://localhost:3001/register
2. Preencha todos os campos:
   - Email válido
   - CPF/CNPJ (ex: `12345678901`)
   - Telefone (opcional, ex: `11999999999`)
   - Senha forte (mínimo 12 chars, veja o medidor de força!)
   - Confirme a senha
3. **Observe o Medidor de Força de Senha** enquanto digita
4. Clique em "Criar conta"

### Recuperar Senha
1. Acesse http://localhost:3001/forgot
2. Digite seu email
3. Clique em "Enviar link de recuperação"
4. Veja a mensagem de confirmação com animação ✅

## 🔍 Testar Validações

### Validação de Email
- ❌ Tente: `email_invalido` → Erro
- ✅ Correto: `usuario@exemplo.com`

### Validação de Senha (Login)
- ❌ Tente: `123` → Erro (mínimo 8 chars)
- ✅ Correto: `senha123`

### Validação de Senha (Registro)
- ❌ Tente: `senha123` → Erro (sem maiúscula, sem especial)
- ❌ Tente: `Senha123` → Erro (sem caractere especial)
- ✅ Correto: `Senha123!@#`

### Validação de CPF/CNPJ
- ❌ Tente: `123` → Erro (inválido)
- ✅ Correto: `12345678901` (11 dígitos para CPF)
- ✅ Correto: `12345678000190` (14 dígitos para CNPJ)

## 🎨 Testar Tema Dark/Light

1. Clique no botão de tema no canto superior direito
2. Veja a transição suave entre modos
3. As cores devem mudar automaticamente
4. O ícone deve trocar entre sol (light) e lua (dark)

## 🔐 Testar Segurança

### Rate Limiting
1. Na página de login, digite credenciais incorretas
2. Clique em "Entrar" 5 vezes seguidas
3. No 5º erro, o botão deve bloquear por 30 segundos
4. Contador regressivo deve aparecer: "Aguarde 30s"

### reCAPTCHA
- reCAPTCHA v3 roda automaticamente em background
- Você verá o badge do reCAPTCHA no canto inferior direito
- Não há desafio visual (v3 é invisível)

## 📱 Testar Responsividade

### Desktop (> 1024px)
- Card centralizado com largura máxima
- Espaçamento generoso
- Logo e tema visíveis

### Tablet (640px - 1024px)
- Card adaptado com padding menor
- Layout mantém-se centralizado

### Mobile (< 640px)
- Card usa largura total (com margens)
- Padding reduzido
- Logo do Turbofy pode ficar oculto

**Como testar:**
1. Abra DevTools (F12)
2. Ative o modo responsivo (Ctrl+Shift+M)
3. Teste em diferentes resoluções

## ♿ Testar Acessibilidade

### Navegação por Teclado
1. Use `Tab` para navegar entre campos
2. Use `Enter` para submeter
3. Use `Shift+Tab` para voltar

### Screen Reader
1. Ative um screen reader (ex: NVDA no Windows)
2. Navegue pela página
3. Todos os campos devem ser anunciados corretamente
4. Mensagens de erro devem ser lidas ao aparecer

### Foco Visual
- Ao usar `Tab`, deve haver um outline azul visível
- Estados de hover devem ser distintos
- Cores devem ter contraste adequado

## 🐛 Troubleshooting

### Erro: "reCAPTCHA not ready yet"
**Solução:** Adicione a chave `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` no `.env.local`

### Erro: "Failed to fetch CSRF token"
**Solução:** Isso é esperado! O endpoint `/api/auth/csrf` ainda precisa ser implementado no backend. O sistema continua funcionando sem ele por enquanto.

### Backend não responde
**Solução:**
1. Verifique se o backend está rodando: `cd backend && pnpm dev`
2. Confirme a porta no `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:3000`

### Tema não muda
**Solução:**
1. Limpe o cache do navegador
2. Verifique o console para erros
3. Certifique-se de que `next-themes` está instalado: `pnpm list next-themes`

## 📸 Screenshots Esperados

### Login (Light Mode)
- Card branco centralizado
- Fundo gradiente sutil
- Botão azul (#3177fa)
- Toggle de tema no canto superior direito

### Login (Dark Mode)
- Card escuro (#0a0a0a)
- Fundo preto
- Texto claro
- Cores mantêm contraste

### Registro com Medidor de Senha
- Campo de senha preenchido
- Barra de força colorida (vermelho → verde)
- Sugestões de melhoria abaixo
- Label "Força da senha: Forte"

### Erro de Validação
- Campo com borda vermelha
- Mensagem de erro abaixo em vermelho
- Ícone de alerta (se aplicável)

### Rate Limiting
- Botão desabilitado
- Texto: "Aguarde 30s"
- Contador regressivo

## ✅ Checklist de Teste

Marque conforme testa:

- [ ] Login renderiza corretamente
- [ ] Validação de email funciona
- [ ] Validação de senha funciona
- [ ] Rate limiting bloqueia após 5 tentativas
- [ ] Tema dark/light alterna corretamente
- [ ] Registro renderiza com todos os campos
- [ ] Medidor de força de senha funciona
- [ ] Validação de CPF/CNPJ funciona
- [ ] Confirmação de senha valida
- [ ] Recuperar senha mostra tela de sucesso
- [ ] Navegação por teclado funciona
- [ ] Responsividade funciona em mobile
- [ ] Animações são suaves
- [ ] Links de navegação funcionam

## 🎓 Próximos Passos

Depois de testar:

1. Leia `AUTH_IMPLEMENTATION.md` para entender a arquitetura
2. Leia `README_AUTH.md` para ver próximas features
3. Configure o backend para integração completa
4. Implemente os endpoints pendentes (CSRF, forgot password)

---

**Pronto para produção?** Não esqueça de:
- ✅ Configurar reCAPTCHA v3 em produção
- ✅ Usar HTTPS
- ✅ Configurar CORS adequadamente
- ✅ Implementar rate limiting no backend
- ✅ Validar reCAPTCHA no servidor

