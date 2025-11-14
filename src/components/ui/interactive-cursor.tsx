"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function InteractiveCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorVariant, setCursorVariant] = useState("default");

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a")
      ) {
        setIsHovering(true);
        setCursorVariant("button");
      } else if (target.classList.contains("cursor-text")) {
        setIsHovering(true);
        setCursorVariant("text");
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setCursorVariant("default");
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseEnter);
    document.addEventListener("mouseout", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseEnter);
      document.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [cursorX, cursorY]);

  const variants = {
    default: {
      width: 32,
      height: 32,
      backgroundColor: "rgba(164, 225, 85, 0.3)",
      mixBlendMode: "difference" as const,
    },
    button: {
      width: 64,
      height: 64,
      backgroundColor: "rgba(164, 225, 85, 0.5)",
      mixBlendMode: "difference" as const,
    },
    text: {
      width: 80,
      height: 4,
      backgroundColor: "rgba(164, 225, 85, 0.8)",
      mixBlendMode: "difference" as const,
    },
  };

  // Only show on desktop
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.innerWidth > 768);
  }, []);

  if (!isDesktop) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-50 rounded-full"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={cursorVariant}
      variants={variants}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    />
  );
}

