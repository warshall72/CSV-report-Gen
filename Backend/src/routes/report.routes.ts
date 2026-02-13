import { Router } from 'express';
import upload from '../middlewares/upload.middleware';
import { createReport, getRecentReports } from '../controllers/report.controller';

const router = Router();

/**
 * @swagger
 * /api/reports/upload:
 *   post:
 *     summary: Upload a CSV file and generate a report
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: The CSV file to analyze
 *     responses:
 *       200:
 *         description: Report generated successfully
 *       400:
 *         description: Bad request (invalid file or data)
 */
router.post('/upload', upload.single('file'), createReport);

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get the last 5 reports
 *     responses:
 *       200:
 *         description: List of recent reports
 */
router.get('/', getRecentReports);

export default router;
