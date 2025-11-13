# Integração com Transfeera

Este documento descreve a integração do Turbofy Gateway com a API da Transfeera para processamento de pagamentos Pix e Boletos.

## Configuração

### Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# Habilitar/desabilitar Transfeera
TRANSFEERA_ENABLED=true

# Credenciais da Transfeera (obtidas na plataforma)
TRANSFEERA_CLIENT_ID=seu_client_id_aqui
TRANSFEERA_CLIENT_SECRET=seu_client_secret_aqui

# URLs da API (sandbox por padrão)
TRANSFEERA_API_URL=https://api-sandbox.transfeera.com
TRANSFEERA_LOGIN_URL=https://login-api-sandbox.transfeera.com

# Chave Pix registrada na Transfeera para recebimentos
TRANSFEERA_PIX_KEY=email@exemplo.com
```

### Ambiente Sandbox

1. Acesse https://app-sandbox.transfeera.com
2. Faça login com as credenciais fornecidas por email
3. Acesse **Minha Conta** > **Credenciais de APIs**
4. Copie o `Client ID` e `Client Secret`
5. Configure as variáveis de ambiente acima

### Ambiente Produção

1. Entre em contato com o suporte da Transfeera para habilitar produção
2. Informe o IP de saída da sua máquina/servidor
3. Acesse https://app.transfeera.com
4. Gere novas credenciais em produção
5. Atualize as variáveis de ambiente:
   ```env
   TRANSFEERA_API_URL=https://api.mtls.transfeera.com
   TRANSFEERA_LOGIN_URL=https://login-api.mtls.transfeera.com
   ```

## Arquitetura

A integração segue a arquitetura hexagonal do Turbofy:

```
┌─────────────────────────────────────────┐
│         Application Layer               │
│  (CreateCharge use case)                │
└──────────────┬──────────────────────────┘
               │
               │ PaymentProviderPort (interface)
               │
┌──────────────▼──────────────────────────┐
│      Infrastructure Layer                │
│  ┌────────────────────────────────────┐ │
│  │ PaymentProviderFactory              │ │
│  │  - Escolhe adapter baseado em env  │ │
│  └──────────┬─────────────────────────┘ │
│             │                           │
│  ┌──────────▼─────────────────────────┐ │
│  │ TransfeeraPaymentProviderAdapter   │ │
│  │  - Implementa PaymentProviderPort   │ │
│  └──────────┬─────────────────────────┘ │
│             │                           │
│  ┌──────────▼─────────────────────────┐ │
│  │ TransfeeraClient                   │ │
│  │  - Cliente HTTP                     │ │
│  │  - Autenticação OAuth2              │ │
│  │  - Cache de token                   │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

## Componentes

### TransfeeraClient

Cliente HTTP que gerencia:
- Autenticação OAuth2 com `client_credentials`
- Cache de token de acesso (renovação automática)
- Requisições para todos os endpoints da Transfeera

**Métodos principais:**
- `createPixKey()` - Criar chave Pix
- `createStaticQrCode()` - Criar QR Code estático
- `createImmediateCharge()` - Criar cobrança imediata (Pix)
- `createDueDateCharge()` - Criar cobrança com vencimento (Boleto)
- `getBalance()` - Consultar saldo
- `getCashIn()` - Consultar Pix recebidos

### TransfeeraPaymentProviderAdapter

Adapter que implementa `PaymentProviderPort`:
- Converte valores de centavos para reais
- Gera `txid` único conforme especificação Transfeera
- Mapeia erros da Transfeera para erros do domínio

### PaymentProviderFactory

Factory que escolhe o adapter baseado em `TRANSFEERA_ENABLED`:
- `true` → `TransfeeraPaymentProviderAdapter`
- `false` → `StubPaymentProviderAdapter` (desenvolvimento)

## Webhooks

### Configuração

1. Configure a URL do webhook na plataforma Transfeera:
   ```
   https://seu-dominio.com/webhooks/transfeera
   ```

2. O endpoint aceita eventos:
   - `CashIn` - Pix recebido
   - `CashInRefund` - Devolução de Pix
   - `PixKey` - Atualização de chave Pix
   - `ChargeReceivable` - Atualização de recebível
   - `Payin` - Recebimento via cartão
   - `PaymentLink` - Atualização de link de pagamento

### Processamento

O webhook:
1. Recebe o evento da Transfeera
2. Responde imediatamente com `200 OK`
3. Processa o evento assincronamente
4. Atualiza a cobrança correspondente no banco

**Matching de cobranças:**
- Por `integration_id` (usado como `externalRef` na cobrança)
- Por `txid` (futuro - requer campo adicional no schema)

## Fluxo de Cobrança Pix

1. Cliente cria cobrança via `POST /charges`
2. `CreateCharge` use case é executado
3. `PaymentProviderFactory` cria `TransfeeraPaymentProviderAdapter`
4. Adapter chama `TransfeeraClient.createImmediateCharge()`
5. Cliente autentica (se necessário) e cria cobrança na Transfeera
6. QR Code e payload são retornados
7. Cobrança é salva no banco com dados do QR Code
8. Quando pagamento é recebido, Transfeera envia webhook
9. Webhook atualiza status da cobrança para `PAID`

## Fluxo de Cobrança Boleto

1. Similar ao Pix, mas usa `createDueDateCharge()`
2. Retorna QR Code Pix como alternativa (Transfeera usa Pix para boletos)
3. Em produção, considere usar endpoint específico de boletos

## Tratamento de Erros

Todos os erros da Transfeera são:
- Logados com contexto completo
- Convertidos para erros do domínio quando possível
- Retornados ao cliente com mensagem apropriada

## Testes

### Sandbox

Use os documentos e chaves de teste da Transfeera:
- Documentos: https://docs.transfeera.dev/reference/sandbox#documentos-para-testes
- Chaves Pix: https://docs.transfeera.dev/reference/sandbox#chaves-pix

### Exemplo de Requisição

```bash
curl -X POST http://localhost:3000/charges \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: test-123" \
  -d '{
    "merchantId": "uuid-do-merchant",
    "amountCents": 10000,
    "currency": "BRL",
    "method": "PIX",
    "description": "Teste de cobrança"
  }'
```

## Referências

- [Documentação Transfeera](https://docs.transfeera.dev/reference/endpoints)
- [Autenticação](https://docs.transfeera.dev/reference/autenticacao)
- [Webhooks](https://docs.transfeera.dev/reference/webhooks)

