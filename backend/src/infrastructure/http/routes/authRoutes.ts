import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthService, registerSchema, loginSchema } from '../../../application/services/AuthService';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../../database/prismaClient';
import { EmailService } from '../../email/EmailService';
import { logger } from '../../logger';
import { trace } from '@opentelemetry/api';
import { verifyRecaptcha } from '../../security/recaptcha';
import { generateCsrfToken } from '../../security/csrf';

const authRouter = Router();
const authService = new AuthService();
const emailService = new EmailService();
const tracer = trace.getTracer('turbofy-auth');

// rate limiter: 10 requests / 10 minutes per IP for auth endpoints
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: 'Too many auth attempts, please try again later.',
});

// MFA: stricter request rate limiting
const mfaLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: 'Too many MFA requests, please try again later.',
});

const mfaRequestSchema = z.object({
  email: z.string().email(),
});

const mfaVerifySchema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

// Brute-force helpers (duplicated from AuthService logic for route-level control)
async function checkLock(email: string, ip: string) {
  const now = new Date();
  const attempt = await prisma.authAttempt.findFirst({ where: { email, ip } });
  if (attempt?.lockedUntil && attempt.lockedUntil > now) {
    throw new Error('Too many attempts, temporarily locked');
  }
}

async function recordFailure(email: string, ip: string) {
  const windowMs = 15 * 60 * 1000;
  const now = new Date();
  const attempt = await prisma.authAttempt.findFirst({ where: { email, ip } });
  if (!attempt) {
    await prisma.authAttempt.create({ data: { email, ip, count: 1, windowStart: now } });
    return;
  }
  const windowStart = new Date(attempt.windowStart);
  if (now.getTime() - windowStart.getTime() > windowMs) {
    await prisma.authAttempt.updateMany({ where: { email, ip }, data: { count: 1, windowStart: now, lockedUntil: null } });
    return;
  }
  const newCount = attempt.count + 1;
  const lockThreshold = 5;
  const lockMs = 15 * 60 * 1000;
  await prisma.authAttempt.updateMany({
    where: { email, ip },
    data: { count: newCount, ...(newCount >= lockThreshold ? { lockedUntil: new Date(now.getTime() + lockMs) } : {}) },
  });
}

async function recordSuccess(email: string, ip: string) {
  await prisma.authAttempt.deleteMany({ where: { email, ip } }).catch(() => {});
}

authRouter.post('/register', authLimiter, async (req: Request, res: Response) => {
  const ip = req.ip || 'unknown';
  try {
    // Validar reCAPTCHA se fornecido
    const { recaptchaToken, ...inputData } = req.body as { recaptchaToken?: string } & z.infer<typeof registerSchema>;
    if (recaptchaToken) {
      const isValid = await verifyRecaptcha(recaptchaToken, ip);
      if (!isValid) {
        return res.status(400).json({ error: 'reCAPTCHA validation failed' });
      }
    }

    const input = registerSchema.parse(inputData);
    const tokens = await authService.register(input);

    // Configurar HttpOnly cookies
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction, // HTTPS only em produção
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutos
      path: '/',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      path: '/',
    });

    res.status(201).json({ 
      accessToken: tokens.accessToken, 
      refreshToken: tokens.refreshToken,
      expiresIn: 15 * 60, // 15 minutos em segundos
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Use issues for cross-version compatibility
      return res.status(400).json({ issues: err.issues });
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(400).json({ error: message });
  }
});

authRouter.post('/login', authLimiter, async (req: Request, res: Response) => {
  const ip = req.ip || 'unknown';
  try {
    // Validar reCAPTCHA se fornecido
    const { recaptchaToken, ...inputData } = req.body as { recaptchaToken?: string } & z.infer<typeof loginSchema>;
    if (recaptchaToken) {
      const isValid = await verifyRecaptcha(recaptchaToken, ip);
      if (!isValid) {
        return res.status(400).json({ error: 'reCAPTCHA validation failed' });
      }
    }

    const input = loginSchema.parse(inputData);
    const tokens = await authService.login(input, ip);

    // Configurar HttpOnly cookies
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction, // HTTPS only em produção
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutos
      path: '/',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      path: '/',
    });

    res.status(200).json({ 
      accessToken: tokens.accessToken, 
      refreshToken: tokens.refreshToken,
      expiresIn: 15 * 60, // 15 minutos em segundos
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ issues: err.issues });
    }
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return res.status(401).json({ error: message });
  }
});

