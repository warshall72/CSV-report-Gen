import { Request, Response, NextFunction } from 'express';
import * as ReportService from '../services/report.service';

export const createReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No CSV file uploaded' });
            return;
        }

        const report = await ReportService.generateReport(req.file);
        res.status(201).json(report);
    } catch (error) {
        next(error);
    }
};

export const getRecentReports = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reports = await ReportService.getRecentReports();
        res.json(reports);
    } catch (error) {
        next(error);
    }
};
