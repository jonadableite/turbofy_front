Turbofy — Regras do Projeto e Guia de Engenharia

**Propósito**

- Construir um gateway de pagamentos SaaS com Dashboard intuítivo e seguro.
- Suportar criação de cobranças, relatórios/extratos, gestão de chaves Pix/boletos e acompanhamento de taxas.
- Garantir split de pagamentos, repasses e conciliação bancária automática.

**Princípios de Engenharia**

- SOLID, Clean Code, arquitetura Hexagonal, design orientado ao domínio.
- TypeScript com `strict` e type-safe; evitar `any` e casts inseguros.
- Idempotência em operações financeiras e tolerância a falhas.
- Observabilidade: logs estruturados, métricas, traços e auditoria.
- Segurança e privacidade: LGPD by design, segregação de dados e mínima exposição.

**Stack e Escopo**

- Backend: Node.js + TypeScript, PostgreSQL com Prisma ORM, RabbitMQ para eventos.
- Infra: IaC com SST (stacks por ambiente: `dev`, `staging`, `prod`).
- Frontend: React + Next.js (App Router), TailwindCSS, shadcn/ui, ui.aceternity, Magic UI.
- Conta PJ em instituição financeira para recebimento e repasses.

**Estrutura do Repositório (atual)**

- `backend/src/domain` entidades e regras de negócio.
- `backend/src/application` casos de uso e orquestração.
- `backend/src/ports` interfaces (ports) para serviços externos.
- `backend/src/infrastructure` implementações de adapters: DB, MQ, HTTP, integrações.
- `frontend/src/app` páginas e layouts do Dashboard.

**Arquitetura Hexagonal (Back-end)**

- Domain: entidades e serviços de domínio (`Charge`, `SplitRule`, `Settlement`, `Reconciliation`, `PixKey`, `Boleto`, `Fee`).
- Application: casos de uso (`CreateCharge`, `ApplySplit`, `CapturePayment`, `ScheduleSettlement`, `RunReconciliation`, `RegisterPixKey`, `GenerateBoleto`).
- Ports: interfaces (`PaymentProviderPort`, `BankingPort`, `MessagingPort`, `ChargeRepository`, `SettlementRepository`, `ReconciliationRepository`).
- Infrastructure: adapters (`PrismaChargeRepository`, `RabbitMQMessagingAdapter`, `HTTPController`, `BankingAdapter`).

**Fluxos Financeiros Essenciais**

- Criação de cobrança: validação, persistência, emissão (Pix/Boleto), idempotência por `idempotencyKey`.
- Split de pagamentos: regras por percentual/valor, prioridades e limites; registrar distribuição de taxas.
- Repasses (payout): cálculo de saldo, agendamento e execução via conta PJ; auditoria completa.
- Conciliação automática: ingestão de extratos, matching por `referenceId`, estados de reconciliação, reprocessos.

**Mensageria (RabbitMQ)**

- Exchanges (topic): `turbofy.payments`, `turbofy.billing`, `turbofy.reconciliation`.
- Chaves de roteamento: `charge.created`, `charge.paid`, `settlement.requested`, `settlement.completed`, `reconciliation.started`, `reconciliation.completed`.
- Mensagens JSON com campos: `id`, `type`, `timestamp`, `version`, `traceId`, `idempotencyKey`, `payload` (tipado via schemas).
- Garantias: filas duráveis, confirm channels, reentrega com backoff, DLQ por tipo.
- Prefetch controlado e consumidores idempotentes; deduplicação por `idempotencyKey`.

**Banco de Dados (PostgreSQL + Prisma)**

- Montante em unidade mínima (`amount_cents`), `currency = 'BRL'`.
- Identificadores UUID; índices únicos para chaves de negócio (`external_ref`, `idempotency_key`).
- Tabelas principais: `charges`, `charge_splits`, `settlements`, `reconciliations`, `pix_keys`, `boletos`, `fees`, `audit_logs`.
- Migrações versionadas; seed apenas para ambientes não produtivos.
- Integridade referencial e constraints; evitar cascatas destrutivas.

**Back-end: Convenções e Boas Práticas**

