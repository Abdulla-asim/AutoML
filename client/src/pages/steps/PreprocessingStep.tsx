import { usePreprocess, getUploadData } from "@/hooks/use-automl";
import { StepCard } from "@/components/ui/StepCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Settings2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function PreprocessingStep({ onNext }: { onNext: () => void }) {
  const uploadData = getUploadData();
  const { mutate: runPreprocess, isPending, error } = usePreprocess();
  const [data, setData] = useState<any | null>(null);

  // Form state for preprocessing parameters
  const [params, setParams] = useState({
    missing_strategy: "Mean",
    outlier_method: "Remove",
    scaling_method: "Standard",
    encoding_method: "OneHot",
    test_size: 0.2,
    impute_constant: ""
  });

  const handleRun = () => {
    // Prepare parameters including target column from upload data
    const preprocessParams = {
      ...params,
      target: uploadData?.targetCol,
      impute_constant: params.impute_constant || undefined
    };
    runPreprocess(preprocessParams, {
      onSuccess: (res) => setData(res)
    });
  };

  return (
    <StepCard
      title="Data Preprocessing"
      description="Clean, encode, and scale your data for optimal model performance."
    >
      <div className="space-y-8">
        {!data && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <motion.div
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 bg-gradient-to-br from-pink-500/20 to-accent/20 rounded-full flex items-center justify-center mx-auto text-accent"
              >
                <Settings2 className="w-10 h-10" />
              </motion.div>
              <h3 className="text-2xl font-display font-bold mt-4">Configure Preprocessing</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Customize how your data will be cleaned and prepared for model training.
              </p>
            </div>

            <Card className="p-6 bg-gradient-to-br from-card to-secondary/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Missing Value Strategy */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Missing Value Strategy
                  </label>
                  <select
                    value={params.missing_strategy}
                    onChange={(e) => setParams({ ...params, missing_strategy: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="Mean">Mean Imputation</option>
                    <option value="Median">Median Imputation</option>
                    <option value="Mode">Mode Imputation</option>
                    <option value="Drop">Drop Missing Rows</option>
                    <option value="Constant">Constant Value</option>
                  </select>
                  {params.missing_strategy === "Constant" && (
                    <input
                      type="text"
                      placeholder="Enter constant value"
                      value={params.impute_constant}
                      onChange={(e) => setParams({ ...params, impute_constant: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-accent mt-2"
                    />
                  )}
                </div>

                {/* Outlier Handling */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Outlier Handling
                  </label>
                  <select
                    value={params.outlier_method}
                    onChange={(e) => setParams({ ...params, outlier_method: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="Remove">Remove Outliers</option>
                    <option value="Cap">Cap Outliers (Winsorization)</option>
                    <option value="Keep">Keep Outliers</option>
                  </select>
                </div>

                {/* Scaling Method */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Feature Scaling Method
                  </label>
                  <select
                    value={params.scaling_method}
                    onChange={(e) => setParams({ ...params, scaling_method: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="Standard">Standard Scaler (Z-score)</option>
                    <option value="MinMax">Min-Max Scaler</option>
                    <option value="Robust">Robust Scaler</option>
                    <option value="None">No Scaling</option>
                  </select>
                </div>

                {/* Encoding Method */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Categorical Encoding
                  </label>
                  <select
                    value={params.encoding_method}
                    onChange={(e) => setParams({ ...params, encoding_method: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="OneHot">One-Hot Encoding</option>
                    <option value="Label">Label Encoding</option>
                    <option value="Ordinal">Ordinal Encoding</option>
                  </select>
                </div>

                {/* Test Size */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-foreground">
                    Test Set Size (0.1 - 0.5)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0.1"
                      max="0.5"
                      step="0.05"
                      value={params.test_size}
                      onChange={(e) => setParams({ ...params, test_size: parseFloat(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-lg font-semibold text-accent min-w-[4rem] text-center">
                      {(params.test_size * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(params.test_size * 100).toFixed(0)}% for testing, {((1 - params.test_size) * 100).toFixed(0)}% for training
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={handleRun}
                disabled={isPending}
                className="px-8 shadow-lg shadow-accent/20 bg-gradient-to-r from-pink-500 to-accent hover:from-pink-600 hover:to-accent/90 text-accent-foreground transition-all hover:shadow-xl hover:-translate-y-1"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      ⚙️
                    </motion.span>
                    Processing...
                  </span>
                ) : "Run Preprocessing Pipeline"}
              </Button>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {data && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* Success Message */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                    Preprocessing Completed Successfully!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Your data has been cleaned, transformed, and split for training.
                  </p>
                </div>
              </div>
            </Card>

            {/* Configuration Applied */}
            <Card className="p-6 bg-gradient-to-br from-card to-secondary/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-accent" />
                Configuration Applied
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                  <span className="text-sm font-medium text-muted-foreground">Missing Values</span>
                  <span className="text-sm font-semibold">{params.missing_strategy}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                  <span className="text-sm font-medium text-muted-foreground">Outlier Handling</span>
                  <span className="text-sm font-semibold">{params.outlier_method}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                  <span className="text-sm font-medium text-muted-foreground">Feature Scaling</span>
                  <span className="text-sm font-semibold">{params.scaling_method}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                  <span className="text-sm font-medium text-muted-foreground">Encoding Method</span>
                  <span className="text-sm font-semibold">{params.encoding_method}</span>
                </div>
                <div className="md:col-span-2 flex justify-between items-center p-3 bg-background rounded-lg border">
                  <span className="text-sm font-medium text-muted-foreground">Train/Test Split</span>
                  <span className="text-sm font-semibold">
                    {((1 - params.test_size) * 100).toFixed(0)}% Train / {(params.test_size * 100).toFixed(0)}% Test
                  </span>
                </div>
              </div>
            </Card>

            {/* Data Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-sm uppercase tracking-wider font-semibold text-muted-foreground mb-4">Training Data</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="font-medium">Samples</span>
                    <span className="text-muted-foreground font-mono">{data.Splitted_data?.train_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Features</span>
                    <span className="text-muted-foreground font-mono">
                      {data.Splitted_data?.X_train?.[0] ? Object.keys(data.Splitted_data.X_train[0]).length : 0}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-sm uppercase tracking-wider font-semibold text-muted-foreground mb-4">Test Data</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="font-medium">Samples</span>
                    <span className="text-muted-foreground font-mono">{data.Splitted_data?.test_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Features</span>
                    <span className="text-muted-foreground font-mono">
                      {data.Splitted_data?.X_test?.[0] ? Object.keys(data.Splitted_data.X_test[0]).length : 0}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-sm uppercase tracking-wider font-semibold text-muted-foreground mb-4">Data Cleaning</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="font-medium">Original Rows</span>
                    <span className="text-muted-foreground font-mono">{data.original_rows || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="font-medium">Final Rows</span>
                    <span className="text-muted-foreground font-mono">{data.final_rows || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Rows Removed</span>
                    <span className="text-red-600 dark:text-red-400 font-mono font-semibold">
                      {data.rows_removed || 0}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Data Preview */}
            {data.Splitted_data?.X_train && data.Splitted_data.X_train.length > 0 && (
              <Card className="overflow-hidden">
                <div className="px-6 py-4 bg-muted/30 border-b">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Processed Data Preview
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">First 5 rows of training data after preprocessing</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        {data.Splitted_data.X_train[0] && Object.keys(data.Splitted_data.X_train[0]).map((col: string) => (
                          <th key={col} className="px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {data.Splitted_data.X_train.map((row: any, idx: number) => (
                        <tr key={idx} className="hover:bg-muted/30">
                          {Object.values(row).map((val: any, colIdx: number) => (
                            <td key={colIdx} className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                              {typeof val === 'number' ? val.toFixed(4) : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            <div className="flex justify-end pt-4">
              <Button
                size="lg"
                onClick={onNext}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Proceed to Model Training
              </Button>
            </div>
          </div>
        )}
      </div>
    </StepCard>
  );
}
