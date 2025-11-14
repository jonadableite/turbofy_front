"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  action,
  className,
}: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/50 glass p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary/30",
        className
      )}
    >
      {/* Dotted Glow Background */}
      <DottedGlowBackground
        className="pointer-events-none"
        opacity={0.6}
        gap={10}
        radius={1.6}
        color="rgba(0, 0, 0, 0.25)"
        darkColor="rgba(255, 255, 255, 0.15)"
        glowColor="hsl(142, 71%, 45%)"
        darkGlowColor="hsl(142, 71%, 45%)"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.6}
        speedScale={1}
      />

      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0" />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              {title}
            </p>
            <div className="flex items-baseline gap-3 mb-2">
              <h3 className="text-3xl font-bold text-foreground">{value}</h3>
              {trend && (
                <span
                  className={cn(
                    "text-xs font-semibold flex items-center gap-1 px-2 py-1 rounded",
                    trend.isPositive
                      ? "text-[hsl(142_71%_45%)] bg-[hsl(142_71%_45%)]/10"
                      : "text-[hsl(0_72%_51%)] bg-[hsl(0_72%_51%)]/10"
                  )}
                >
                  <span className={trend.isPositive ? "text-[hsl(142_71%_45%)]" : "text-[hsl(0_72%_51%)]"}>
                    {trend.isPositive ? "↑" : "↓"}
                  </span>
                  {trend.value}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="rounded-lg bg-primary/20 backdrop-blur-sm p-3 border border-primary/30">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>

        {action && (
          <button
            onClick={action.onClick}
            className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {action.label}
          </button>
        )}
      </div>
    </motion.div>
  );
};

