##  AI Provider & Model
- **Provider**: **Groq**
- **Model**: **Llama 3 (8B & 70B)**
- **Reasoning**: Groq was chosen because it provides an extremely fast inferencing engine with a generous free tier, making it ideal for this project where cost and speed were primary constraints.

## What AI Did
- **Data Analysis Strategy**: The AI determines which questions are interesting to ask about a dataset based on its statistical distribution (e.g., "Is there a trend in sales?").
- **Insight Generation**: It generates the core narrative of the report, identifying trends, outliers, and providing business recommendations.
- **Chart Configuration**: The AI decides which data points are best visualized and generates the schema for the Recharts library.

## What Was Manuated / Checked
- **Statistical Foundation**: We did NOT rely on AI for math. We used `simple-statistics` to calculate min, max, mean, and standard deviation to ensure hard numbers were 100% accurate before feeding them to the AI context.
- **Data Parsing**: CSV parsing and validation were handled by robust libraries (`csv-parse`, `papaparse`) to prevent garbage-in-garbage-out.
- **Visual Rendering**: While AI suggested *what* to chart, the actual rendering is done by standard React components to ensure pixel-perfect and interactive UI.
