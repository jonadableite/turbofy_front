# 🚀 Guia de Deploy no Easypanel - Turbofy Frontend

## 📋 Checklist de Configuração

### 1. Configuração de DNS

O erro `DNS_PROBE_FINISHED_NXDOMAIN` indica que o domínio não está configurado corretamente.

**Passos para configurar o domínio:**

1. **No seu provedor de DNS** (onde você comprou o domínio `turbofypay.com`):
   - Adicione um registro **A** apontando para o IP do servidor Easypanel
   - Ou adicione um registro **CNAME** apontando para o domínio fornecido pelo Easypanel
   - Exemplo:
     ```
     Tipo: A
     Nome: @ (ou turbofypay.com)
     Valor: [IP do servidor Easypanel]
     TTL: 3600
     ```

2. **No Easypanel:**
   - Vá em **Settings** → **Domains**
   - Adicione o domínio `turbofypay.com`
   - Configure o SSL/TLS (certificado Let's Encrypt automático)
   - Configure o proxy reverso para a porta **3131**

### 2. Configuração do Serviço no Easypanel

#### Variáveis de Ambiente
Configure as seguintes variáveis de ambiente no Easypanel:

```bash
NODE_ENV=production
PORT=3131
HOSTNAME=0.0.0.0
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_API_URL=https://api.turbofypay.com  # Ajuste conforme seu backend
```

#### Porta e Healthcheck
- **Porta interna**: `3131`
- **Healthcheck path**: `/healthz`
- **Healthcheck port**: `3131`

#### Configuração de Proxy Reverso (Nginx/Traefik)
Se o Easypanel usar proxy reverso, configure:

```nginx
location / {
    proxy_pass http://localhost:3131;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

### 3. Verificação de DNS

Para verificar se o DNS está configurado corretamente:

```bash
# Verificar resolução DNS
nslookup turbofypay.com
# ou
dig turbofypay.com

# Verificar propagação DNS (pode levar até 48h)
# Use: https://www.whatsmydns.net/
```

### 4. Troubleshooting

#### Problema: DNS_PROBE_FINISHED_NXDOMAIN
**Causa**: Domínio não está resolvendo para um IP válido

**Soluções**:
1. Verifique se o registro DNS foi criado corretamente
2. Aguarde a propagação DNS (pode levar algumas horas)
3. Verifique se o domínio está configurado no Easypanel
4. Verifique se o SSL está configurado corretamente

#### Problema: Site não carrega (timeout)
**Causa**: Servidor não está acessível ou porta incorreta

**Soluções**:
1. Verifique os logs do container no Easypanel
2. Verifique se a porta 3131 está exposta corretamente
3. Verifique se o proxy reverso está configurado
4. Teste acessar diretamente pelo IP: `http://[IP]:3131`

#### Problema: 502 Bad Gateway
**Causa**: Proxy reverso não consegue conectar ao container

**Soluções**:
1. Verifique se o container está rodando
2. Verifique se o healthcheck está passando
3. Verifique se a porta interna está correta (3131)
4. Verifique os logs do container

### 5. Testes Pós-Deploy

Após configurar tudo, teste:

1. **Acesso HTTP/HTTPS**:
   ```bash
   curl -I https://turbofypay.com
   ```

2. **Healthcheck**:
   ```bash
   curl https://turbofypay.com/healthz
   # Deve retornar: {"status":"ok"}
   ```

3. **Página principal**:
   - Abra no navegador: `https://turbofypay.com`
   - Deve carregar a página inicial

### 6. Configuração de SSL

O Easypanel geralmente configura SSL automaticamente com Let's Encrypt:

1. Certifique-se de que o domínio está apontando corretamente
2. Ative SSL/TLS no Easypanel
3. Aguarde a geração do certificado (pode levar alguns minutos)
4. Force HTTPS redirecionando HTTP para HTTPS

### 7. Variáveis de Ambiente Importantes

```bash
# Produção
NODE_ENV=production
PORT=3131
HOSTNAME=0.0.0.0

# API Backend (ajuste conforme necessário)
NEXT_PUBLIC_API_URL=https://api.turbofypay.com

# Desabilitar telemetria
NEXT_TELEMETRY_DISABLED=1
```

## 📝 Notas Importantes

- O DNS pode levar até **48 horas** para propagar completamente
- Use ferramentas como [whatsmydns.net](https://www.whatsmydns.net/) para verificar propagação
- Certifique-se de que o firewall permite conexões na porta 3131
- O healthcheck precisa de pelo menos 40 segundos para passar após o deploy

## 🔗 Links Úteis

- [Easypanel Documentation](https://easypanel.io/docs)
- [DNS Propagation Checker](https://www.whatsmydns.net/)
- [SSL Test](https://www.ssllabs.com/ssltest/)

---

**Última atualização**: Novembro 2024

