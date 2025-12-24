import { useTrainModels, getUploadData } from "@/hooks/use-automl";
import { StepCard } from "@/components/ui/StepCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { BrainCircuit, Trophy, Settings2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AVAILABLE_MODELS = [
  "Logistic Regression",
  "K-Neighbors Classifier",
  "Decision Tree Classifier",
  "Gaussian Naive Bayes",
  "Random Forest",
  "Support Vector Machine",
  "Decision Tree Rule-based"
];

export function TrainingStep({ onNext }: { onNext: () => void }) {
  const uploadData = getUploadData();
  const { mutate: train, isPending, error } = useTrainModels();
  const [data, setData] = useState<any | null>(null);

  // Form state for training parameters
  const [selectedModels, setSelectedModels] = useState<string[]>(AVAILABLE_MODELS);
  const [optimize, setOptimize] = useState(false);
  const [testSize, setTestSize] = useState(0.2);

  const toggleModel = (model: string) => {
    setSelectedModels(prev =>
      prev.includes(model)
        ? prev.filter(m => m !== model)
        : [...prev, model]
    );
  };

  const handleTrain = () => {
    if (selectedModels.length === 0) {
      alert("Please select at least one model to train");
      return;
    }

    const target = uploadData?.targetCol || "target";
    train({
      target,
      params: {
        models: selectedModels,
        optimize,
        test_size: testSize,
        random_state: 42
      }
    }, {
      onSuccess: (res) => setData(res)
    });
  };

  // Parse the response data to extract metrics
  const getMetricsData = () => {
    if (!data) return null;

    const metrics: any[] = [];
    let bestModel = "";
    let bestScore = -1;

    // Handle optimized response (Models + Tuned-Models)
    if (data["Tuned-Models"]) {
      Object.entries(data["Tuned-Models"]).forEach(([modelName, modelMetrics]: [string, any]) => {
        metrics.push({
          model_name: `${modelName} (Tuned)`,
          ...modelMetrics
        });
        const score = modelMetrics.f1_score || modelMetrics.f1 || modelMetrics.accuracy || 0;
        if (score > bestScore) {
          bestScore = score;
          bestModel = `${modelName} (Tuned)`;
        }
      });
    }

    // Handle regular models
    const modelsData = data.models || data.Models || {};
    Object.entries(modelsData).forEach(([modelName, modelMetrics]: [string, any]) => {
      metrics.push({
        model_name: modelName,
        ...modelMetrics
      });
      const score = modelMetrics.f1_score || modelMetrics.f1 || modelMetrics.accuracy || 0;
      if (score > bestScore) {
        bestScore = score;
        bestModel = modelName;
      }
    });

    return { metrics, bestModel };
  };

  const metricsData = getMetricsData();

  return (
    <StepCard
      title="Model Training & Evaluation"
      description="Select and train multiple machine learning models to find the best performer."
    >
      <div className="space-y-8">
        {!data && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400"
              >
                <BrainCircuit className="w-10 h-10" />
              </motion.div>
              <h3 className="text-2xl font-display font-bold mt-4">Configure Model Training</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Target Column: <span className="font-mono font-bold text-foreground">{uploadData?.targetCol || "Auto-detected"}</span>
              </p>
            </div>

            <Card className="p-6 bg-gradient-to-br from-card to-secondary/30">
              <div className="space-y-6">
                {/* Model Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-foreground">
                      Select Models to Train
                    </label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedModels(AVAILABLE_MODELS)}
                        className="text-xs"
                      >
                        Select All
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedModels([])}
                        className="text-xs"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {AVAILABLE_MODELS.map((model) => (
                      <label
                        key={model}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                          selectedModels.includes(model)
                            ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20"
                            : "border-border hover:border-indigo-300 hover:bg-muted/50"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={selectedModels.includes(model)}
                          onChange={() => toggleModel(model)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium">{model}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Hyperparameter Optimization */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-border hover:border-purple-300 cursor-pointer transition-all bg-gradient-to-r from-transparent to-purple-50/30 dark:to-purple-900/10">
                    <input
                      type="checkbox"
                      checked={optimize}
                      onChange={(e) => setOptimize(e.target.checked)}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-foreground">Enable Hyperparameter Optimization</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Automatically tune model parameters for better performance (takes longer)
                      </p>
                    </div>
                  </label>
                </div>

                {/* Test Size */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Test Set Size (0.1 - 0.5)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0.1"
                      max="0.5"
                      step="0.05"
                      value={testSize}
                      onChange={(e) => setTestSize(parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 min-w-[4rem] text-center">
                      {(testSize * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(testSize * 100).toFixed(0)}% for testing, {((1 - testSize) * 100).toFixed(0)}% for training
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={handleTrain}
                disabled={isPending || selectedModels.length === 0}
                className="px-8 shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white min-w-[200px] transition-all hover:shadow-xl hover:-translate-y-1"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="rounded-full h-4 w-4 border-2 border-white/50 border-t-white inline-block"
                    />
                    Training {selectedModels.length} Model{selectedModels.length !== 1 ? 's' : ''}...
                  </div>
                ) : `Train ${selectedModels.length} Model${selectedModels.length !== 1 ? 's' : ''}`}
              </Button>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {data && metricsData && metricsData.metrics.length > 0 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* Best Model Highlight */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Trophy className="w-8 h-8 text-yellow-300" />
                </div>
                <div>
                  <div className="text-indigo-100 text-sm font-medium uppercase tracking-wider">Champion Model</div>
                  <div className="text-3xl font-display font-bold">{metricsData.bestModel}</div>
                  <div className="text-indigo-100 text-xs mt-1 opacity-90">Selected for achieving the highest performance metrics</div>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-24 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            {/* Metrics Table */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-muted-foreground">Model Name</th>
                      <th className="px-6 py-4 text-right font-semibold text-muted-foreground">Accuracy</th>
                      <th className="px-6 py-4 text-right font-semibold text-muted-foreground">Precision</th>
                      <th className="px-6 py-4 text-right font-semibold text-muted-foreground">Recall</th>
                      <th className="px-6 py-4 text-right font-semibold text-muted-foreground">F1 Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {metricsData.metrics.map((model: any) => {
                      const isBest = model.model_name === metricsData.bestModel;
                      return (
                        <tr
                          key={model.model_name}
                          className={cn(
                            "transition-colors",
                            isBest ? "bg-indigo-50/50 dark:bg-indigo-900/10" : "hover:bg-muted/30"
                          )}
                        >
                          <td className="px-6 py-4 font-medium flex items-center gap-2">
                            {model.model_name}
                            {isBest && <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-700 font-bold uppercase">Best</span>}
                          </td>
                          <td className="px-6 py-4 text-right font-mono">{(model.accuracy || 0).toFixed(4)}</td>
                          <td className="px-6 py-4 text-right font-mono">{(model.precision || 0).toFixed(4)}</td>
                          <td className="px-6 py-4 text-right font-mono">{(model.recall || 0).toFixed(4)}</td>
                          <td className="px-6 py-4 text-right font-mono">{(model.f1_score || model.f1 || 0).toFixed(4)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="flex justify-end pt-4">
              <Button
                size="lg"
                onClick={onNext}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Generate Final Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </StepCard>
  );
}
