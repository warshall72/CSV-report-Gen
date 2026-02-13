import { useCallback, useState } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

const FileUpload = ({ onFileSelect, isUploading }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file?.name.endsWith(".csv")) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-8 text-center transition-all duration-300 cursor-pointer ${
        isDragging ? "border-primary bg-primary/10 glow-primary" : ""
      } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById("csv-input")?.click()}
    >
      <input
        id="csv-input"
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleChange}
      />
      <AnimatePresence mode="wait">
        {selectedFile ? (
          <motion.div
            key="file"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <FileSpreadsheet className="w-12 h-12 text-primary" />
            <p className="text-foreground font-medium">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <Upload className="w-12 h-12 text-muted-foreground" />
            <p className="text-foreground font-medium">
              Drop your CSV file here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FileUpload;
