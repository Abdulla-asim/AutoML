import { useState, useEffect } from "react";
import { UploadStep } from "@/pages/steps/UploadStep";
import { EdaStep } from "@/pages/steps/EdaStep";
import { PreprocessingStep } from "@/pages/steps/PreprocessingStep";
import { TrainingStep } from "@/pages/steps/TrainingStep";
import { ReportStep } from "@/pages/steps/ReportStep";
import { useSession } from "@/hooks/use-automl";
import { AnimatePresence, motion } from "framer-motion";
import { UploadCloud, BarChart3, Settings, BrainCircuit, FileText, CheckCircle } from "lucide-react";

const steps = [
  { id: 1, name: "Upload", icon: UploadCloud, color: "from-blue-500 to-blue-600" },
  { id: 2, name: "EDA", icon: BarChart3, color: "from-purple-500 to-purple-600" },
  { id: 3, name: "Preprocessing", icon: Settings, color: "from-pink-500 to-pink-600" },
  { id: 4, name: "Training", icon: BrainCircuit, color: "from-indigo-500 to-indigo-600" },
  { id: 5, name: "Report", icon: FileText, color: "from-green-500 to-green-600" },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const { data: sessionData, isLoading } = useSession();

  const completedStep = sessionData?.currentStep || 1;

  useEffect(() => {
    if (sessionData?.currentStep) {
      setCurrentStep(sessionData.currentStep);
    }
  }, [sessionData?.currentStep]);

  const handleNext = () => {
    const next = currentStep + 1;
    setCurrentStep(next);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <UploadStep onNext={handleNext} />;
      case 2:
        return <EdaStep onNext={handleNext} />;
      case 3:
        return <PreprocessingStep onNext={handleNext} />;
      case 4:
        return <TrainingStep onNext={handleNext} />;
      case 5:
        return <ReportStep />;
      default:
        return <UploadStep onNext={handleNext} />;
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-4 border-muted border-t-primary"
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar with Progress Indicator */}
      <aside className="w-80 hidden md:flex flex-col bg-gradient-to-b from-card to-secondary/20 border-r border-border/50 shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <h1 className="text-2xl font-display font-bold text-foreground">AutoML</h1>
          <p className="text-sm text-muted-foreground mt-1">Smart Machine Learning Pipeline</p>
        </div>

        {/* Progress Steps */}
        <nav className="flex-1 p-6 space-y-6">
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4">Pipeline</h3>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-muted" />
              <div
                className="absolute left-5 top-10 w-0.5 bg-gradient-to-b from-primary to-accent transition-all duration-300"
                style={{
                  height: `${((Math.min(currentStep, 5) - 1) / 4) * 100}%`,
                  minHeight: "40px"
                }}
              />

              {/* Step Items */}
              <div className="space-y-4 relative z-10">
                {steps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isActive = step.id === currentStep;
                  const isCompleted = step.id < currentStep;
                  const isPending = step.id > completedStep;

                  return (
                    <motion.button
                      key={step.id}
                      onClick={() => step.id <= completedStep && setCurrentStep(step.id)}
                      disabled={isPending}
                      whileHover={!isPending ? { x: 4 } : {}}
                      className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : isCompleted
                            ? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/20 cursor-pointer"
                            : "text-muted-foreground opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                          isActive
                            ? "bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30"
                            : isCompleted
                              ? "bg-green-500 text-white"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium">{step.name}</div>
                        <div className="text-xs opacity-70">{`Step ${step.id} of 5`}</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="pt-6 border-t border-border/50">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/5 rounded-lg p-3">
                <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Progress</div>
                <div className="text-2xl font-bold text-primary mt-1">{currentStep}/5</div>
              </div>
              <div className="bg-accent/5 rounded-lg p-3">
                <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Status</div>
                <div className="text-xs text-accent font-semibold mt-1">{currentStep === 5 ? "Complete" : "In Progress"}</div>
              </div>
            </div>
          </div>
        </nav>

        {/* Footer Info */}
        <div className="p-6 border-t border-border/50 text-xs text-muted-foreground">
          <p>Complete each step sequentially to unlock the next phase of your AutoML pipeline.</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth">
        <div className="container mx-auto px-6 py-12 min-h-full flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
