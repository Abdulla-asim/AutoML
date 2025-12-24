import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StepCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function StepCard({ title, description, children, className }: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("w-full max-w-5xl mx-auto", className)}
    >
      <div className="mb-8">
        <h2 className="text-4xl font-display font-bold text-foreground">{title}</h2>
        {description && (
          <p className="text-base text-muted-foreground mt-2 font-light">{description}</p>
        )}
      </div>
      
      <div className="bg-card rounded-2xl shadow-lg shadow-primary/5 border border-border/50 p-8 md:p-10 relative overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Subtle gradient decoration */}
        <div className="absolute top-0 right-0 p-40 bg-gradient-to-br from-primary/8 to-accent/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
