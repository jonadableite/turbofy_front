"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
  duration?: number;
  delay?: number;
}

export function FloatingElement({
  children,
  className,
  intensity = "medium",
  duration = 3,
  delay = 0,
}: FloatingElementProps) {
  const intensityMap = {
    low: { y: 10, x: 5 },
    medium: { y: 20, x: 10 },
    high: { y: 30, x: 15 },
  };

  const movement = intensityMap[intensity];

  return (
    <motion.div
      className={cn(className)}
      animate={{
        y: [0, -movement.y, 0],
        x: [0, movement.x, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

// Floating element with mouse tracking
export function MouseTrackingElement({
  children,
  className,
  intensity = 0.05,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      animate={{
        x: 0,
        y: 0,
      }}
      whileHover={{
        scale: 1.05,
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * intensity;
        const y = (e.clientY - rect.top - rect.height / 2) * intensity;
        e.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translate(0px, 0px)";
      }}
    >
      {children}
    </motion.div>
  );
}

