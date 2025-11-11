"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Charge_1 = require("../entities/Charge");
describe("Charge", () => {
    it("inicia PENDING e permite marcar como PAID", () => {
        const charge = new Charge_1.Charge({
            merchantId: "m1",
            amountCents: 5000,
            idempotencyKey: "abc12345",
        });
        expect(charge.status).toBe(Charge_1.ChargeStatus.PENDING);
        charge.markAsPaid();
        expect(charge.status).toBe(Charge_1.ChargeStatus.PAID);
    });
    it("define método de pagamento", () => {
        const charge = new Charge_1.Charge({ merchantId: "m1", amountCents: 5000, idempotencyKey: "abc12345" });
        charge.setPaymentMethod(Charge_1.ChargeMethod.PIX);
        expect(charge.method).toBe(Charge_1.ChargeMethod.PIX);
    });
});
