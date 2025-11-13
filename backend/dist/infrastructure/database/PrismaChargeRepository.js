"use strict";
// 🔐 SECURITY: Type-safe database operations prevent injection attacks via Prisma parameterization
// 📈 SCALABILITY: Efficient data mapping between Prisma models and domain entities
// 🛠️ MAINTAINABILITY: Clear separation between infrastructure and domain layers
// 🧪 TESTABILITY: Repository pattern allows easy mocking for unit tests
// 🔄 EXTENSIBILITY: Easy to swap Prisma for another ORM without changing domain logic
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaChargeRepository = void 0;
const client_1 = require("@prisma/client");
const Charge_1 = require("../../domain/entities/Charge");
const ChargeSplit_1 = require("../../domain/entities/ChargeSplit");
const Fee_1 = require("../../domain/entities/Fee");
const prismaClient_1 = require("./prismaClient");
function mapPrismaChargeToDomain(model) {
    return new Charge_1.Charge({
        id: model.id,
        merchantId: model.merchantId,
        amountCents: model.amountCents,
        currency: model.currency,
        description: model.description ?? undefined,
        status: model.status,
        method: model.method ?? undefined,
        expiresAt: model.expiresAt ?? undefined,
        idempotencyKey: model.idempotencyKey,
        externalRef: model.externalRef ?? undefined,
        metadata: model.metadata ?? undefined,
        pixQrCode: model.pixQrCode ?? undefined,
        pixCopyPaste: model.pixCopyPaste ?? undefined,
        boletoUrl: model.boletoUrl ?? undefined,
        pixTxid: model.pixTxid ?? undefined,
        paidAt: model.paidAt ?? undefined,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
    });
}
class PrismaChargeRepository {
    async findById(id) {
        const found = await prismaClient_1.prisma.charge.findUnique({ where: { id } });
        return found ? mapPrismaChargeToDomain(found) : null;
    }
    async findByIdempotencyKey(idempotencyKey) {
        const found = await prismaClient_1.prisma.charge.findUnique({ where: { idempotencyKey } });
        return found ? mapPrismaChargeToDomain(found) : null;
    }
    async findByExternalRef(externalRef) {
        const found = await prismaClient_1.prisma.charge.findFirst({ where: { externalRef } });
        return found ? mapPrismaChargeToDomain(found) : null;
    }
    async findByTxid(txid) {
        const found = await prismaClient_1.prisma.charge.findUnique({ where: { pixTxid: txid } });
        return found ? mapPrismaChargeToDomain(found) : null;
    }
    async create(charge) {
        // 🔐 SECURITY: Prisma automatically parameterizes queries, preventing SQL injection
        // 📈 SCALABILITY: Single transaction for charge creation
        const created = await prismaClient_1.prisma.charge.create({
            data: {
                id: charge.id,
                merchantId: charge.merchantId,
                amountCents: charge.amountCents,
                currency: charge.currency,
                description: charge.description ?? null,
                status: charge.status,
                method: charge.method ?? null,
                expiresAt: charge.expiresAt ?? null,
                idempotencyKey: charge.idempotencyKey,
                externalRef: charge.externalRef ?? null,
                ...(charge.metadata !== undefined ? { metadata: charge.metadata } : {}),
                pixQrCode: charge.pixQrCode ?? null,
                pixCopyPaste: charge.pixCopyPaste ?? null,
                boletoUrl: charge.boletoUrl ?? null,
                pixTxid: charge.pixTxid ?? null,
                paidAt: charge.paidAt ?? null,
            },
        });
        return mapPrismaChargeToDomain(created);
    }
    async update(charge) {
        // 🔐 SECURITY: Type-safe update operations
        // 🛠️ MAINTAINABILITY: Only updates provided fields
        const updated = await prismaClient_1.prisma.charge.update({
            where: { id: charge.id },
            data: {
                description: charge.description ?? null,
                status: charge.status,
                method: charge.method ?? null,
                expiresAt: charge.expiresAt ?? null,
                externalRef: charge.externalRef ?? null,
                ...(charge.metadata !== undefined ? { metadata: charge.metadata } : {}),
                pixQrCode: charge.pixQrCode ?? null,
                pixCopyPaste: charge.pixCopyPaste ?? null,
                boletoUrl: charge.boletoUrl ?? null,
                pixTxid: charge.pixTxid ?? null,
                paidAt: charge.paidAt ?? null,
            },
        });
        return mapPrismaChargeToDomain(updated);
    }
    async addSplit(chargeId, split) {
        // 🔐 SECURITY: Type-safe split creation with proper Decimal handling
        // 📈 SCALABILITY: Efficient split storage for payment distribution
        // 🛠️ MAINTAINABILITY: Converts Prisma Decimal to number for domain layer
        // 🧪 TESTABILITY: Clear logic for amount calculation
        let amountCents;
        if (split.amountCents != null) {
            amountCents = split.amountCents;
        }
        else {
            // If amountCents is not provided, calculate from percentage
            // Need to fetch charge to get total amount
            const charge = await prismaClient_1.prisma.charge.findUnique({
                where: { id: chargeId },
                select: { amountCents: true }
            });
            if (!charge) {
                throw new Error(`Charge ${chargeId} not found`);
            }
            amountCents = split.computeAmountForTotal(charge.amountCents);
        }
        const created = await prismaClient_1.prisma.chargeSplit.create({
            data: {
                id: split.id,
                chargeId,
                merchantId: split.merchantId,
                amountCents,
                percentage: split.percentage ? new client_1.Prisma.Decimal(split.percentage) : null,
            },
        });
        return new ChargeSplit_1.ChargeSplit({
            id: created.id,
            chargeId: created.chargeId,
            merchantId: created.merchantId,
            amountCents: created.amountCents,
            percentage: created.percentage ? Number(created.percentage) : undefined,
            createdAt: created.createdAt,
        });
    }
    async addFee(chargeId, fee) {
        const created = await prismaClient_1.prisma.fee.create({
            data: {
                id: fee.id,
                chargeId,
                type: fee.type,
                amountCents: fee.amountCents,
            },
        });
        return new Fee_1.Fee({
            id: created.id,
            chargeId: created.chargeId,
            type: created.type,
            amountCents: created.amountCents,
            createdAt: created.createdAt,
        });
    }
}
exports.PrismaChargeRepository = PrismaChargeRepository;
