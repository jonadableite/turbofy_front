"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = exports.PaymentMethod = exports.PaymentStatus = void 0;
const crypto_1 = require("crypto");
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PROCESSING"] = "PROCESSING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["PIX"] = "PIX";
    PaymentMethod["BOLETO"] = "BOLETO";
    PaymentMethod["CREDIT_CARD"] = "CREDIT_CARD";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
class Payment {
    constructor(props) {
        this.id = props.id || (0, crypto_1.randomUUID)();
        this.amount = props.amount;
        this.description = props.description;
        this.merchantId = props.merchantId;
        this._status = props.status || PaymentStatus.PENDING;
        this._method = props.method;
        this.customerEmail = props.customerEmail;
        this.customerName = props.customerName;
        this.customerDocument = props.customerDocument;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
        this.expiresAt = props.expiresAt;
        this.metadata = props.metadata;
    }
    get status() {
        return this._status;
    }
    get method() {
        return this._method;
    }
    complete() {
        this._status = PaymentStatus.COMPLETED;
    }
    fail() {
        this._status = PaymentStatus.FAILED;
    }
    process() {
        this._status = PaymentStatus.PROCESSING;
    }
    refund() {
        this._status = PaymentStatus.REFUNDED;
    }
    isExpired() {
        if (!this.expiresAt)
            return false;
        return new Date() > this.expiresAt;
    }
}
exports.Payment = Payment;
