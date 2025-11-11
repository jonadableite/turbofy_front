"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const AuthService_1 = require("../../../application/services/AuthService");
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const prismaClient_1 = require("../../database/prismaClient");
const EmailService_1 = require("../../email/EmailService");
const logger_1 = require("../../logger");
const api_1 = require("@opentelemetry/api");
const authRouter = (0, express_1.Router)();
exports.authRouter = authRouter;
const authService = new AuthService_1.AuthService();
const emailService = new EmailService_1.EmailService();
const tracer = api_1.trace.getTracer('turbofy-auth');
// rate limiter: 10 requests / 10 minutes per IP for auth endpoints
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: 'Too many auth attempts, please try again later.',
});
// MFA: stricter request rate limiting
const mfaLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: 'Too many MFA requests, please try again later.',
});
const mfaRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
const mfaVerifySchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    otp: zod_1.z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
});
// Brute-force helpers (duplicated from AuthService logic for route-level control)
async function checkLock(email, ip) {
    const now = new Date();
    const attempt = await prismaClient_1.prisma.authAttempt.findFirst({ where: { email, ip } });
    if (attempt?.lockedUntil && attempt.lockedUntil > now) {
        throw new Error('Too many attempts, temporarily locked');
    }
}
async function recordFailure(email, ip) {
    const windowMs = 15 * 60 * 1000;
    const now = new Date();
    const attempt = await prismaClient_1.prisma.authAttempt.findFirst({ where: { email, ip } });
    if (!attempt) {
        await prismaClient_1.prisma.authAttempt.create({ data: { email, ip, count: 1, windowStart: now } });
        return;
    }
    const windowStart = new Date(attempt.windowStart);
    if (now.getTime() - windowStart.getTime() > windowMs) {
        await prismaClient_1.prisma.authAttempt.updateMany({ where: { email, ip }, data: { count: 1, windowStart: now, lockedUntil: null } });
        return;
    }
    const newCount = attempt.count + 1;
    const lockThreshold = 5;
    const lockMs = 15 * 60 * 1000;
    await prismaClient_1.prisma.authAttempt.updateMany({
        where: { email, ip },
        data: { count: newCount, ...(newCount >= lockThreshold ? { lockedUntil: new Date(now.getTime() + lockMs) } : {}) },
    });
}
async function recordSuccess(email, ip) {
    await prismaClient_1.prisma.authAttempt.deleteMany({ where: { email, ip } }).catch(() => { });
}
authRouter.post('/register', authLimiter, async (req, res) => {
    try {
        const input = AuthService_1.registerSchema.parse(req.body);
        const tokens = await authService.register(input);
        res.status(201).json(tokens);
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            // Use issues for cross-version compatibility
            return res.status(400).json({ issues: err.issues });
        }
        const message = err instanceof Error ? err.message : 'Unknown error';
        return res.status(400).json({ error: message });
    }
});
authRouter.post('/login', authLimiter, async (req, res) => {
    try {
        const input = AuthService_1.loginSchema.parse(req.body);
        const tokens = await authService.login(input);
        res.status(200).json(tokens);
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            return res.status(400).json({ issues: err.issues });
        }
        const message = err instanceof Error ? err.message : 'Unauthorized';
        return res.status(401).json({ error: message });
    }
});
authRouter.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.status(400).json({ error: 'refreshToken required' });
    try {
        const tokens = await authService.refreshToken(refreshToken);
        res.status(200).json(tokens);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unauthorized';
        return res.status(401).json({ error: message });
    }
});
// MFA Request: generate 6-digit OTP, store hash + 5min expiry, send email
authRouter.post('/mfa/request', mfaLimiter, async (req, res) => {
    const ip = req.ip || 'unknown';
    try {
        const { email } = mfaRequestSchema.parse(req.body);
        await checkLock(email, ip);
        const user = await prismaClient_1.prisma.user.findUnique({ where: { email } });
        // Avoid user enumeration: always respond 200, only proceed internally if user exists
        if (user) {
            {
                const span = tracer.startSpan('auth.mfa.request');
                try {
                    span.setAttribute('auth.email', email);
                    const otp = crypto_1.default.randomInt(0, 1000000).toString().padStart(6, '0');
                    const codeHash = await bcryptjs_1.default.hash(otp, 12);
                    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
                    await prismaClient_1.prisma.userOtp.create({ data: { userId: user.id, codeHash, expiresAt } });
                    await emailService.sendOtpEmail(email, otp);
                    logger_1.logger.info({ email, userId: user.id }, 'MFA OTP generated and email sent');
                    span.addEvent('auth.mfa.otp_generated');
                }
                finally {
                    span.end();
                }
            }
            await recordSuccess(email, ip); // generating is not a failure, but resets window
        }
        return res.status(200).json({ status: 'ok' });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            return res.status(400).json({ issues: err.issues });
        }
        if (err instanceof Error && /locked/i.test(err.message)) {
            return res.status(429).json({ error: err.message });
        }
        logger_1.logger.error({ err }, 'MFA request failed');
        await recordFailure(req.body?.email ?? 'unknown', ip);
        return res.status(400).json({ error: 'Unable to process MFA request' });
    }
});
// MFA Verify: check hash + expiry, mark consumed, return tokens
authRouter.post('/mfa/verify', authLimiter, async (req, res) => {
    const ip = req.ip || 'unknown';
    try {
        const { email, otp } = mfaVerifySchema.parse(req.body);
        await checkLock(email, ip);
        const user = await prismaClient_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            await recordFailure(email, ip);
            return res.status(401).json({ error: 'Invalid or expired code' });
        }
        const now = new Date();
        const record = await prismaClient_1.prisma.userOtp.findFirst({
            where: { userId: user.id, consumedAt: null, expiresAt: { gt: now } },
            orderBy: { createdAt: 'desc' },
        });
        if (!record) {
            await recordFailure(email, ip);
            return res.status(401).json({ error: 'Invalid or expired code' });
        }
        const valid = await bcryptjs_1.default.compare(otp, record.codeHash);
        if (!valid) {
            await recordFailure(email, ip);
            return res.status(401).json({ error: 'Invalid or expired code' });
        }
        {
            const span = tracer.startSpan('auth.mfa.verify');
            try {
                span.setAttribute('auth.email', email);
                await prismaClient_1.prisma.userOtp.update({ where: { id: record.id }, data: { consumedAt: new Date() } });
                await recordSuccess(email, ip);
                const tokens = await authService.issueTokensForUserId(user.id);
                logger_1.logger.info({ email, userId: user.id }, 'MFA verification success');
                span.addEvent('auth.mfa.verify.success');
                return res.status(200).json(tokens);
            }
            finally {
                span.end();
            }
        }
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            return res.status(400).json({ issues: err.issues });
        }
        if (err instanceof Error && /locked/i.test(err.message)) {
            return res.status(429).json({ error: err.message });
        }
        const message = err instanceof Error ? err.message : 'Unauthorized';
        logger_1.logger.error({ err }, 'MFA verification failed');
        return res.status(401).json({ error: message });
    }
});
