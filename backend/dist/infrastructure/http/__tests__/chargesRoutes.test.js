"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const chargesRoutes_1 = require("../../http/routes/chargesRoutes");
// Mock PrismaChargeRepository to avoid DB in integration tests
jest.mock("../../database/PrismaChargeRepository", () => {
    const store = new Map();
    return {
        PrismaChargeRepository: class {
            async findByIdempotencyKey(key) {
                return store.get(key);
            }
            async create(charge) {
                store.set(charge.idempotencyKey, charge);
                return charge;
            }
            async update(charge) {
                store.set(charge.idempotencyKey, charge);
                return charge;
            }
            async findById() { return undefined; }
            async addSplit() { return undefined; }
            async addFee() { return undefined; }
        },
    };
});
describe("POST /charges", () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/charges", chargesRoutes_1.chargesRouter);
    const merchantId = "8a29e7a2-7b91-4b7a-9b3e-3a0f3d2b1d55";
    it("returns 400 when X-Idempotency-Key header is missing", async () => {
        const res = await (0, supertest_1.default)(app)
            .post("/charges")
            .send({ merchantId, amountCents: 1000, method: "PIX", idempotencyKey: "missing-but-body" });
        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe("IDEMPOTENCY_KEY_MISSING");
    });
    it("creates a PIX charge and returns payment payload", async () => {
        const res = await (0, supertest_1.default)(app)
            .post("/charges")
            .set("X-Idempotency-Key", "route-idem-PIX-001")
            .send({ merchantId, amountCents: 3500, method: "PIX", idempotencyKey: "route-idem-PIX-001" });
        expect(res.status).toBe(201);
        expect(res.body.method).toBe("PIX");
        expect(res.body.pix).toBeDefined();
        expect(res.body.pix.qrCode).toBeDefined();
        expect(res.body.pix.copyPaste).toBeDefined();
    });
    it("is idempotent and returns same charge id on repeated request", async () => {
        const idemKey = "route-idem-PIX-002";
        const first = await (0, supertest_1.default)(app)
            .post("/charges")
            .set("X-Idempotency-Key", idemKey)
            .send({ merchantId, amountCents: 1500, method: "PIX", idempotencyKey: idemKey });
        const second = await (0, supertest_1.default)(app)
            .post("/charges")
            .set("X-Idempotency-Key", idemKey)
            .send({ merchantId, amountCents: 1500, method: "PIX", idempotencyKey: idemKey });
        expect(second.status).toBe(201);
        expect(second.body.id).toBe(first.body.id);
    });
});
