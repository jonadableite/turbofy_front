"use client";

import { ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: "slow" | "medium" | "fast";
  layer?: "background" | "midground" | "foreground";
  id?: string;
}

export function ParallaxSection({
  children,
  className,
  speed = "medium",
  layer = "midground",
  id,
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Verificar se o usuário prefere movimento reduzido
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    // Configurar velocidades baseadas na camada e speed prop
    const speedMap = {
      slow: 0.3,
      medium: 0.5,
      fast: 0.8,
    };

    const layerMultiplier = {
      background: 0.5,
      midground: 1,
      foreground: 1.5,
    };

    const finalSpeed = speedMap[speed] * layerMultiplier[layer];

    let ticking = false;

    const updateParallax = () => {
      const rect = section.getBoundingClientRect();
      const scrolled = window.pageYOffset || document.documentElement.scrollTop;
      const elementTop = rect.top + scrolled;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calcular se o elemento está visível
      const isVisible =
        rect.top < windowHeight && rect.bottom > 0;

      if (isVisible) {
        // Calcular posição relativa do scroll
        const scrollProgress =
          (scrolled + windowHeight - elementTop) /
          (windowHeight + elementHeight);

        // Aplicar transformação baseada no progresso
        const translateY = (scrollProgress - 0.5) * 100 * finalSpeed;

        // Usar transform para performance (GPU accelerated)
        section.style.transform = `translate3d(0, ${translateY}px, 0)`;
      }

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    // Event listeners otimizados
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick, { passive: true });

    // Inicializar
    updateParallax();

    return () => {
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);
    };
  }, [speed, layer]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        "parallax-section",
        "will-change-transform",
        "transition-none",
        className
      )}
      style={{
        transform: "translate3d(0, 0, 0)", // Inicialização para GPU
      }}
    >
      {children}
    </section>
  );
}

// Componente para backgrounds parallax fixos
interface ParallaxBackgroundProps {
  image?: string;
  gradient?: string;
  className?: string;
  children?: ReactNode;
  opacity?: number;
}

export function ParallaxBackground({
  image,
  gradient,
  className,
  children,
  opacity = 0.5,
}: ParallaxBackgroundProps) {
  return (
    <div
      className={cn(
        "parallax-background",
        "fixed inset-0 -z-10",
        "bg-cover bg-center bg-no-repeat",
        className
      )}
      style={{
        backgroundImage: image ? `url(${image})` : gradient,
        backgroundAttachment: "fixed",
        opacity,
        willChange: "transform",
        transform: "translateZ(0)", // Force GPU acceleration
      }}
    >
      {children}
    </div>
  );
}

// Componente para elementos flutuantes
interface ParallaxFloatingProps {
  children: ReactNode;
  className?: string;
  depth?: number; // 1-10, quanto maior mais rápido
  delay?: number;
}

export function ParallaxFloating({
  children,
  className,
  depth = 5,
  delay = 0,
}: ParallaxFloatingProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    let ticking = false;
    const speed = depth * 0.1;

    const updatePosition = () => {
      const scrolled = window.pageYOffset;
      const translateY = scrolled * speed;
      
      element.style.transform = `translate3d(0, ${-translateY}px, 0)`;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    setTimeout(() => {
      window.addEventListener("scroll", requestTick, { passive: true });
      updatePosition();
    }, delay);

    return () => {
      window.removeEventListener("scroll", requestTick);
    };
  }, [depth, delay]);

  return (
    <div
      ref={elementRef}
      className={cn(
        "parallax-floating",
        "will-change-transform",
        className
      )}
      style={{
        transform: "translate3d(0, 0, 0)",
      }}
    >
      {children}
    </div>
  );
}

