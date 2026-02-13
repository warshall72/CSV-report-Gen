import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { History, FileSpreadsheet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchReports, type Report } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface HistoryDrawerProps {
  onSelectReport: (report: Report) => void;
}

const HistoryDrawer = ({ onSelectReport }: HistoryDrawerProps) => {
  const { data: reports, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: fetchReports,
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <History className="w-4 h-4" />
          History
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">Recent Reports</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full bg-muted" />
            ))
          ) : reports?.length ? (
            reports.map((report) => (
              <button
                key={report.id}
                onClick={() => onSelectReport(report)}
                className="w-full text-left glass-card-hover p-4"
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {report.filename}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No reports yet
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HistoryDrawer;
