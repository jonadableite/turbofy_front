"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Turbofy API',
            version: '1.0.0',
            description: 'Documentação dos endpoints de autenticação e MFA',
        },
        servers: [{ url: 'http://localhost:3000' }],
        components: {
            schemas: {
                CreateChargeRequest: {
                    type: 'object',
                    properties: {
                        merchantId: { type: 'string', format: 'uuid' },
                        amountCents: { type: 'integer', minimum: 1 },
                        currency: { type: 'string', enum: ['BRL'], default: 'BRL' },
                        description: { type: 'string', maxLength: 255 },
                        method: { type: 'string', enum: ['PIX', 'BOLETO'] },
                        expiresAt: { type: 'string', format: 'date-time' },
                        idempotencyKey: { type: 'string', minLength: 8 },
                        externalRef: { type: 'string', maxLength: 128 },
                        metadata: { type: 'object', additionalProperties: true },
                    },
                    required: ['merchantId', 'amountCents', 'idempotencyKey'],
                },
                PixPayload: {
                    type: 'object',
                    properties: {
                        qrCode: { type: 'string' },
                        copyPaste: { type: 'string' },
                        expiresAt: { type: 'string', format: 'date-time' },
                    },
                    required: ['qrCode', 'copyPaste', 'expiresAt'],
                },
                BoletoPayload: {
                    type: 'object',
                    properties: {
                        boletoUrl: { type: 'string' },
                        expiresAt: { type: 'string', format: 'date-time' },
                    },
                    required: ['boletoUrl', 'expiresAt'],
                },
                CreateChargeResponse: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        merchantId: { type: 'string', format: 'uuid' },
                        amountCents: { type: 'integer' },
                        currency: { type: 'string', enum: ['BRL'] },
                        description: { type: 'string', nullable: true },
                        status: { type: 'string', enum: ['PENDING', 'PAID', 'EXPIRED', 'CANCELED'] },
                        method: { type: 'string', enum: ['PIX', 'BOLETO'], nullable: true },
                        expiresAt: { type: 'string', format: 'date-time', nullable: true },
                        idempotencyKey: { type: 'string' },
                        externalRef: { type: 'string', nullable: true },
                        metadata: { type: 'object', nullable: true },
                        pix: { $ref: '#/components/schemas/PixPayload' },
                        boleto: { $ref: '#/components/schemas/BoletoPayload' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                    required: ['id', 'merchantId', 'amountCents', 'currency', 'status', 'idempotencyKey', 'createdAt', 'updatedAt'],
                },
                MfaRequest: {
                    type: 'object',
                    properties: { email: { type: 'string', format: 'email' } },
                    required: ['email'],
                },
                MfaVerify: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', format: 'email' },
                        otp: { type: 'string', example: '123456' },
                    },
                    required: ['email', 'otp'],
                },
                Tokens: {
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' },
                    },
                },
            },
        },
        paths: {
            '/charges': {
                post: {
                    summary: 'Criar cobrança (Pix/Boleto)',
                    parameters: [
                        {
                            in: 'header',
                            name: 'X-Idempotency-Key',
                            required: true,
                            schema: { type: 'string' },
                            description: 'Chave de idempotência única por requisição',
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/CreateChargeRequest' },
                                examples: {
                                    pix: {
                                        value: {
                                            merchantId: '8a29e7a2-7b91-4b7a-9b3e-3a0f3d2b1d55',
                                            amountCents: 5000,
                                            method: 'PIX',
                                            idempotencyKey: 'idem-123',
                                            description: 'Pedido #123',
                                        },
                                    },
                                    boleto: {
                                        value: {
                                            merchantId: '8a29e7a2-7b91-4b7a-9b3e-3a0f3d2b1d55',
                                            amountCents: 5000,
                                            method: 'BOLETO',
                                            idempotencyKey: 'idem-456',
                                            description: 'Pedido #456',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Cobrança criada',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/CreateChargeResponse' },
                                },
                            },
                        },
                        400: { description: 'Erro de validação' },
                        500: { description: 'Erro interno' },
                    },
                },
            },
            '/auth/mfa/request': {
                post: {
                    summary: 'Solicitar OTP por e-mail',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MfaRequest' },
                                examples: {
                                    default: { value: { email: 'user@example.com' } },
                                },
                            },
                        },
                    },
                    responses: {
                        200: { description: 'Solicitação processada' },
                        400: { description: 'Entrada inválida' },
                        429: { description: 'Bloqueado por excesso de tentativas' },
                    },
                },
            },
            '/auth/mfa/verify': {
                post: {
                    summary: 'Verificar OTP e obter tokens',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MfaVerify' },
                                examples: {
                                    default: { value: { email: 'user@example.com', otp: '123456' } },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Tokens emitidos',
                            content: {
                                'application/json': { schema: { $ref: '#/components/schemas/Tokens' } },
                            },
                        },
                        400: { description: 'Entrada inválida' },
                        401: { description: 'OTP inválido/expirado' },
                        429: { description: 'Bloqueado por excesso de tentativas' },
                    },
                },
            },
        },
    },
    apis: [],
};
function setupSwagger(app) {
    const specs = (0, swagger_jsdoc_1.default)(options);
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
}
