"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthMetric {
  label: string;
  value: string;
  status: "success" | "warning" | "error";
  icon: React.ReactNode;
}

interface HealthStatusCardProps {
  metrics: HealthMetric[];
  className?: string;
}

export const HealthStatusCard = ({
  metrics,
  className,
}: HealthStatusCardProps) => {
  const getStatusColor = (status: HealthMetric["status"]) => {
    switch (status) {
      case "success":
        return "text-green-500";
      case "warning":
        return "text-orange-500";
      case "error":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={cn(
        "rounded-xl border border-border/50 glass p-6 shadow-lg",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg bg-primary/20 backdrop-blur-sm p-2 border border-primary/30">
          <RefreshCw className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Saúde da Conta</h2>
      </div>

      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className={cn("flex-shrink-0", getStatusColor(metric.status))}>
                {metric.icon}
              </div>
              <span className="text-sm font-medium text-foreground">
                {metric.label}
              </span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {metric.value}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

