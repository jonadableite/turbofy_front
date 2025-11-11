"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPaymentRepository = void 0;
const Payment_1 = require("../../../domain/entities/Payment");
class PrismaPaymentRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(payment) {
        const data = {
            id: payment.id,
            amount: payment.amount,
            description: payment.description,
            merchantId: payment.merchantId,
            status: payment.status,
            method: payment.method,
            customerEmail: payment.customerEmail,
            customerName: payment.customerName,
            customerDocument: payment.customerDocument,
            expiresAt: payment.expiresAt,
            metadata: payment.metadata,
        };
        const savedPayment = await this.prisma.payment.create({
            data,
        });
        return this.mapToEntity(savedPayment);
    }
    async findById(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });
        if (!payment)
            return null;
        return this.mapToEntity(payment);
    }
    async findByMerchantId(merchantId, options) {
        const { limit = 10, offset = 0, status } = options || {};
        const payments = await this.prisma.payment.findMany({
            where: {
                merchantId,
                ...(status ? { status } : {}),
            },
            take: limit,
            skip: offset,
            orderBy: {
                createdAt: "desc",
            },
        });
        return payments.map(this.mapToEntity);
    }
    async update(payment) {
        const updatedPayment = await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: payment.status,
                updatedAt: new Date(),
            },
        });
        return this.mapToEntity(updatedPayment);
    }
    async countByMerchantId(merchantId, options) {
        const { status } = options || {};
        return this.prisma.payment.count({
            where: {
                merchantId,
                ...(status ? { status } : {}),
            },
        });
    }
    mapToEntity(prismaPayment) {
        return new Payment_1.Payment({
            id: prismaPayment.id,
            amount: Number(prismaPayment.amount),
            description: prismaPayment.description,
            merchantId: prismaPayment.merchantId,
            status: prismaPayment.status,
            method: prismaPayment.method,
            customerEmail: prismaPayment.customerEmail,
            customerName: prismaPayment.customerName,
            customerDocument: prismaPayment.customerDocument,
            createdAt: prismaPayment.createdAt,
            updatedAt: prismaPayment.updatedAt,
            expiresAt: prismaPayment.expiresAt,
            metadata: prismaPayment.metadata,
        });
    }
}
exports.PrismaPaymentRepository = PrismaPaymentRepository;
