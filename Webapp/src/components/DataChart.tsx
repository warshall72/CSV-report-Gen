import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface DataChartProps {
  headers: string[];
  rows: string[][];
}

const DataChart = ({ headers, rows }: DataChartProps) => {
  const chartData = useMemo(() => {
    // Find first numeric column
    const numericColIndex = headers.findIndex((_, i) =>
      rows.every((row) => !isNaN(Number(row[i])) && row[i] !== "")
    );
    if (numericColIndex === -1) return null;

    // Use first non-numeric column as label, or index
    const labelColIndex = headers.findIndex((_, i) =>
      i !== numericColIndex && rows.some((row) => isNaN(Number(row[i])))
    );

    return rows.slice(0, 20).map((row, i) => ({
      label: labelColIndex >= 0 ? row[labelColIndex] : `Row ${i + 1}`,
      value: Number(row[numericColIndex]),
    }));
  }, [headers, rows]);

  if (!chartData) return null;

  const numericHeader = headers[headers.findIndex((_, i) =>
    rows.every((row) => !isNaN(Number(row[i])) && row[i] !== "")
  )];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
      id="report-charts-container"
    >
      <h3 className="font-semibold text-foreground mb-4">
        Distribution: {numericHeader}
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(230 15% 20%)" />
          <XAxis
            dataKey="label"
            tick={{ fill: "hsl(220 10% 55%)", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "hsl(230 15% 20%)" }}
          />
          <YAxis
            tick={{ fill: "hsl(220 10% 55%)", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "hsl(230 15% 20%)" }}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(230 20% 12%)",
              border: "1px solid hsl(230 15% 20%)",
              borderRadius: "0.75rem",
              color: "hsl(220 20% 95%)",
            }}
          />
          <Bar dataKey="value" fill="hsl(245 58% 58%)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default DataChart;