- Controladores finos; lógica em casos de uso. Não acoplar infra ao domínio.
- Validação de entrada com schemas (ex.: zod) e mapeamento para DTOs.
- Erros: tipos específicos (`DomainError`, `ValidationError`, `InfrastructureError`), mapeamento para HTTP.
- Idempotência: header `Idempotency-Key` e persistência de chave/resultado; proteger contra duplicidade.
- Logs estruturados: incluir `traceId`, `useCase`, `entityId`, nível (`info`, `warn`, `error`).
- Testes: unitários no domínio, integração com Prisma/RabbitMQ (testcontainers), e2e para APIs críticas.

**Frontend (Dashboard SaaS)**

- Next.js App Router, roteamento segmentado por área: `cobranças`, `relatórios`, `pix-e-boletos`, `taxas`.
- shadcn/ui para componentes base; Tailwind como utilitário; ui.aceternity e Magic UI para microinterações.
- Formulários com `react-hook-form` + `zod`; feedbacks claros e acessíveis.
- Data fetching: `useSWR`/server actions; schemas para dados; estados de carregamento/erro padronizados.
- Tabelas com paginação/filtragem; gráficos para receitas, taxas, repasses; export de relatórios.

**Segurança e Compliance**

- LGPD: minimização de dados, consentimento quando aplicável, direito de acesso/remoção.
- Segredos e chaves em armazenamento seguro (SST Secrets/Parameter Store); jamais em repositório.
- Criptografia em repouso (RDS) e em trânsito (TLS); assinar webhooks.
- Rate limiting e proteção anti-fraude; validação forte de entradas.
- Auditoria: trilhas de auditoria para ações críticas (criar/alterar cobranças, repasses, chaves Pix).
- Backups e plano de recuperação; retenção conforme exigência legal.

**IaC com SST**

- Stacks por domínio: `core` (VPC, secrets), `data` (Postgres), `mq` (RabbitMQ), `api` (lambda/API gateway ou ECS), `frontend` (Next.js em edge/Lambda).
- Nomenclatura: `turbofy-<stack>-<env>`; tags de recursos para rastreabilidade (`project=Turbofy`, `env`).
- Variáveis de ambiente prefixadas `TURBOFY_...`; segregação por ambiente.
- Deploys com gates de qualidade (type-check, lint, testes, migrações dry-run).

**Observabilidade**

- OpenTelemetry com export de traces/metrics/logs (sempre `traceId`).
- Dashboards para latência, throughput, erros, tempo de reconciliação e sucesso de repasses.
- Alertas por SLOs (ex.: falhas em `settlement.completed`, atraso de conciliação > X horas).

**Convenções de Código, Git e PR**

- TypeScript `strict`; sem `any`; nomes descritivos; funções pequenas.
- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`); PRs pequenos e focados.
- Branches: `main`, `develop`; feature branches `feat/<area>/<resumo>`.
- Revisão obrigatória; checklists de testes e segurança; proibir merges sem aprovação.

**Qualidade e Gates**

- Obrigatório: type-check, lint, testes (unit/integration), cobertura mínima para domínio.
- Segurança: verificação de dependências, secrets, linters de IaC.
- Build e deploy travam se algum gate falhar; sem exceções em `prod`.

**Regras para Agentes (Trae e Cursor)**

- Manter mudanças cirúrgicas e coerentes com a arquitetura hexagonal.
- Criar tarefas quando a atividade tiver várias etapas; atualizar status conforme avanço.
- Editar arquivos de forma estruturada; evitar mudanças manuais sem rastreabilidade.
- Para mudanças de UI, validar visualmente no ambiente de desenvolvimento antes de concluir.
- Não modificar áreas não relacionadas; quando necessário, documentar a razão com clareza.
- Priorizar correção na causa raiz e código simples; evitar over-engineering.
- Seguir convenções de commits/PR e padrões de qualidade antes de abrir merge.

**Nomes e Padrões**

- Prefixos: `TURBOFY_` para env vars; exchanges/filas `turbofy.*`.
- Entidades de domínio com nomes claros; evitar abreviações obscuras.
- IDs como UUID v4; referências externas com campos dedicados (`external_ref`).

**Próximos Passos Sugeridos**

- Definir schemas iniciais de domínio e eventos.
- Mapear integrações bancárias para conta PJ e webhooks.
- Planejar migrações de banco e filas por ambiente via SST.

**Numca faça**

- Evite sempre usar any
- Numca crie codigos basicos sempre crie codigos completos e profissionais
