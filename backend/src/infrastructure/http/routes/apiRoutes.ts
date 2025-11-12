/**
 * Rotas da API (/api/*)
 * Endpoints auxiliares como CSRF tokens
 */

import { Router, Request, Response } from 'express';
import { generateCsrfToken } from '../../security/csrf';
import { logger } from '../../logger';

const apiRouter = Router();

/**
 * GET /api/auth/csrf
 * Gera e retorna um token CSRF para proteção contra ataques CSRF
 */
apiRouter.get('/auth/csrf', (req: Request, res: Response) => {
  try {
    const csrfToken = generateCsrfToken();
    
    logger.debug({ ip: req.ip }, 'CSRF token generated');
    
    res.status(200).json({ csrfToken });
  } catch (error) {
    logger.error({ error }, 'Error generating CSRF token');
    res.status(500).json({ error: 'Failed to generate CSRF token' });
  }
});

export { apiRouter };

