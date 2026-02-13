import { motion } from "framer-motion";
import { TrendingUp, Lightbulb, Copy, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Report } from "@/lib/api";
import { useState } from "react";
import { generateReportPDF } from "@/lib/pdfGenerator";

interface AnalysisViewProps {
  report: Report;
}

const AnalysisView = ({ report }: AnalysisViewProps) => {
  const [copied, setCopied] = useState(false);
  const { summary } = report;
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const normalizeData = (data: any): string[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "object") {
      return Object.entries(data).map(([key, value]) => `${key}: ${value}`);
    }
    return [String(data)];
  };

  const trends = normalizeData(summary.trends);
  const recommendations = normalizeData(summary.recommendations);

  const handleCopy = () => {
    const text = `CSV Insights Report: ${report.filename}\n\nSummary:\n${summary.summary}\n\nTrends:\n${trends.map((t) => `• ${t}`).join("\n")}\n\nRecommendations:\n${recommendations.map((r) => `• ${r}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setTimeout(async () => {
      await generateReportPDF(report, "report-charts-container");
      setIsGeneratingPdf(false);
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">AI Summary</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              {isGeneratingPdf ? "Generating..." : "Download PDF"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="ml-1.5 text-xs">{copied ? "Copied" : "Copy Report"}</span>
            </Button>
          </div>
        </div>
        <p className="text-secondary-foreground leading-relaxed">{summary.summary}</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground">Trends & Outliers</h3>
        </div>
        <ul className="space-y-2">
          {trends.length > 0 ? (
            trends.map((trend, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2 text-secondary-foreground"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {trend}
              </motion.li>
            ))
          ) : (
            <li className="text-secondary-foreground italic text-sm">No specific trends identified.</li>
          )}
        </ul>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-warning" />
          <h3 className="font-semibold text-foreground">Recommendations</h3>
        </div>
        <ul className="space-y-2">
          {recommendations.length > 0 ? (
            recommendations.map((rec, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2 text-secondary-foreground"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
                {rec}
              </motion.li>
            ))
          ) : (
            <li className="text-secondary-foreground italic text-sm">No recommendations available.</li>
          )}
        </ul>
      </div>
    </motion.div>
  );
};

export default AnalysisView;
