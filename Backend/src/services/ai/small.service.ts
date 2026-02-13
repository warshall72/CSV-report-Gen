import groq from '../../config/groq';
import * as ss from 'simple-statistics';

interface ColumnStats {
    name: string;
    type: string;
    min?: number;
    max?: number;
    mean?: number;
    uniqueCount?: number;
}

export const analyzeSmallData = async (data: any[]): Promise<any> => {
    const headers = Object.keys(data[0]);
    const stats: ColumnStats[] = headers.map(header => {
        const values = data.map(row => row[header]);
        const numericValues = values.map(v => parseFloat(v)).filter(v => !isNaN(v));
        const isNumeric = numericValues.length > values.length * 0.8;

        if (isNumeric && numericValues.length > 0) {
            return {
                name: header,
                type: 'numeric',
                min: ss.min(numericValues),
                max: ss.max(numericValues),
                mean: ss.mean(numericValues),
            };
        } else {
            const unique = new Set(values);
            return {
                name: header,
                type: 'categorical',
                uniqueCount: unique.size,
            };
        }
    });

    const statsSummary = JSON.stringify(stats, null, 2);
    const sampleData = JSON.stringify(data.slice(0, 5), null, 2);

    const explorationPrompt = `
        You are a data analyst. check these column stats and sample data:
        Stats: ${statsSummary}
        Sample: ${sampleData}
        
        Identify 3 key questions or areas to investigate for insights (e.g., specific trends, outliers, correlations).
        Return purely a JSON array of strings, e.g., ["Trend of sales over time", "Outliers in price", "Correlation between X and Y"].
    `;

    const step1Completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: explorationPrompt }],
        model: 'llama-3.1-8b-instant',
        response_format: { type: 'json_object' }
    });

    const keyQuestions = JSON.parse(step1Completion.choices[0]?.message?.content || '{"questions": []}');
    const questions = keyQuestions.questions || keyQuestions;

    const analysisPrompt = `
        You are a data analyst. 
        Stats: ${statsSummary}
        Sample: ${sampleData}
        Questions to answer: ${JSON.stringify(questions)}
        
        Provide a concise analysis for each question based on the stats.
        Return a JSON object with keys "trends", "outliers", "recommendations".
    `;

    const step2Completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: analysisPrompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' }
    });

    let analysis;
    try {
        analysis = JSON.parse(step2Completion.choices[0]?.message?.content || '{}');
    } catch (e) {
        analysis = { raw: step2Completion.choices[0]?.message?.content };
    }

    const finalReportPrompt = `
        You are a senior data analyst.
        I have performed a statistical analysis on a dataset.
        
        Here are the findings from the preliminary analysis:
        ${JSON.stringify(analysis, null, 2)}
        
        Dataset Stats:
        ${statsSummary}

        1. Write a COMPLETE, LONG-FORM EXECUTIVE REPORT based on these findings (detailed, professional, huge numbers).
        2. Generate 3-4 suitable datasets for visualizing these insights using Recharts.

        **CRITICAL: STRICT CHART SCHEMA**
        You must return the charts in this EXACT JSON structure. Do not deviate.
        
        "charts": [
            {
                "title": "Chart Title",
                "type": "bar" | "line" | "pie" | "area",
                "data": [
                    { "name": "Label 1", "value": 100 },
                    { "name": "Label 2", "value": 200 }
                ],
                "dataKeys": ["value"] 
            }
        ]
        
        Rules for Charts:
        - "data" must be an array of objects.
        - Each object MUST have a "name" (string) key for the X-axis/Legend.
        - Each object MUST have at least one numeric key (like "value", "revenue", "profit").
        - "dataKeys" must list the numeric keys present in the data objects (e.g. ["revenue", "profit"]).
        - Do not nest data. Keep it flat.

        Return valid JSON with keys:
        - "finalReport": Full markdown text.
        - "summary": A 2-3 sentence executive summary of the entire analysis.
        - "charts": Array of chart objects obeying the schema above.
    `;

    const step3Completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: finalReportPrompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' }
    });

    let finalOutput;
    try {
        finalOutput = JSON.parse(step3Completion.choices[0]?.message?.content || '{}');
    } catch (e) {
        finalOutput = { finalReport: step3Completion.choices[0]?.message?.content, charts: [] };
    }

    return {
        summary: finalOutput.summary || `Analyzed ${data.length} rows (Small Data Pipeline).`,
        report: finalOutput.finalReport || "Failed to generate report.",
        charts: finalOutput.charts || [],
        trends: analysis.trends || [],
        recommendations: analysis.recommendations || [],
        outliers: analysis.outliers || []
    };
};
