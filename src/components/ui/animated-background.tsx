"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedBackgroundProps {
  className?: string;
  variant?: "gradient" | "particles" | "waves";
  colors?: string[];
}

export function AnimatedBackground({
  className,
  variant = "gradient",
  colors = ["#a4e155", "#72879c"],
}: AnimatedBackgroundProps) {
  if (variant === "gradient") {
    return (
      <div className={cn("absolute inset-0 overflow-hidden", className)}>
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              `radial-gradient(circle at 0% 0%, ${colors[0]}15 0%, transparent 50%)`,
              `radial-gradient(circle at 100% 100%, ${colors[1]}15 0%, transparent 50%)`,
              `radial-gradient(circle at 0% 100%, ${colors[0]}15 0%, transparent 50%)`,
              `radial-gradient(circle at 100% 0%, ${colors[1]}15 0%, transparent 50%)`,
              `radial-gradient(circle at 0% 0%, ${colors[0]}15 0%, transparent 50%)`,
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    );
  }

  if (variant === "waves") {
    return (
      <div className={cn("absolute inset-0 overflow-hidden opacity-30", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${colors[i % colors.length]}20 50%, transparent 100%)`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}

