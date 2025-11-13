"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
// Atenção: opções do transport são enviadas ao worker thread (thread-stream).
// Funções dentro das opções (ex.: customPrettifiers) causam DataCloneError.
// Mantemos apenas valores simples para compatibilidade.
const transport = process.env.NODE_ENV !== 'production'
    ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:HH:MM:ss',
            ignore: 'pid,hostname',
            messageFormat: '{msg}',
            customColors: 'info:blue,warn:yellow,error:red,debug:magenta',
            errorLikeObjectKeys: ['err', 'error'],
            singleLine: false,
            levelFirst: true,
            hideObject: false,
        },
    }
    : undefined;
exports.logger = (0, pino_1.default)({
    level: process.env.PINO_LOG_LEVEL || 'info',
    transport,
});
