"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixKey = exports.PixKeyType = void 0;
const crypto_1 = require("crypto");
var PixKeyType;
(function (PixKeyType) {
    PixKeyType["CPF"] = "CPF";
    PixKeyType["CNPJ"] = "CNPJ";
    PixKeyType["EMAIL"] = "EMAIL";
    PixKeyType["PHONE"] = "PHONE";
    PixKeyType["RANDOM"] = "RANDOM";
})(PixKeyType || (exports.PixKeyType = PixKeyType = {}));
class PixKey {
    constructor(props) {
        this.id = props.id || (0, crypto_1.randomUUID)();
        this.merchantId = props.merchantId;
        this.type = props.type;
        this.key = props.key;
        this.description = props.description;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
        this._isActive = props.isActive ?? true;
    }
    get isActive() {
        return this._isActive;
    }
    activate() {
        this._isActive = true;
    }
    deactivate() {
        this._isActive = false;
    }
}
exports.PixKey = PixKey;
