import { useQuery } from "@tanstack/react-query";
import { fetchHealth } from "@/lib/api";
import { Server, Database, HardDrive, Brain, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const services = [
  { key: "backend" as const, label: "Backend", icon: Server, ok: "ok" },
  { key: "database" as const, label: "Database", icon: Database, ok: "connected" },
  { key: "redis" as const, label: "Redis", icon: HardDrive, ok: "connected" },
  { key: "llm" as const, label: "LLM Engine", icon: Brain, ok: "connected" },
];

const StatusGrid = () => {
  const { data, isLoading, isError, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    refetchInterval: 30000,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">System Status</h2>
          {dataUpdatedAt > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Last checked: {new Date(dataUpdatedAt).toLocaleTimeString()}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((service, i) => {
          const status = data?.[service.key];
          const isOk = status === service.ok;
          const Icon = service.icon;

          return (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isLoading
                      ? "bg-muted"
                      : isOk
                      ? "bg-success/15"
                      : "bg-destructive/15"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isLoading
                        ? "text-muted-foreground"
                        : isOk
                        ? "text-success"
                        : "text-destructive"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-medium text-foreground">{service.label}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isLoading
                          ? "bg-muted-foreground animate-pulse"
                          : isError
                          ? "bg-destructive"
                          : isOk
                          ? "bg-success"
                          : "bg-destructive"
                      }`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {isLoading
                        ? "Checking..."
                        : isError
                        ? "Unreachable"
                        : status ?? "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusGrid;
