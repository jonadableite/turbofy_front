import { z } from "zod";

export const ChargeMethodSchema = z.enum(["PIX", "BOLETO"]);

export const ChargeStatusSchema = z.enum(["PENDING", "PAID", "EXPIRED", "CANCELED"]);

export const CreateChargeRequestSchema = z.object({
  merchantId: z.string().uuid({ message: "merchantId inválido (UUID v4)" }),
  amountCents: z.number().int().positive(),
  currency: z.literal("BRL").optional().default("BRL"),
  description: z.string().max(255).optional(),
  method: ChargeMethodSchema.optional(),
  expiresAt: z.string().datetime().optional(),
  idempotencyKey: z.string().min(8),
  externalRef: z.string().max(128).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const PixPayloadSchema = z.object({
  qrCode: z.string(),
  copyPaste: z.string(),
  expiresAt: z.string().datetime(),
});

export const BoletoPayloadSchema = z.object({
  boletoUrl: z.string(),
  expiresAt: z.string().datetime(),
});

export const CreateChargeResponseSchema = z.object({
  id: z.string().uuid(),
  merchantId: z.string().uuid(),
  amountCents: z.number().int(),
  currency: z.literal("BRL"),
  description: z.string().nullable().optional(),
  status: ChargeStatusSchema,
  method: ChargeMethodSchema.nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  idempotencyKey: z.string(),
  externalRef: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  pix: PixPayloadSchema.optional(),
  boleto: BoletoPayloadSchema.optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
  }),
});

export type CreateChargeRequest = z.infer<typeof CreateChargeRequestSchema>;
export type CreateChargeResponse = z.infer<typeof CreateChargeResponseSchema>;