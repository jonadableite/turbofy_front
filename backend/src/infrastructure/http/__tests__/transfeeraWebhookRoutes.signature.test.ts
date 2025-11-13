import request from "supertest";
import express from "express";
import crypto from "crypto";
import { transfeeraWebhookRouter } from "../routes/transfeeraWebhookRoutes";
import { PrismaWebhookAttemptRepository } from "../../database/PrismaWebhookAttemptRepository";

process.env.TRANSFEERA_WEBHOOK_SECRET = "x".repeat(32);

describe("Transfeera webhook signature", () => {
  const app = express();
  app.use(express.json({ verify: (req: any, _res, buf) => { req.rawBody = buf; } }));
  app.use("/webhooks/transfeera", transfeeraWebhookRouter);

  it("rejects when signature is missing", async () => {
    const body = { id: "e1", object: "CashIn", data: {} };
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const res = await request(app).post("/webhooks/transfeera").send(body);
    process.env.NODE_ENV = prev;
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("INVALID_SIGNATURE");
  });

  it("accepts with valid HMAC-SHA256 signature", async () => {
    const body = { id: "e2", object: "CashIn", data: {} };
    const raw = Buffer.from(JSON.stringify(body));
    const sig = crypto.createHmac("sha256", process.env.TRANSFEERA_WEBHOOK_SECRET as string).update(raw).digest("hex");
    const res = await request(app)
      .post("/webhooks/transfeera")
      .set("X-Transfeera-Signature", sig)
      .send(body);
    expect(res.status).toBe(200);
    expect(res.body.received).toBe(true);
  });
});
jest.mock("../../database/PrismaWebhookAttemptRepository");
