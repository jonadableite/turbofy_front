import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env';
import { prisma } from '../../database/prismaClient';
import pino from 'pino';

const logger = pino({
  name: 'auth-middleware',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn({ msg: 'Missing authorization header' });
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as {
      sub: string;
      roles: string[];
      iat: number;
      exp: number;
    };

    const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, email: true, roles: true } });
    if (!user) {
      logger.warn({ msg: 'User not found', userId: payload.sub });
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = user;
    return next();
  } catch (err) {
    logger.error({ err }, 'JWT verification failed');
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}