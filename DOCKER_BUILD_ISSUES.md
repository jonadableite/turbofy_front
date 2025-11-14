# 🐳 Problemas de Build Docker - Troubleshooting

## Erro: TLS handshake timeout ao baixar imagem base

### Erro Comum
```
ERROR: failed to build: failed to solve: node:20-alpine: failed to resolve source metadata 
for docker.io/library/node:20-alpine: failed to do request: 
Head "https://registry-1.docker.io/v2/library/node/manifests/20-alpine": 
net/http: TLS handshake timeout
```

### Causas Possíveis

1. **Problema temporário de rede** - Docker Hub pode estar sobrecarregado
2. **Firewall/Proxy bloqueando** - Servidor pode ter restrições de rede
3. **Timeout de conexão** - Rede lenta ou instável
4. **Docker Hub indisponível** - Problemas no registry

### Soluções

#### 1. Tentar Novamente
O problema pode ser temporário. Tente fazer o deploy novamente após alguns minutos.

#### 2. Configurar Retry no Easypanel
Se o Easypanel suportar, configure retry automático para builds.

#### 3. Usar Mirror Registry (se disponível)
Se o Easypanel tiver um mirror do Docker Hub configurado, ele será usado automaticamente.

#### 4. Verificar Configurações de Rede
- Verifique se o servidor Easypanel tem acesso à internet
- Verifique se há firewall bloqueando conexões HTTPS
- Verifique se há proxy configurado

#### 5. Usar Imagem Alternativa (Último Recurso)
Se o problema persistir, podemos usar uma imagem alternativa:

```dockerfile
# Alternativa: usar imagem do GitHub Container Registry
FROM ghcr.io/node:20-alpine AS builder
```

Ou usar uma versão específica com hash:

```dockerfile
FROM node:20-alpine@sha256:... AS builder
```

### Otimizações Aplicadas

O Dockerfile foi otimizado para:
- ✅ Melhor uso de cache de camadas
- ✅ Instalação de dependências antes de copiar código
- ✅ Uso de `--frozen-lockfile` para builds mais rápidos e consistentes
- ✅ Redução de camadas desnecessárias

### Próximos Passos

1. **Aguardar alguns minutos** e tentar o deploy novamente
2. **Verificar logs do Easypanel** para mais detalhes
3. **Contatar suporte do Easypanel** se o problema persistir
4. **Verificar status do Docker Hub**: https://status.docker.com/

---

**Última atualização**: Novembro 2024

