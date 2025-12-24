import { useRunEDA } from "@/hooks/use-automl";
import { StepCard } from "@/components/ui/StepCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { BarChart as BarIcon, Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from "react";
import { motion } from "framer-motion";

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
        .filter(([_, count]) => count > 0)
        .map(([col, count]) => ({ name: col, count }))
    : [];

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
                We will compute statistical summaries and generate visualization plots for your dataset.
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 col-span-1 lg:col-span-2 overflow-hidden shadow-md">
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
                          <td className="text-right">{stats['mean']?.toFixed(2) || '-'}</td>
                          <td className="text-right">{stats['std']?.toFixed(2) || '-'}</td>
                          <td className="text-right">{stats['min']?.toFixed(2) || '-'}</td>
                          <td className="text-right">{stats['max']?.toFixed(2) || '-'}</td>
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

              {/* Missing Values Chart */}
              {missingData.length > 0 && (
                 <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-destructive">Missing Values Detected</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={missingData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                        <Tooltip 
                          cursor={{fill: 'transparent'}}
                          contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} 
                        />
                        <Bar dataKey="count" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                 </Card>
              )}

              {/* Generated Plots (Images from backend) */}
              {data.plot_images?.map((plot, i) => (
                <Card key={i} className="p-6 overflow-hidden">
                  <h3 className="text-lg font-semibold mb-4">{plot.title}</h3>
                  <div className="bg-white rounded-lg p-2 border">
                    <img 
                      src={`data:image/png;base64,${plot.image_base64}`} 
                      alt={plot.title} 
                      className="w-full h-auto object-contain max-h-[300px]"
                    />
                  </div>
                </Card>
              ))}
            </div>

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