authRouter.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });
  try {
    const tokens = await authService.refreshToken(refreshToken);
    res.status(200).json(tokens);
  } catch (err) {
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
    const user = await prisma.user.findUnique({ where: { email } });
    // Avoid user enumeration: always respond 200, only proceed internally if user exists
    if (user) {
      {
        const span = tracer.startSpan('auth.mfa.request');
        try {
          span.setAttribute('auth.email', email);
          const otp = crypto.randomInt(0, 1000000).toString().padStart(6, '0');
          const codeHash = await bcrypt.hash(otp, 12);
          const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
          await prisma.userOtp.create({ data: { userId: user.id, codeHash, expiresAt } });
          await emailService.sendOtpEmail(email, otp);
          logger.info({ email, userId: user.id }, 'MFA OTP generated and email sent');
          span.addEvent('auth.mfa.otp_generated');
        } finally {
          span.end();
        }
      }
      await recordSuccess(email, ip); // generating is not a failure, but resets window
    }
    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ issues: err.issues });
    }
    if (err instanceof Error && /locked/i.test(err.message)) {
      return res.status(429).json({ error: err.message });
    }
    logger.error({ err }, 'MFA request failed');
    await recordFailure((req.body?.email as string) ?? 'unknown', ip);
    return res.status(400).json({ error: 'Unable to process MFA request' });
  }
});

// MFA Verify: check hash + expiry, mark consumed, return tokens
authRouter.post('/mfa/verify', authLimiter, async (req, res) => {
  const ip = req.ip || 'unknown';
  try {
    const { email, otp } = mfaVerifySchema.parse(req.body);
    await checkLock(email, ip);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      await recordFailure(email, ip);
      return res.status(401).json({ error: 'Invalid or expired code' });
    }
    const now = new Date();
    const record = await prisma.userOtp.findFirst({
      where: { userId: user.id, consumedAt: null, expiresAt: { gt: now } },
      orderBy: { createdAt: 'desc' },
    });
    if (!record) {
      await recordFailure(email, ip);
      return res.status(401).json({ error: 'Invalid or expired code' });
    }
    const valid = await bcrypt.compare(otp, record.codeHash);
    if (!valid) {
      await recordFailure(email, ip);
      return res.status(401).json({ error: 'Invalid or expired code' });
    }

    {
      const span = tracer.startSpan('auth.mfa.verify');
      try {
        span.setAttribute('auth.email', email);
        await prisma.userOtp.update({ where: { id: record.id }, data: { consumedAt: new Date() } });
        await recordSuccess(email, ip);
        const tokens = await authService.issueTokensForUserId(user.id);
        logger.info({ email, userId: user.id }, 'MFA verification success');
        span.addEvent('auth.mfa.verify.success');
        return res.status(200).json(tokens);
      } finally {
        span.end();
      }
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ issues: err.issues });
    }
    if (err instanceof Error && /locked/i.test(err.message)) {
      return res.status(429).json({ error: err.message });
    }
    const message = err instanceof Error ? err.message : 'Unauthorized';
    logger.error({ err }, 'MFA verification failed');
    return res.status(401).json({ error: message });
  }
});

// Forgot Password: generate reset token, store hash + 1h expiry, send email
const forgotPasswordSchema = z.object({
  email: z.string().email(),
  recaptchaToken: z.string().optional(),
});

authRouter.post('/forgot-password', authLimiter, async (req: Request, res: Response) => {
  const ip = req.ip || 'unknown';
  try {
    const { email, recaptchaToken } = forgotPasswordSchema.parse(req.body);

    // Validar reCAPTCHA se fornecido
    if (recaptchaToken) {
      const isValid = await verifyRecaptcha(recaptchaToken, ip);
      if (!isValid) {
        return res.status(400).json({ error: 'reCAPTCHA validation failed' });
      }
    }

    await checkLock(email, ip);
    const user = await prisma.user.findUnique({ where: { email } });

    // Avoid user enumeration: always respond 200, only proceed internally if user exists
    if (user) {
      const span = tracer.startSpan('auth.forgot-password');
      try {
        span.setAttribute('auth.email', email);
        
        // Gerar token de reset (32 bytes = 64 hex chars)
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = await bcrypt.hash(resetToken, 12);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

        // Armazenar token no banco
        await prisma.passwordResetToken.create({
          data: {
            userId: user.id,
            tokenHash,
            expiresAt,
          },
        });

        // Enviar email com link de reset
        await emailService.sendPasswordResetEmail(email, resetToken);
        
        logger.info({ email, userId: user.id }, 'Password reset token generated and email sent');
        span.addEvent('auth.forgot-password.token_generated');
      } catch (error) {
        logger.error({ error, email }, 'Error generating password reset token');
        span.addEvent('auth.forgot-password.error');
      } finally {
        span.end();
      }
      await recordSuccess(email, ip);
    }

    // Sempre retornar sucesso para evitar user enumeration
    return res.status(200).json({ 
      status: 'ok',
      message: 'If the email exists, a password reset link has been sent.',
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ issues: err.issues });
    }
    if (err instanceof Error && /locked/i.test(err.message)) {
      return res.status(429).json({ error: err.message });
    }
    logger.error({ err }, 'Forgot password request failed');
    await recordFailure((req.body?.email as string) ?? 'unknown', ip);
    return res.status(400).json({ error: 'Unable to process password reset request' });
  }
});

export { authRouter };