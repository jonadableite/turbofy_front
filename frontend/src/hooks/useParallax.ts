"use client";

import { useScroll, useTransform, MotionValue } from "framer-motion";

export function useParallax(range: [number, number] = [10, -10]): MotionValue<number> {
  const { scrollYProgress } = useScroll();
  return useTransform(scrollYProgress, [0, 1], range);
}

