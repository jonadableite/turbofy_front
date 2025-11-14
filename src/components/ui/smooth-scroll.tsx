"use client";

import { useEffect } from "react";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Smooth scroll com easing
    const handleScroll = (e: WheelEvent) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      
      e.preventDefault();
      
      const delta = e.deltaY;
      const scrollSpeed = 0.8; // Ajuste a velocidade
      
      window.scrollBy({
        top: delta * scrollSpeed,
        behavior: "auto",
      });
    };

    // Adicionar listener apenas em desktop
    if (window.innerWidth > 768) {
      window.addEventListener("wheel", handleScroll, { passive: false });
    }

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  return <>{children}</>;
}

