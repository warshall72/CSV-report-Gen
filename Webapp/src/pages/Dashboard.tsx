import { useState, useCallback } from "react";
import Papa from "papaparse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadReport, type Report } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import DataPreview from "@/components/DataPreview";
import DataChart from "@/components/DataChart";
import AnalysisView from "@/components/AnalysisView";
import HistoryDrawer from "@/components/HistoryDrawer";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<string[][]>([]);
  const [allRows, setAllRows] = useState<string[][]>([]);
  const [report, setReport] = useState<Report | null>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: uploadReport,
    onSuccess: (data) => {
      setReport(data);
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });

  const handleFileSelect = useCallback((f: File) => {
    if (f.size === 0) {
      toast({
        title: "Empty File",
        description: "The selected file is empty. Please upload a valid CSV.",
        variant: "destructive",
      });
      return;
    }

    setFile(f);
    setReport(null);
    Papa.parse(f, {
      complete: (result) => {
        const data = result.data as string[][];
        // Filter out completely empty rows
        const validRows = data.filter(row => row.some(cell => cell.trim() !== ""));

        if (validRows.length < 2) {
          toast({
            title: "Invalid Data",
            description: "The CSV file must contain a header and at least one row of data.",
            variant: "destructive",
          });
          setFile(null);
          setParsedHeaders([]);
          setParsedRows([]);
          setAllRows([]);
          return;
        }

        setParsedHeaders(validRows[0]);
        setParsedRows(validRows.slice(1, 6)); // First 5 rows for preview
        setAllRows(validRows.slice(1));
      },
      error: (error) => {
        toast({
          title: "Parse Error",
          description: `Failed to parse CSV: ${error.message}`,
          variant: "destructive",
        });
      }
    });
  }, []);

  const handleHistorySelect = (r: Report) => {
    setReport(r);
    setFile(null);
    setParsedHeaders([]);
    setParsedRows([]);
    setAllRows([]);
  };

  return (
    <div className="min-h-screen pt-14">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Upload a CSV to get AI-powered insights
            </p>
          </div>
          <HistoryDrawer onSelectReport={handleHistorySelect} />
        </div>

        {/* Upload */}
        <FileUpload
          onFileSelect={handleFileSelect}
          isUploading={mutation.isPending}
        />

        {/* Preview */}
        {parsedHeaders.length > 0 && (
          <>
            <DataPreview headers={parsedHeaders} rows={parsedRows} />

            {!report && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <Button
                  size="lg"
                  className="gap-2 glow-primary"
                  onClick={() => file && mutation.mutate(file)}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Insights
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </>
        )}

        {/* Loading state */}
        {mutation.isPending && (
          <div className="glass-card p-8 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">
              AI is analyzing your data...
            </p>
          </div>
        )}

        {/* Error */}
        {mutation.isError && (
          <div className="glass-card p-5 border-destructive/30 bg-destructive/5">
            <p className="text-destructive text-sm">
              Failed to analyze. Make sure the backend is running at localhost:3000.
            </p>
          </div>
        )}

        {/* Results */}
        {report && (
          <>
            <AnalysisView report={report} />
            {allRows.length > 0 && (
              <DataChart headers={parsedHeaders} rows={allRows} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
