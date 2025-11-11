"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../../config/env");
const prismaClient_1 = require("../../database/prismaClient");
const pino_1 = __importDefault(require("pino"));
const logger = (0, pino_1.default)({
    name: 'auth-middleware',
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});
async function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger.warn({ msg: 'Missing authorization header' });
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        const user = await prismaClient_1.prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, email: true, roles: true } });
        if (!user) {
            logger.warn({ msg: 'User not found', userId: payload.sub });
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = user;
        return next();
    }
    catch (err) {
        logger.error({ err }, 'JWT verification failed');
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
