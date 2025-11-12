import { z } from "zod";
import {
  CreateChargeRequestSchema,
  ChargeMethodSchema,
} from "../charges";

describe("Schemas - charges", () => {
  it("defaults currency to BRL when omitted", () => {
    const parsed = CreateChargeRequestSchema.parse({
      merchantId: "8a29e7a2-7b91-4b7a-9b3e-3a0f3d2b1d55",
      amountCents: 1000,
      idempotencyKey: "idem-1",
    });
    expect(parsed.currency).toBe("BRL");
  });

  it("rejects unsupported currency when provided", () => {
    const result = CreateChargeRequestSchema.safeParse({
      merchantId: "8a29e7a2-7b91-4b7a-9b3e-3a0f3d2b1d55",
      amountCents: 1000,
      currency: "USD",
      idempotencyKey: "idem-2",
    } as any);
    expect(result.success).toBe(false);
  });

  it("allows method to be undefined (optional)", () => {
    const parsed = CreateChargeRequestSchema.parse({
      merchantId: "8a29e7a2-7b91-4b7a-9b3e-3a0f3d2b1d55",
      amountCents: 1000,
      idempotencyKey: "idem-3",
    });
    expect(parsed.method).toBeUndefined();
    // Ensure method enum accepts PIX/BOLETO
    expect(ChargeMethodSchema.safeParse("PIX").success).toBe(true);
    expect(ChargeMethodSchema.safeParse("BOLETO").success).toBe(true);
  });

  it("validates splits refine rule (amountCents or percentage required)", () => {
    const result = CreateChargeRequestSchema.safeParse({
      merchantId: "8a29e7a2-7b91-4b7a-9b3e-3a0f3d2b1d55",
      amountCents: 1000,
      idempotencyKey: "idem-4",
      splits: [{ merchantId: "8a29e7a2-7b91-4b7a-9b3e-3a0f3d2b1d55" } as any],
    });
    expect(result.success).toBe(false);
  });
});