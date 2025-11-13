"use client";

import React, { useId, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SparklesProps {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
}

export const SparklesCore: React.FC<SparklesProps> = ({
  id,
  className,
  background = "transparent",
  minSize = 1,
  maxSize = 3,
  speed = 2,
  particleColor = "#ffffff",
  particleDensity = 100,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const generatedId = useId();
  const effectId = id || generatedId;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const particles = React.useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) {
      return [];
    }

    const particleArray = [];
    const particleCount = Math.floor((dimensions.width * dimensions.height) / 10000) * (particleDensity / 100);

    for (let i = 0; i < particleCount; i++) {
      particleArray.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * (maxSize - minSize) + minSize,
        duration: Math.random() * speed + 1,
        delay: Math.random() * 2,
      });
    }

    return particleArray;
  }, [dimensions, maxSize, minSize, particleDensity, speed]);

  return (
    <div
      className={cn("absolute inset-0", className)}
      style={{ background }}
    >
      {particles.map((particle) => (
        <motion.div
          key={`${effectId}-${particle.id}`}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particleColor,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      ))}
    </div>
  );
};

