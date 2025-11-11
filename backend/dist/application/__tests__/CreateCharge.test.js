"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateCharge_1 = require("../useCases/CreateCharge");
const StubPaymentProviderAdapter_1 = require("../../infrastructure/adapters/payment/StubPaymentProviderAdapter");
const Charge_1 = require("../../domain/entities/Charge");
describe("CreateCharge use case", () => {
    const merchantId = "8a29e7a2-7b91-4b7a-9b3e-3a0f3d2b1d55";
    let chargeRepository;
    let paymentProvider;
    let messaging;
    beforeEach(() => {
        const memory = {};
        chargeRepository = {
            findById: jest.fn(),
            findByIdempotencyKey: jest.fn(async (key) => memory[key]),
            create: jest.fn(async (charge) => {
                memory[charge.idempotencyKey] = charge;
                return charge;
            }),
            update: jest.fn(async (charge) => {
                memory[charge.idempotencyKey] = charge;
                return charge;
            }),
            addSplit: jest.fn(),
            addFee: jest.fn(),
        };
        paymentProvider = new StubPaymentProviderAdapter_1.StubPaymentProviderAdapter();
        messaging = { publish: jest.fn(async () => { }) };
    });
    it("creates a PIX charge and enriches with provider data", async () => {
        const useCase = new CreateCharge_1.CreateCharge(chargeRepository, paymentProvider, messaging);
        const { charge } = await useCase.execute({
            idempotencyKey: "idem-PIX-001",
            merchantId,
            amountCents: 5000,
            currency: "BRL",
            description: "Pedido #123",
            method: Charge_1.ChargeMethod.PIX,
        });
        expect(charge.status).toBe(Charge_1.ChargeStatus.PENDING);
        expect(charge.method).toBe(Charge_1.ChargeMethod.PIX);
        expect(charge.pixQrCode).toBeDefined();
        expect(charge.pixCopyPaste).toBeDefined();
        expect(messaging.publish.mock.calls.length).toBe(1);
        // update must be called to persist payment data
        expect(chargeRepository.update.mock.calls.length).toBe(1);
    });
    it("is idempotent and returns existing charge on second call", async () => {
        const useCase = new CreateCharge_1.CreateCharge(chargeRepository, paymentProvider, messaging);
        const first = await useCase.execute({
            idempotencyKey: "idem-PIX-002",
            merchantId,
            amountCents: 2500,
            currency: "BRL",
            method: Charge_1.ChargeMethod.PIX,
        });
        const second = await useCase.execute({
            idempotencyKey: "idem-PIX-002",
            merchantId,
            amountCents: 2500,
            currency: "BRL",
            method: Charge_1.ChargeMethod.PIX,
        });
        expect(second.charge.id).toBe(first.charge.id);
        // No second create/update when idempotent hit
        expect(chargeRepository.create.mock.calls.length).toBe(1);
        expect(chargeRepository.update.mock.calls.length).toBe(1);
    });
});
