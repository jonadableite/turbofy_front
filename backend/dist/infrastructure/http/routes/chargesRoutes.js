"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chargesRouter = void 0;
const express_1 = require("express");
const charges_1 = require("../schemas/charges");
const zod_1 = require("zod");
const PrismaChargeRepository_1 = require("../../database/PrismaChargeRepository");
const StubPaymentProviderAdapter_1 = require("../../adapters/payment/StubPaymentProviderAdapter");
const InMemoryMessagingAdapter_1 = require("../../adapters/messaging/InMemoryMessagingAdapter");
const CreateCharge_1 = require("../../../application/useCases/CreateCharge");
const logger_1 = require("../../logger");
const Charge_1 = require("../../../domain/entities/Charge");
exports.chargesRouter = (0, express_1.Router)();
// Middleware de idempotência
exports.chargesRouter.use((req, res, next) => {
    const idemKey = req.header("X-Idempotency-Key");
    if (!idemKey) {
        return res.status(400).json({ error: { code: "IDEMPOTENCY_KEY_MISSING", message: "Header X-Idempotency-Key é obrigatório" } });
    }
    next();
});
exports.chargesRouter.post("/", async (req, res) => {
    try {
        const parsed = charges_1.CreateChargeRequestSchema.parse(req.body);
        // Cria instâncias dos adapters (em produção usar DI/container)
        const chargeRepository = new PrismaChargeRepository_1.PrismaChargeRepository();
        const paymentProvider = new StubPaymentProviderAdapter_1.StubPaymentProviderAdapter();
        const messaging = new InMemoryMessagingAdapter_1.InMemoryMessagingAdapter();
        const useCase = new CreateCharge_1.CreateCharge(chargeRepository, paymentProvider, messaging);
        // Map method string to domain enum (type-safe)
        const methodEnum = parsed.method
            ? (parsed.method === "PIX" ? Charge_1.ChargeMethod.PIX : Charge_1.ChargeMethod.BOLETO)
            : undefined;
        const { charge } = await useCase.execute({
            idempotencyKey: req.header("X-Idempotency-Key"),
            merchantId: parsed.merchantId,
            amountCents: parsed.amountCents,
            currency: parsed.currency,
            description: parsed.description,
            method: methodEnum,
            expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : undefined,
            externalRef: parsed.externalRef,
            metadata: parsed.metadata,
        });
        const response = charges_1.CreateChargeResponseSchema.parse({
            id: charge.id,
            merchantId: charge.merchantId,
            amountCents: charge.amountCents,
            currency: charge.currency,
            description: charge.description ?? null,
            status: charge.status,
            method: charge.method ?? null,
            expiresAt: charge.expiresAt ? charge.expiresAt.toISOString() : null,
            idempotencyKey: charge.idempotencyKey,
            externalRef: charge.externalRef ?? null,
            metadata: charge.metadata ?? null,
            pix: charge.pixQrCode ? { qrCode: charge.pixQrCode, copyPaste: charge.pixCopyPaste, expiresAt: (charge.expiresAt ?? new Date()).toISOString() } : undefined,
            boleto: charge.boletoUrl ? { boletoUrl: charge.boletoUrl, expiresAt: (charge.expiresAt ?? new Date()).toISOString() } : undefined,
            createdAt: charge.createdAt.toISOString(),
            updatedAt: charge.updatedAt.toISOString(),
        });
        res.status(201).json(response);
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message, details: err.flatten() } });
        }
        logger_1.logger.error({ err }, "Erro inesperado no POST /charges");
        res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Erro interno" } });
    }
});
