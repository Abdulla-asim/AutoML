import { useGenerateReport, getStoredSessionId } from "@/hooks/use-automl";
import { StepCard } from "@/components/ui/StepCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/api/backend";
// Note: Using window size state for confetti dimensions.

export function ReportStep() {
  const { mutate: generate, isPending, error } = useGenerateReport();
  const [data, setData] = useState<any | null>(null);
  // Simple window size state for confetti
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    // Generate report immediately when mounting this step
    generate("markdown", {
      onSuccess: (res) => setData(res)
    });

    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [generate]);

  // Generate download URL
  const getDownloadUrl = () => {
    const sessionId = getStoredSessionId();
    if (!sessionId) return "#";
    return `${API_BASE_URL}/api/report/generate?session_id=${sessionId}&format=markdown`;
  };

  return (
    <StepCard
      title="Final Report"
      description="Summary of your AutoML pipeline and download link."
    >
      {data && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />}

      <div className="space-y-8">
        {isPending && (
          <div className="text-center py-20 space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full border-4 border-muted border-t-primary mx-auto"
            />
            <p className="text-muted-foreground font-medium">Compiling report...</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {data && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30"
              >
                <CheckCircle className="w-10 h-10" />
              </motion.div>
              <h2 className="text-3xl font-display font-bold text-foreground">Pipeline Completed!</h2>
              <p className="text-muted-foreground mt-2 text-lg">Your model is ready for deployment.</p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <a href={getDownloadUrl()} download target="_blank" rel="noreferrer">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-xl shadow-primary/20 px-8 py-4 text-base rounded-xl transition-all hover:-translate-y-1"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Report (Markdown)
                </Button>
              </a>
              <a href={`${API_BASE_URL}/api/report/generate?session_id=${getStoredSessionId()}&format=html`} download target="_blank" rel="noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-base rounded-xl transition-all hover:-translate-y-1"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download as HTML
                </Button>
              </a>
              <a href={`${API_BASE_URL}/api/report/generate?session_id=${getStoredSessionId()}&format=pdf`} download target="_blank" rel="noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-base rounded-xl transition-all hover:-translate-y-1 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download as PDF
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </StepCard>
  );
}
