import { Router } from 'express';
import { checkHealth } from '../controllers/health.controller';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health
 *     description: Returns the health status of the backend, database, and LLM connection
 *     responses:
 *       200:
 *         description: Health status
 */
router.get('/', checkHealth);

export default router;
