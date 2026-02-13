import groq from '../../config/groq';

const CHUNK_COUNT = 10;
const DELAY_MS = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeLargeData = async (data: any[]): Promise<any> => {
    const chunkSize = Math.ceil(data.length / CHUNK_COUNT);
    const chunks: any[][] = [];

    for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
    }

    console.log(`Analyzing large dataset: ${data.length} rows in ${chunks.length} chunks.`);

    const chunkInsights: any[] = [];

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        let chunkCsv = '';
        if (chunk.length > 0) {
            const headers = Object.keys(chunk[0]).join(',');
            const rows = chunk.map(row => Object.values(row).map(v => `"${v}"`).join(',')).join('\n');
            chunkCsv = `${headers}\n${rows}`;
        }

        const prompt = `
            Analyze this partial dataset chunk (${i + 1}/${chunks.length}).
            Data (CSV format):
            ${chunkCsv}
            
            Identify 3-5 interesting and specific trends, patterns, or anomalies in this chunk.
            **CRITICAL**: Include specific names, dates, product categories, and exact numerical values in your findings. Do not be vague. 
            Avoid saying "in this chunk". Treat it as part of a larger dataset.
            
            Return JSON: { "trends": ["detailed string with numbers and names", ...], "outliers": ["detailed string with specific values", ...] }
            Always generate at least 2 entries for trends.
        `;

        try {
            console.log(`Processing chunk ${i + 1}/${chunks.length}...`);
            const completion = await groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama-3.1-8b-instant',
                response_format: { type: 'json_object' }
            });

            const content = JSON.parse(completion.choices[0]?.message?.content || '{}');
            chunkInsights.push(content);
        } catch (e) {
            console.error(`Error processing chunk ${i + 1}`, e);
        }

        if (i < chunks.length - 1) {
            await sleep(DELAY_MS);
        }
    }

    const allInsightsStr = JSON.stringify(chunkInsights, null, 2);
    console.log('Merging insights...');

    const finalPrompt = `
        You are a senior data analyst. I have analyzed a large dataset in ${chunks.length} chunks.
        Here are the specific, detailed insights from each chunk:
        ${allInsightsStr}

        Synthesize these partial insights into a **Comprehensive Executive Report**.
        Your goal is to merge similar findings and create a unified narrative.
        
        1. **Global Trends**: Identify 3-5 major trends supported by data points across multiple chunks. Be very specific with categories, regions, dates, and values.
        2. **Significant Outliers**: Highlight the most critical anomalies that require attention.
        3. **Strategic Recommendations**: Provide actionable business advice based on the trends and outliers.
        4. **Executive Summary**: Write a **long, detailed narrative** (at least 4-5 paragraphs) describing the overall dataset behavior, key success factors, risk areas, and future outlook. Use professional business language.

        Return JSON object with keys: "trends", "outliers", "recommendations", "summary".
        Make the "trends", "outliers", and "recommendations" lists detailed (full sentences).
        The "summary" should be a substantial text block, not just a brief overview.
    `;

    const finalCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: finalPrompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' }
    });

    let finalAnalysis;
    try {
        finalAnalysis = JSON.parse(finalCompletion.choices[0]?.message?.content || '{}');
    } catch (e) {
        finalAnalysis = { raw: finalCompletion.choices[0]?.message?.content };
    }

    const reportPrompt = `
        You are a senior data analyst.
        I have analyzed a large dataset and generated these key findings:
        
        Summary: ${finalAnalysis.summary}
        Trends: ${JSON.stringify(finalAnalysis.trends)}
        Outliers: ${JSON.stringify(finalAnalysis.outliers)}
        Recommendations: ${JSON.stringify(finalAnalysis.recommendations)}

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
        - "charts": Array of chart objects obeying the schema above.
    `;

    const reportCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: reportPrompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' }
    });

    let finalOutput;
    try {
        finalOutput = JSON.parse(reportCompletion.choices[0]?.message?.content || '{}');
    } catch (e) {
        finalOutput = { finalReport: reportCompletion.choices[0]?.message?.content, charts: [] };
    }

    return {
        trends: finalAnalysis.trends || [],
        outliers: finalAnalysis.outliers || [],
        recommendations: finalAnalysis.recommendations || [],
        summary: finalAnalysis.summary || `Analyzed ${data.length} rows (Large Data Pipeline).`,
        report: finalOutput.finalReport || "Failed to generate report",
        charts: finalOutput.charts || []
    };
};
