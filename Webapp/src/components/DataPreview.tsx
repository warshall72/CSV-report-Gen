import { motion } from "framer-motion";

interface DataPreviewProps {
  headers: string[];
  rows: string[][];
}

const DataPreview = ({ headers, rows }: DataPreviewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      <div className="px-5 py-3 border-b border-border/50">
        <h3 className="text-sm font-medium text-muted-foreground">
          Preview — First {rows.length} rows
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border/30 last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2 text-foreground whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default DataPreview;
