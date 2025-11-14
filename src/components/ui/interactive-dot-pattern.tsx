"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InteractiveDotPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
  mouseInteraction?: boolean;
  [key: string]: unknown;
}

export function InteractiveDotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  mouseInteraction = true,
  ...props
}: InteractiveDotPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!mouseInteraction) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseInteraction]);

  const dots = Array.from(
    {
      length:
        Math.ceil(dimensions.width / width) *
        Math.ceil(dimensions.height / height),
    },
    (_, i) => {
      const col = i % Math.ceil(dimensions.width / width);
      const row = Math.floor(i / Math.ceil(dimensions.width / width));
      const dotX = col * width + cx;
      const dotY = row * height + cy;
      
      // Calcular distância do mouse
      const distance = mouseInteraction
        ? Math.sqrt(
            Math.pow(mousePosition.x - dotX, 2) +
            Math.pow(mousePosition.y - dotY, 2)
          )
        : 999;

      return {
        x: dotX,
        y: dotY,
        distance,
        delay: Math.random() * 2,
        duration: Math.random() * 2 + 1,
      };
    }
  );

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
      {...props}
    >
      <defs>
        <radialGradient id={`${id}-gradient-green`}>
          <stop offset="0%" stopColor="#a4e155" stopOpacity="1" />
          <stop offset="100%" stopColor="#a4e155" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-gradient-blue`}>
          <stop offset="0%" stopColor="#72879c" stopOpacity="1" />
          <stop offset="100%" stopColor="#72879c" stopOpacity="0" />
        </radialGradient>
      </defs>
       {dots.map((dot, index) => {
         const isNearMouse = mouseInteraction && dot.distance < 120;
         const opacity = isNearMouse ? Math.max(0.1, 1 - dot.distance / 120) * 0.5 : 0.08;
         const scale = isNearMouse ? 1 + (1 - dot.distance / 120) * 1.5 : 1;
         const useGreen = index % 3 === 0;

        return (
          <motion.circle
            key={`${dot.x}-${dot.y}`}
            cx={dot.x}
            cy={dot.y}
            r={cr}
            fill={
              isNearMouse
                ? useGreen
                  ? `url(#${id}-gradient-green)`
                  : `url(#${id}-gradient-blue)`
                : "currentColor"
            }
             initial={{ opacity: 0.08, scale: 1 }}
             animate={{
               opacity: isNearMouse ? opacity : 0.08,
               scale: isNearMouse ? scale : 1,
             }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
          />
        );
      })}
    </svg>
  );
}

