"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Aguardar montagem para evitar hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Atualizar estado quando o tema mudar
  useEffect(() => {
    if (mounted) {
      setIsDark(resolvedTheme === "dark");
    }
  }, [resolvedTheme, mounted]);

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current || !mounted) return;

    const newTheme = isDark ? "light" : "dark";

    // Verificar suporte para View Transitions API
    if (typeof document.startViewTransition === "function") {
      await document.startViewTransition(() => {
        flushSync(() => {
          setIsDark(!isDark);
          setTheme(newTheme);
        });
      }).ready;

      const { top, left, width, height } =
        buttonRef.current.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top)
      );

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    } else {
      // Fallback para navegadores sem suporte a View Transitions
      setIsDark(!isDark);
      setTheme(newTheme);
    }
  }, [isDark, duration, setTheme, mounted]);

  // Não renderizar até estar montado
  if (!mounted) {
    return (
      <button
        ref={buttonRef}
        className={cn(
          "rounded-lg p-2 hover:bg-muted transition-colors",
          className
        )}
        disabled
        {...props}
      >
        <div className="h-5 w-5" />
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(
        "rounded-lg p-2 hover:bg-muted transition-colors text-foreground",
        className
      )}
      aria-label="Toggle theme"
      {...props}
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

