"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fee = void 0;
const uuid_1 = require("uuid");
class Fee {
    constructor(props) {
        this.id = props.id || (0, uuid_1.v4)();
        this.chargeId = props.chargeId;
        this.type = props.type;
        this.createdAt = props.createdAt || new Date();
        if (!props.type || props.type.trim().length === 0) {
            throw new Error("Fee.type é obrigatório");
        }
        if (!Number.isInteger(props.amountCents) || props.amountCents < 0) {
            throw new Error("Fee.amountCents deve ser inteiro e >= 0");
        }
        this.amountCents = props.amountCents;
    }
    // Retorna o total após desconto da taxa
    applyToTotal(totalAmountCents) {
        if (!Number.isInteger(totalAmountCents) || totalAmountCents < 0) {
            throw new Error("Total inválido para aplicação de taxa");
        }
        const result = totalAmountCents - this.amountCents;
        return result < 0 ? 0 : result;
    }
}
exports.Fee = Fee;
