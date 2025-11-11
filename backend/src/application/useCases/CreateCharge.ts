// 📦 APPLICATION: Use case to create a Charge with full business orchestration
// 🔐 SECURITY: All inputs must be validated before reaching this layer (HTTP schemas)
// 🛠️ MAINTAINABILITY: Follows Clean Architecture – ports injected via constructor
// 🧪 TESTABILITY: Pure class, collaborators mocked in unit tests
// 🔄 EXTENSIBILITY: Easy to add new payment methods (Pix, Boleto, CreditCard, etc.)

import {
  Charge,
  ChargeMethod,
  ChargeStatus,
} from "../../domain/entities/Charge";
import { ChargeRepository } from "../../ports/ChargeRepository";
import { PaymentProviderPort } from "../../ports/PaymentProviderPort";
import { MessagingPort } from "../../ports/MessagingPort";
import { randomUUID } from "crypto";
import { logger } from "../../infrastructure/logger";

interface CreateChargeInput {
  idempotencyKey: string;
  merchantId: string;
  amountCents: number;
  currency: string;
  description?: string;
  method?: ChargeMethod;
  expiresAt?: Date;
  externalRef?: string;
  metadata?: Record<string, unknown>;
}

interface CreateChargeOutput {
  charge: Charge;
}

export class CreateCharge {
  constructor(
    private readonly chargeRepository: ChargeRepository,
    private readonly paymentProvider: PaymentProviderPort,
    private readonly messaging: MessagingPort
  ) {}

  async execute(input: CreateChargeInput): Promise<CreateChargeOutput> {
    // 1. Idempotency check
    const existing = await this.chargeRepository.findByIdempotencyKey(
      input.idempotencyKey
    );
    if (existing) {
      logger.info(
        {
          useCase: "CreateCharge",
          message: "Idempotent request – returning existing charge",
          idempotencyKey: input.idempotencyKey,
        },
        "Idempotent hit"
      );
      return { charge: existing };
    }

    // 2. Build domain entity
    const charge = new Charge({
      id: randomUUID(),
      merchantId: input.merchantId,
      amountCents: input.amountCents,
      currency: input.currency,
      description: input.description,
      status: ChargeStatus.PENDING,
      method: input.method,
      expiresAt: input.expiresAt,
      idempotencyKey: input.idempotencyKey,
      externalRef: input.externalRef,
      metadata: input.metadata,
    });

    // 3. Persist initial charge
    let persisted = await this.chargeRepository.create(charge);

    // 4. Emit payment via provider depending on method
    if (persisted.method === ChargeMethod.PIX) {
      const pixData = await this.paymentProvider.issuePixCharge({
        amountCents: persisted.amountCents,
        merchantId: persisted.merchantId,
        description: persisted.description,
        expiresAt: persisted.expiresAt ?? undefined,
      });
      persisted = persisted.withPixData(pixData.qrCode, pixData.copyPaste);
    } else if (persisted.method === ChargeMethod.BOLETO) {
      const boletoData = await this.paymentProvider.issueBoletoCharge({
        amountCents: persisted.amountCents,
        merchantId: persisted.merchantId,
        description: persisted.description,
        expiresAt: persisted.expiresAt ?? undefined,
      });
      persisted = persisted.withBoletoData(boletoData.boletoUrl);
    }

    // 5. Update persisted charge with payment data (if any)
    if (persisted.pixQrCode || persisted.boletoUrl) {
      persisted = await this.chargeRepository.update(persisted);
    }

    // 6. Publish event (structured, idempotent)
    await this.messaging.publish({
      id: randomUUID(),
      type: "charge.created",
      timestamp: new Date().toISOString(),
      version: "v1",
      traceId: input.idempotencyKey,
      idempotencyKey: input.idempotencyKey,
      routingKey: "turbofy.payments.charge.created",
      payload: {
        id: persisted.id,
        merchantId: persisted.merchantId,
        amountCents: persisted.amountCents,
        currency: persisted.currency,
        status: persisted.status,
        method: persisted.method,
        createdAt: persisted.createdAt.toISOString(),
      },
    });

    return { charge: persisted };
  }
}
