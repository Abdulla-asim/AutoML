import { useRunEDA } from "@/hooks/use-automl";
import { StepCard } from "@/components/ui/StepCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { BarChart as BarIcon, Search, TrendingUp, PieChart as PieIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useState } from "react";
import { motion } from "framer-motion";

// Color palette for charts
const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#06b6d4', '#84cc16'];

export function EdaStep({ onNext }: { onNext: () => void }) {
  const { mutate: runEda, isPending, error } = useRunEDA();
  const [data, setData] = useState<any | null>(null);

  const handleRun = () => {
    runEda(undefined, {
      onSuccess: (res) => setData(res)
    });
  };

  // Prepare missing values for chart
  const missingData = data?.missing_values
    ? Object.entries(data.missing_values)
      .filter(([_, count]) => (count as number) > 0)
      .map(([col, count]) => ({ name: col, count: count as number }))
    : [];

  // Prepare distribution data
  const distributionData = data?.distributions?.distributions || {};
  const hasDistributions = Object.keys(distributionData).length > 0;

  // Prepare categorical data
  const categoricalData = data?.categorical?.value_counts || {};
  const hasCategorical = Object.keys(categoricalData).length > 0;

  // Prepare train/test split data
  const splitData = data?.train_test_split;
  const hasSplit = splitData?.total_samples > 0;

  return (
    <StepCard
      title="Exploratory Data Analysis"
      description="Analyze descriptive statistics, missing values, and data distributions."
    >
      <div className="space-y-8">
        {!data && (
          <div className="text-center py-16 space-y-6">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto text-primary"
            >
              <BarIcon className="w-12 h-12" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-display font-bold">Ready to Analyze?</h3>
              <p className="text-muted-foreground mt-3 max-w-md mx-auto">
                We will compute statistical summaries and generate comprehensive visualizations for your dataset.
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleRun}
              disabled={isPending}
              className="px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-1"
            >
              {isPending ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mr-2 inline-block"
                  >
                    ⏳
                  </motion.span>
                  Running Analysis...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" /> Run Analysis
                </>
              )}
            </Button>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {data && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Descriptive Stats Table */}
            <Card className="p-6 overflow-hidden shadow-md">
              <div className="px-0 py-0 mb-4 pb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Descriptive Statistics
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="text-left">Column</th>
                      <th className="text-right">Mean</th>
                      <th className="text-right">Std Dev</th>
                      <th className="text-right">Min</th>
                      <th className="text-right">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.stats || {}).slice(0, 10).map(([col, stats]) => (
                      <tr key={col}>
                        <td className="font-medium text-foreground">{col}</td>
                        <td className="text-right">{(stats as any)['mean']?.toFixed(2) || '-'}</td>
                        <td className="text-right">{(stats as any)['std']?.toFixed(2) || '-'}</td>
                        <td className="text-right">{(stats as any)['min']?.toFixed(2) || '-'}</td>
                        <td className="text-right">{(stats as any)['max']?.toFixed(2) || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {Object.keys(data.stats || {}).length > 10 && (
                  <div className="p-2 text-center text-xs text-muted-foreground bg-muted/20">
                    Showed top 10 numeric columns
                  </div>
                )}
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Missing Values Chart */}
              {missingData.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-destructive flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Missing Values Detected
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={missingData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" label={{ value: 'Missing Count', position: 'bottom', offset: 0 }} />
                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} label={{ value: 'Features', angle: -90, position: 'insideLeft' }} />
                        <Tooltip
                          cursor={{ fill: 'transparent' }}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}

              {/* Train/Test Split */}
              {hasSplit && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <PieIcon className="w-5 h-5 text-primary" />
                    Train/Test Split
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Train', value: splitData.train_samples },
                            { name: 'Test', value: splitData.test_samples }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#3b82f6" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground text-center">
                    <p>Total Samples: {splitData.total_samples}</p>
                    <p>Train: {splitData.train_samples} | Test: {splitData.test_samples}</p>
                  </div>
                </Card>
              )}
            </div>

            {/* Distribution Plots */}
            {hasDistributions && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Feature Distributions
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(distributionData).map(([column, dist]: [string, any], idx) => {
                    const chartData = dist.bin_centers.map((center: number, i: number) => ({
                      bin: center.toFixed(2),
                      count: dist.values[i]
                    }));

                    return (
                      <Card key={column} className="p-6">
                        <h4 className="text-md font-semibold mb-4 text-foreground">{column}</h4>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 60, left: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="bin"
                                tick={{ fontSize: 10 }}
                                angle={-45}
                                textAnchor="end"
                                height={70}
                                label={{ value: 'Value Range', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle' } }}
                              />
                              <YAxis tick={{ fontSize: 12 }} label={{ value: 'Frequency', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                              <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                              />
                              <Bar dataKey="count" fill={COLORS[idx % COLORS.length]} radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Categorical Plots */}
            {hasCategorical && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <BarIcon className="w-5 h-5 text-primary" />
                  Categorical Features
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(categoricalData).map(([column, cat]: [string, any], idx) => {
                    const chartData = cat.labels.map((label: string, i: number) => ({
                      name: label,
                      count: cat.values[i]
                    }));

                    return (
                      <Card key={column} className="p-6">
                        <h4 className="text-md font-semibold mb-4 text-foreground">{column}</h4>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 70, left: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="name"
                                tick={{ fontSize: 10 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                label={{ value: 'Categories', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle' } }}
                              />
                              <YAxis tick={{ fontSize: 12 }} label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                              <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                              />
                              <Bar dataKey="count" fill={COLORS[idx % COLORS.length]} radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          {cat.unique_count} unique values
                        </p>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button
                size="lg"
                onClick={onNext}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continue to Preprocessing
              </Button>
            </div>
          </div>
        )}
      </div>
    </StepCard>
  );
}
