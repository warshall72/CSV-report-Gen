const API_BASE = "http://localhost:4000/api";

export interface HealthStatus {
  backend: string;
  database: string;
  redis: string;
  llm: string;
}

export interface ReportSummary {
  summary: string;
  trends: string[] | Record<string, string>;
  recommendations: string[] | Record<string, string>;
  outliers: string[] | Record<string, string>;
  charts: any[];
}

export interface Report {
  id: number;
  filename: string;
  summary: ReportSummary;
  createdAt: string;
}

export async function fetchHealth(): Promise<HealthStatus> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}

export async function uploadReport(file: File): Promise<Report> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/reports/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function fetchReports(): Promise<Report[]> {
  const res = await fetch(`${API_BASE}/reports`);
  if (!res.ok) throw new Error("Failed to fetch reports");
  return res.json();
}
