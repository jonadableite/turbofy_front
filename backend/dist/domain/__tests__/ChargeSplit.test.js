"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChargeSplit_1 = require("../entities/ChargeSplit");
describe("ChargeSplit", () => {
    it("calcula valor por percentual", () => {
        const split = new ChargeSplit_1.ChargeSplit({ chargeId: "c1", merchantId: "m1", percentage: 10 });
        expect(split.computeAmountForTotal(10000)).toBe(1000);
    });
    it("erro quando excede total pelo amountCents", () => {
        const split = new ChargeSplit_1.ChargeSplit({ chargeId: "c1", merchantId: "m1", amountCents: 20000 });
        expect(() => split.computeAmountForTotal(10000)).toThrow();
    });
});
