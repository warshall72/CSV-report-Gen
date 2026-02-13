export const mockGroqResponse = (args: any) => {
    // Determine context or random if needed, for now just static as per previous tests
    // But we can check args if we want different output for different steps

    // For small data (2 steps):
    // 1. Exploration Prompt (needs { questions: [] })
    // 2. Analysis Prompt (needs { trends: [], outliers: [], recommendations: [] })

    // For large data (chunks + synthesis):
    // Chunks return { trends: [], outliers: [] }
    // Final returns { trends: [], outliers: [], recommendations: [], summary: "..." }

    // Since we can't easily parse prompt string here to distinguish perfectly without regex,
    // let's return a comprehensive object that satisfies all schemas.

    return Promise.resolve({
        choices: [{
            message: {
                content: JSON.stringify({
                    // Exploration response
                    questions: ["Trend 1", "Trend 2", "Trend 3"],

                    // Chunk/Small Analysis response
                    trends: ["Sales are up"],
                    outliers: ["High value transaction ID 123"],

                    // Final Synthesis/Analysis response
                    recommendations: ["Focus on Q4"],
                    summary: "Mock AI Summary"
                })
            }
        }],
        id: 'mock-id',
        created: Date.now(),
        model: 'mock-model',
        object: 'chat.completion'
    });
};
