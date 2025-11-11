"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Fee_1 = require("../entities/Fee");
describe("Fee", () => {
    it("aplica taxa ao total", () => {
        const fee = new Fee_1.Fee({ chargeId: "c1", type: "PIX_GATEWAY", amountCents: 250 });
        expect(fee.applyToTotal(10000)).toBe(9750);
    });
    it("não permite amountCents negativo", () => {
        expect(() => new Fee_1.Fee({ chargeId: "c1", type: "PIX_GATEWAY", amountCents: -1 })).toThrow();
    });
});
