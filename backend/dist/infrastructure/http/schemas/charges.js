"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponseSchema = exports.CreateChargeResponseSchema = exports.BoletoPayloadSchema = exports.PixPayloadSchema = exports.CreateChargeRequestSchema = exports.ChargeStatusSchema = exports.ChargeMethodSchema = void 0;
const zod_1 = require("zod");
const Charge_1 = require("../../../domain/entities/Charge");
exports.ChargeMethodSchema = zod_1.z.nativeEnum(Charge_1.ChargeMethod);
exports.ChargeStatusSchema = zod_1.z.nativeEnum(Charge_1.ChargeStatus);
const SplitSchema = zod_1.z.object({
    merchantId: zod_1.z.string().uuid({ message: "merchantId must be a valid UUID" }),
    amountCents: zod_1.z.number().int().positive().optional(),
    percentage: zod_1.z.number().min(0).max(100).optional(),
}).refine((data) => data.amountCents !== undefined || data.percentage !== undefined, {
    message: "Either amountCents or percentage must be provided",
});
const FeeSchema = zod_1.z.object({
    type: zod_1.z.string().min(1, "Fee type is required"),
    amountCents: zod_1.z.number().int().nonnegative("amountCents must be non-negative"),
});
exports.CreateChargeRequestSchema = zod_1.z.object({
    merchantId: zod_1.z.string().uuid({ message: "merchantId inválido (UUID v4)" }),
    amountCents: zod_1.z.number().int().positive(),
    currency: zod_1.z.literal("BRL").optional().default("BRL"),
    description: zod_1.z.string().max(255).optional(),
    method: exports.ChargeMethodSchema.optional(),
    expiresAt: zod_1.z.string().datetime().optional(),
    idempotencyKey: zod_1.z.string().min(8),
    externalRef: zod_1.z.string().max(128).optional(),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    splits: zod_1.z.array(SplitSchema).optional(),
    fees: zod_1.z.array(FeeSchema).optional(),
});
exports.PixPayloadSchema = zod_1.z.object({
    qrCode: zod_1.z.string(),
    copyPaste: zod_1.z.string(),
    expiresAt: zod_1.z.string().datetime(),
});
exports.BoletoPayloadSchema = zod_1.z.object({
    boletoUrl: zod_1.z.string(),
    expiresAt: zod_1.z.string().datetime(),
});
exports.CreateChargeResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    merchantId: zod_1.z.string().uuid(),
    amountCents: zod_1.z.number().int(),
    currency: zod_1.z.literal("BRL"),
    description: zod_1.z.string().nullable().optional(),
    status: exports.ChargeStatusSchema,
    method: exports.ChargeMethodSchema.nullable().optional(),
    expiresAt: zod_1.z.string().datetime().nullable().optional(),
    idempotencyKey: zod_1.z.string(),
    externalRef: zod_1.z.string().nullable().optional(),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).nullable().optional(),
    pix: exports.PixPayloadSchema.optional(),
    boleto: exports.BoletoPayloadSchema.optional(),
    splits: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().uuid(),
        merchantId: zod_1.z.string().uuid(),
        amountCents: zod_1.z.number().int(),
        percentage: zod_1.z.number().optional(),
    })).optional(),
    fees: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().uuid(),
        type: zod_1.z.string(),
        amountCents: zod_1.z.number().int(),
    })).optional(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
exports.ErrorResponseSchema = zod_1.z.object({
    error: zod_1.z.object({
        code: zod_1.z.string(),
        message: zod_1.z.string(),
        details: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    }),
});
