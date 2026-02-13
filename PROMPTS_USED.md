# Prompts Used

This document records the key prompts used during the development of the CSV Insights Dashboard to accelerate design and documentation tasks.

## 1. Frontend Design & UI Generation
**Context:** Generate a modern, clean UI for the dashboard and landing pages.
**Prompt:** Create a high fidelity, responsive React component for a CSV Dashboard....it should have a clean, modern aesthetic using Tailwind CSS. Include a sidebar navigation, a file upload dropzone with drag-and-drop functionality, and a placeholder area for data visualization charts. Use a glassmorphism effect for the cards

## 2. Unit Testing with Jest
**Context:** Creating test suites for the backend logic.
**Prompt:** Write a Jest test suite for a parseCsv utility function. The function takes a file path as input and returns a Promise resolving to an array of objects....test the success case with a valid CSV string....test the failure case with an invalid file path....mock the fs.createReadStream to avoid actual file system I/O

## 3. Documentation Generation
**Context:** Creating the project's README and other documentation.
**Prompt:** Generate a professional README.md for a 'CSV Insights Dashboard' project....Tech Stacks are Node.js, Express, React, PostgreSQL, Redis, Groq AI...Features are AI analysis, PDF export, caching....include sections for 'How to Run', 'What is Done', and 'Future Improvements'....format it clearly with code blocks for installation commands

## 4. LLM System Prompt Refinement
**Context:** Improving the quality and structure of the AI's analysis output.
**Prompt:** Refine the system prompt for a data analyst AI like Expert Data Scientist inputs will be Statistical summary of a CSV dataset (mean, min, max, etc.) The LLM should Identify 3 key trends and generate a JSON response with specific keys: 'summary', 'trends', and recommendations... make Sure the tone is professional and the output is strictly valid JSON without markdown formatting