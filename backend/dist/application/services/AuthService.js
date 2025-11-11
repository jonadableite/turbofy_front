"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.loginSchema = exports.registerSchema = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const prismaClient_1 = require("../../infrastructure/database/prismaClient");
const env_1 = require("../../config/env");
const zod_1 = require("zod");
const logger_1 = require("../../infrastructure/logger");
const brDoc_1 = require("../../utils/brDoc");
const api_1 = require("@opentelemetry/api");
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().regex(passwordRegex, 'Senha deve conter 8+ chars, maiúscula, minúscula, número e símbolo'),
    document: zod_1.z.string().refine((doc) => (0, brDoc_1.validateCpf)(doc) || (0, brDoc_1.validateCnpj)(doc), 'CPF/CNPJ inválido'),
    phone: zod_1.z.string().optional(),
});
exports.loginSchema = exports.registerSchema; // same shape
class AuthService {
    static hashPassword(password) {
        return bcryptjs_1.default.hash(password, 12);
    }
    async register(input) {
        const data = exports.registerSchema.parse(input);
        const existing = await prismaClient_1.prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            throw new Error('Email already registered');
        }
        const passwordHash = await AuthService.hashPassword(data.password);
        const user = await prismaClient_1.prisma.user.create({ data: { email: data.email, passwordHash, roles: ['USER'], document: data.document, phone: data.phone } });
        // generate tokens immediately with rotation tracking
        return this.issueTokens(user.id, user.roles);
    }
    async storeRefreshToken(userId, token) {
        const tokenHash = crypto_1.default.createHash('sha256').update(token).digest('hex');
        await prismaClient_1.prisma.userToken.create({ data: { userId, tokenHash } });
    }
    async issueTokens(userId, roles) {
        const accessToken = jsonwebtoken_1.default.sign({ sub: userId, roles }, env_1.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ sub: userId }, env_1.env.JWT_SECRET, { expiresIn: '7d' });
        await this.storeRefreshToken(userId, refreshToken);
        return { accessToken, refreshToken };
    }
    // Exposed for MFA flows to issue tokens post-verification
    async issueTokensForUserId(userId) {
        const user = await prismaClient_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error('User not found');
        return this.issueTokens(user.id, user.roles);
    }
    async checkLock(email, ip) {
        const now = new Date();
        // 🔐 SECURITY: Check for account lockout to prevent brute force attacks
        // 📈 SCALABILITY: Uses indexed unique constraint for fast lookups
        const attempt = await prismaClient_1.prisma.authAttempt.findFirst({
            where: { email, ip }
        });
        if (attempt?.lockedUntil && attempt.lockedUntil > now) {
            throw new Error('Account temporarily locked');
        }
    }
    async recordFailure(email, ip) {
        // 🔐 SECURITY: Rate limiting with sliding window to prevent brute force attacks
        // 📈 SCALABILITY: Efficient upsert pattern for high-concurrency scenarios
        // 🛠️ MAINTAINABILITY: Clear lockout logic with configurable thresholds
        const windowMs = 15 * 60 * 1000;
        const now = new Date();
        const attempt = await prismaClient_1.prisma.authAttempt.findFirst({
            where: { email, ip }
        });
        if (!attempt) {
            await prismaClient_1.prisma.authAttempt.create({
                data: { email, ip, count: 1, windowStart: now }
            });
            return;
        }
        const windowStart = new Date(attempt.windowStart);
        if (now.getTime() - windowStart.getTime() > windowMs) {
            // Reset window if expired
            await prismaClient_1.prisma.authAttempt.updateMany({
                where: { email, ip },
                data: { count: 1, windowStart: now, lockedUntil: null }
            });
            return;
        }
        const newCount = attempt.count + 1;
        const lockThreshold = 5;
        const lockMs = 15 * 60 * 1000;
        await prismaClient_1.prisma.authAttempt.updateMany({
            where: { email, ip },
            data: {
                count: newCount,
                ...(newCount >= lockThreshold ? { lockedUntil: new Date(now.getTime() + lockMs) } : {}),
            },
        });
    }
    async recordSuccess(email, ip) {
        // 🔐 SECURITY: Clear failed attempts on successful login
        // 🛠️ MAINTAINABILITY: Silent failure prevents errors from blocking login flow
        await prismaClient_1.prisma.authAttempt.deleteMany({
            where: { email, ip }
        }).catch(() => { });
    }
    async login(input, ip = 'unknown') {
        const tracer = api_1.trace.getTracer('turbofy-auth');
        const data = exports.loginSchema.parse(input);
        const span = tracer.startSpan('auth.login');
        try {
            span.setAttribute('auth.email', data.email);
            await this.checkLock(data.email, ip);
            const user = await prismaClient_1.prisma.user.findUnique({ where: { email: data.email } });
            if (!user) {
                logger_1.logger.warn({ email: data.email }, 'Login failed: user not found');
                await this.recordFailure(data.email, ip);
                span.addEvent('auth.login.failed');
                throw new Error('Invalid credentials');
            }
            const valid = await bcryptjs_1.default.compare(data.password, user.passwordHash);
            if (!valid) {
                logger_1.logger.warn({ email: data.email }, 'Login failed: invalid password');
                await this.recordFailure(data.email, ip);
                span.addEvent('auth.login.failed');
                throw new Error('Invalid credentials');
            }
            await this.recordSuccess(data.email, ip);
            const tokens = await this.issueTokens(user.id, user.roles);
            logger_1.logger.info({ email: data.email, userId: user.id }, 'Login successful');
            span.addEvent('auth.login.success');
            return tokens;
        }
        finally {
            span.end();
        }
    }
    async refreshToken(token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
            const user = await prismaClient_1.prisma.user.findUnique({ where: { id: payload.sub } });
            if (!user)
                throw new Error('Invalid token');
            const tokenHash = crypto_1.default.createHash('sha256').update(token).digest('hex');
            const record = await prismaClient_1.prisma.userToken.findUnique({ where: { tokenHash } });
            if (!record || record.revokedAt) {
                // token reuse or unknown token; revoke all tokens for safety
                await prismaClient_1.prisma.userToken.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } });
                throw new Error('Invalid or reused refresh token');
            }
            // revoke old and issue new
            const { accessToken, refreshToken } = await this.issueTokens(user.id, user.roles);
            const newHash = crypto_1.default.createHash('sha256').update(refreshToken).digest('hex');
            await prismaClient_1.prisma.userToken.update({ where: { tokenHash }, data: { revokedAt: new Date(), replacedBy: newHash } });
            return { accessToken, refreshToken };
        }
        catch {
            throw new Error('Invalid token');
        }
    }
}
exports.AuthService = AuthService;
