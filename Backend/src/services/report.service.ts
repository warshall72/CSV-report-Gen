import prisma from '../config/prisma';
import redisClient from '../config/redis';
import { analyzeData } from './ai.service';
import { parseCsv } from '../utils/csvParser';
import fs from 'fs';

const RECENT_REPORTS_KEY = 'recent_reports';
const FALLBACK_REPORTS_KEY = 'fallback_reports';

export const generateReport = async (file: Express.Multer.File) => {
    const input = file.buffer || file.path;
    if (!input) {
        throw new Error('File input missing');
    }
    const data = await parseCsv(input);
    const insights = await analyzeData(data);

    const reportData = {
        filename: file.originalname,
        fileUrl: file.path || `memory://${file.originalname}`,
        summary: insights,
        createdAt: new Date(),
    };

    try {
        const savedReport = await prisma.report.create({
            data: reportData,
        });

        try {
            await redisClient.del(RECENT_REPORTS_KEY);
        } catch (e) {
            console.error('Redis cache invalidation failed', e);
        }

        return savedReport;
    } catch (dbError) {
        console.error('Database save failed, using Redis fallback strategy', dbError);

        const fallbackReport = {
            ...reportData,
            id: -1 * Date.now(),
            source: 'redis_fallback'
        };

        try {
            await redisClient.lPush(FALLBACK_REPORTS_KEY, JSON.stringify(fallbackReport));
            await redisClient.lTrim(FALLBACK_REPORTS_KEY, 0, 4);
        } catch (redisError) {
            console.error('Redis fallback also failed', redisError);
        }

        return fallbackReport;
    }
};

export const getRecentReports = async () => {
    let dbReports: any[] = [];
    let fallbackReports: any[] = [];

    try {
        const raw = await redisClient.lRange(FALLBACK_REPORTS_KEY, 0, 4);
        if (raw) fallbackReports = raw.map(r => JSON.parse(r));
    } catch (e) {
        console.error('Redis fallback read failed', e);
    }

    try {
        const cached = await redisClient.get(RECENT_REPORTS_KEY);
        if (cached) {
            dbReports = JSON.parse(cached);
        } else {
            dbReports = await prisma.report.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
            });
            await redisClient.setEx(RECENT_REPORTS_KEY, 60, JSON.stringify(dbReports));
        }
    } catch (e) {
        console.error('DB or Redis Cache read failed', e);
    }

    const combined = [...fallbackReports, ...dbReports];
    combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return combined.slice(0, 5);
};
