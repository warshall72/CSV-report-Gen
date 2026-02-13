import { Request, Response } from 'express';
import prisma from '../config/prisma';
import redisClient from '../config/redis';
import groq from '../config/groq';

export async function checkHealth(req: Request, res: Response): Promise<void> {
    require('fs').appendFileSync('debug.log', `Health check hit\n`);

    const healthStatus = {
        backend: 'ok',
        database: 'unknown',
        redis: 'unknown',
        llm: 'unknown',
    };

    try {
        await prisma.$queryRaw`SELECT 1`;
        healthStatus.database = 'connected';
    } catch (e: any) {
        healthStatus.database = `error: ${e.message}`;
    }

    try {
        if (redisClient.isOpen) {
            healthStatus.redis = 'connected';
        } else {
            await redisClient.ping();
            healthStatus.redis = 'connected';
        }
    } catch (e: any) {
        healthStatus.redis = `error: ${e.message}`;
    }

    try {
        await groq.models.list();
        healthStatus.llm = 'connected';
    } catch (e: any) {
        healthStatus.llm = `error: ${e.message}`;
    }

    res.json(healthStatus);
}
