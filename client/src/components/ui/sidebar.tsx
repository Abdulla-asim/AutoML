import { cn } from "@/lib/utils";
import { 
  UploadCloud, 
  BarChart, 
  Settings2, 
  BrainCircuit, 
  FileText,
  CheckCircle2,
  Lock
} from "lucide-react";

interface Step {
  id: number;
  label: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  { id: 1, label: "Data Upload", icon: UploadCloud },
  { id: 2, label: "Exploratory Data Analysis", icon: BarChart },
  { id: 3, label: "Preprocessing", icon: Settings2 },
  { id: 4, label: "Model Training", icon: BrainCircuit },
  { id: 5, label: "Final Report", icon: FileText },
];

interface SidebarProps {
  currentStep: number;
  completedStep: number; // Highest step reached
  onStepClick: (step: number) => void;
  className?: string;
}

export function Sidebar({ currentStep, completedStep, onStepClick, className }: SidebarProps) {
  return (
    <div className={cn("flex flex-col h-full bg-card border-r border-border", className)}>
      <div className="p-6 border-b border-border/50">
        <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AutoML Studio
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Intelligent pipeline generator</p>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = completedStep >= step.id; // Changed logic: if current is 2, step 1 is complete.
          // Step is unlocked if it's <= completedStep + 1 (can proceed to next) OR if it was already visited.
          // For simplicity in this wizard, usually:
          // You can go back to any previous step.
          // You can go to current step.
          // You CANNOT go to future steps (unless they were already completed in a previous session, but simplistic here).
          const isLocked = step.id > completedStep;

          return (
            <button
              key={step.id}
              disabled={isLocked}
              onClick={() => onStepClick(step.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                  : isLocked 
                    ? "text-muted-foreground/50 cursor-not-allowed" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/20"
              )}>
                <step.icon className="w-5 h-5" />
              </div>
              
              <span className="flex-1 text-left">{step.label}</span>
              
              {step.id < completedStep && (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              )}
              {isLocked && (
                <Lock className="w-3 h-3 text-muted-foreground/30" />
              )}
              
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-border/50">
        <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
          <p className="font-semibold mb-1">Session ID:</p>
          <code className="block bg-background p-1.5 rounded border border-border overflow-hidden text-ellipsis whitespace-nowrap">
            {typeof window !== 'undefined' ? localStorage.getItem("automl_session_id")?.slice(0, 18) + "..." : "..."}
          </code>
        </div>
      </div>
    </div>
  );
}
