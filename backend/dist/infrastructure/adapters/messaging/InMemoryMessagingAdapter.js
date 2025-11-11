"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryMessagingAdapter = void 0;
const pino_1 = __importDefault(require("pino"));
const logger = (0, pino_1.default)({ name: "InMemoryMessagingAdapter" });
class InMemoryMessagingAdapter {
    async publish(event) {
        logger.info({ event }, "Published event (in-memory)");
    }
}
exports.InMemoryMessagingAdapter = InMemoryMessagingAdapter;
