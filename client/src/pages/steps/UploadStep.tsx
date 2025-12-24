import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import { useUploadDataset, setUploadData } from "@/hooks/use-automl";
import { StepCard } from "@/components/ui/StepCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export function UploadStep({ onNext }: { onNext: () => void }) {
  const [data, setData] = useState<any | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string>("");
  const { mutate: upload, isPending, error } = useUploadDataset();

  // Update selected target when data changes
  useEffect(() => {
    if (data?.targetCol) {
      setSelectedTarget(data.targetCol);
    }
  }, [data]);

  // Handle target column change
  const handleTargetChange = (newTarget: string) => {
    setSelectedTarget(newTarget);
    // Update the stored upload data
    if (data) {
      const updatedData = { ...data, targetCol: newTarget };
      setData(updatedData);
      setUploadData(updatedData);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      upload(acceptedFiles[0], {
        onSuccess: (responseData) => {
          setData(responseData);
        }
      });
    }
  }, [upload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls', '.xlsx']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <StepCard
      title="Upload Dataset"
      description="Start by uploading your CSV or Excel file. We'll analyze the structure automatically."
    >
      <div className="space-y-8">
        {/* Dropzone Area */}
        <div
          {...getRootProps()}
          className={`
            border-4 border-dashed rounded-3xl p-20 text-center transition-all duration-300 cursor-pointer
            flex flex-col items-center justify-center gap-8 group relative overflow-hidden
            ${isDragActive
              ? "border-primary bg-gradient-to-br from-blue-600/25 via-indigo-500/20 to-purple-600/15 scale-[1.02] shadow-2xl shadow-primary/40"
              : "border-blue-400/40 hover:border-indigo-500/60 hover:bg-gradient-to-br hover:from-blue-500/20 hover:via-indigo-400/15 hover:to-purple-500/10 hover:shadow-xl hover:shadow-primary/30"
            }
          `}
        >
          <input {...getInputProps()} />
          {/* Decorative background elements */}
          <div className="absolute top-0 left-1/4 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-purple-400/15 rounded-full blur-3xl" />

          <div className="relative">
            <motion.div
              animate={isDragActive ? { scale: [1, 1.15, 1], rotate: [0, 8, 0], y: [0, -5, 0] } : { scale: 1, rotate: 0, y: 0 }}
              transition={{ duration: isDragActive ? 0.6 : 0.3 }}
              className={`
                w-24 h-24 rounded-full transition-all duration-300 flex items-center justify-center
                ${isDragActive
                  ? "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl shadow-primary/50"
                  : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-primary/30 group-hover:from-blue-600 group-hover:to-purple-600 group-hover:shadow-xl group-hover:shadow-primary/40"
                }
              `}
            >
              <UploadCloud className="w-12 h-12" />
            </motion.div>
          </div>

          <div className="relative z-10 max-w-lg">
            <p className="text-3xl font-display font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent dark:from-blue-300 dark:to-purple-300">
              {isDragActive ? "Drop files here now!" : "Drag & drop your dataset"}
            </p>
            <p className="text-base text-muted-foreground mt-3 font-medium">
              CSV, Excel, or XLS • Maximum 50MB
            </p>
            <div className="mt-4 flex items-center justify-center gap-3 text-sm">
              <span className="w-12 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60" />
              <span className="text-muted-foreground font-medium">or click to browse</span>
              <span className="w-12 h-1 bg-gradient-to-l from-transparent via-purple-400 to-transparent opacity-60" />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Upload Failed</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isPending && (
          <div className="flex flex-col items-center py-12 space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 rounded-full border-4 border-muted border-t-primary"
            />
            <p className="text-muted-foreground animate-pulse font-medium">Analyzing file structure...</p>
          </div>
        )}

        {/* Success / Preview State */}
        {data && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 text-green-600 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Successfully loaded {data.fileName}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-7 stat-card bg-gradient-to-br from-blue-100/40 via-blue-50/60 to-cyan-50/40 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-cyan-900/20 border-2 border-blue-300/50 dark:border-blue-600/40 overflow-hidden relative shadow-lg hover:shadow-xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative flex items-center gap-4">
                  <div className="stat-icon bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="helper-text text-blue-700 dark:text-blue-300">Total Rows</div>
                    <div className="text-4xl font-bold font-display text-blue-900 dark:text-blue-100 mt-1">{data.rows.toLocaleString()}</div>
                  </div>
                </div>
              </Card>

              <Card className="p-7 stat-card bg-gradient-to-br from-indigo-100/40 via-indigo-50/60 to-purple-50/40 dark:from-indigo-900/30 dark:via-indigo-800/20 dark:to-purple-900/20 border-2 border-indigo-300/50 dark:border-indigo-600/40 overflow-hidden relative shadow-lg hover:shadow-xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-400/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative flex items-center gap-4">
                  <div className="stat-icon bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="helper-text text-indigo-700 dark:text-indigo-300">Features</div>
                    <div className="text-4xl font-bold font-display text-indigo-900 dark:text-indigo-100 mt-1">{data.columns.length}</div>
                  </div>
                </div>
              </Card>

              <Card className="p-7 stat-card bg-gradient-to-br from-pink-100/40 via-rose-50/60 to-orange-50/40 dark:from-pink-900/30 dark:via-rose-800/20 dark:to-orange-900/20 border-2 border-pink-300/50 dark:border-pink-600/40 overflow-hidden relative shadow-lg hover:shadow-xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-400/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative flex items-center gap-4">
                  <div className="stat-icon bg-gradient-to-br from-pink-600 to-orange-600 text-white shadow-lg shadow-pink-500/30">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="helper-text text-pink-700 dark:text-pink-300">Target Column</div>
                    <select
                      value={selectedTarget}
                      onChange={(e) => handleTargetChange(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm font-mono font-semibold"
                    >
                      <option value="">Select target column</option>
                      {data.columns.map((col: string) => (
                        <option key={col} value={col}>
                          {col} ({data.dtypes[col]})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>
            </div>

            {/* Data Preview Table */}
            <Card className="overflow-hidden shadow-md border-border/50">
              <div className="card-header-gradient px-6 py-4 border-b border-border/50">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Data Preview
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Showing first 5 rows and up to 8 columns</p>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      {data.columns.slice(0, 8).map(col => (
                        <th key={col} className="whitespace-nowrap">{col}</th>
                      ))}
                      {data.columns.length > 8 && <th className="text-muted-foreground">+{data.columns.length - 8} more</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {data.preview.slice(0, 5).map((row, i) => (
                      <tr key={i}>
                        {data.columns.slice(0, 8).map(col => (
                          <td key={`${i}-${col}`} className="whitespace-nowrap font-mono text-sm">{String(row[col]).substring(0, 30)}</td>
                        ))}
                        {data.columns.length > 8 && <td className="text-muted-foreground">...</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="flex justify-end pt-4">
              <Button
                size="lg"
                onClick={onNext}
                disabled={!selectedTarget}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to EDA
              </Button>
              {!selectedTarget && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2 mr-4">Please select a target column to continue</p>
              )}
            </div>
          </div>
        )}
      </div>
    </StepCard>
  );
}
