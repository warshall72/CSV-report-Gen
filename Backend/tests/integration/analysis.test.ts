
import path from 'path';
import fs from 'fs';
import { parseCsv } from '../../src/utils/csvParser';
import { analyzeData } from '../../src/services/ai.service';
import groq from '../../src/config/groq';
// import { mockGroqResponse } from '../mocks/groq.mock';

jest.setTimeout(120000); // 2 minutes for processing

describe('CSV Analysis Integration Tests (Real AI)', () => {
    let smallData: any[];
    let largeData: any[];
    // let groqSpy: jest.SpyInstance; // Remove spy

    // Use absolute path for output file
    const outputFilePath = path.join(__dirname, '../../AI_output.json');
    let resultsBuffer: Record<string, any> = {};

    beforeAll(async () => {
        // Load real files from uploads folder
        const smallFilePath = path.join(__dirname, '../../uploads/100 Sales Records.csv');
        const largeFilePath = path.join(__dirname, '../../uploads/1000 Sales Records.csv');

        // Parse them using our utility
        smallData = await parseCsv(smallFilePath);
        largeData = await parseCsv(largeFilePath);
    });

    // beforeEach(() => {
    //     // Spy on Groq to prevent real API calls and cost
    //     // Use externalized mock
    //     // groqSpy = jest.spyOn(groq.chat.completions, 'create').mockImplementation((() => mockGroqResponse({})) as any);
    // });

    // afterEach(() => {
    //     jest.clearAllMocks();
    // });

    afterAll(() => {
        // Write results to AI_output file
        fs.writeFileSync(outputFilePath, JSON.stringify(resultsBuffer, null, 2));
    });

    test('should analyze small dataset (<500 rows) using Small Service', async () => {
        expect(smallData.length).toBeLessThanOrEqual(500);

        const result = await analyzeData(smallData);
        // Only keep the report and summary for the output file
        resultsBuffer['smallResult'] = {
            summary: result.summary,
            report: result.report,
            charts: result.charts
        };

        expect(result).toBeDefined();
        // The mock returns a summary, so it overrides the default
        expect(result.summary).toBeDefined();
        expect(result.report).toBeDefined();
        expect(result.charts).toBeDefined();
        expect(result.report.length).toBeGreaterThan(100);
    });

    test('should analyze large dataset (>500 rows) using Large Service with Chunking', async () => {
        expect(largeData.length).toBeGreaterThan(500);

        const result = await analyzeData(largeData);
        // Only keep the report and summary for the output file
        resultsBuffer['largeResult'] = {
            summary: result.summary,
            report: result.report,
            charts: result.charts
        };

        expect(result).toBeDefined();
        expect(result.summary).toBeDefined();
        expect(result.report).toBeDefined();
        expect(result.charts).toBeDefined();
        expect(result.report.length).toBeGreaterThan(100);
    });
});
