"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Home, User, MessageSquare, Camera, Settings } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
}

const defaultNavItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home, href: "/" },
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
  { id: "messages", label: "Messages", icon: MessageSquare, href: "/messages" },
  { id: "photos", label: "Photos", icon: Camera, href: "/photos" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

interface MagicNavIndicatorProps {
  items?: NavItem[];
  defaultActive?: string;
  className?: string;
  onItemChange?: (itemId: string) => void;
}

export function MagicNavIndicator({
  items = defaultNavItems,
  defaultActive,
  className,
  onItemChange,
}: MagicNavIndicatorProps) {
  const [activeId, setActiveId] = useState(defaultActive || items[0]?.id || "");
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Motion values para animação suave
  const x = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);

  // Spring animations para movimento suave
  const springConfig = { damping: 30, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const widthSpring = useSpring(width, springConfig);
  const heightSpring = useSpring(height, springConfig);
  
  // Transform para glow position
  const glowX = useTransform(xSpring, (v) => v + 30);
  const particleX = useTransform(xSpring, (v) => v + 20);

  // Calcular posição e tamanho do indicador
  const updateIndicator = (itemId: string) => {
    const itemElement = itemRefs.current.get(itemId);
    const container = containerRef.current;

    if (!itemElement || !container) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = itemElement.getBoundingClientRect();

    // Calcular posição relativa ao container
    const relativeX = itemRect.left - containerRect.left;
    const itemWidth = itemRect.width;
    const itemHeight = itemRect.height;

    // Atualizar motion values
    x.set(relativeX);
    width.set(itemWidth);
    height.set(itemHeight);
  };

  // Atualizar indicador quando activeId mudar
  useEffect(() => {
    if (activeId) {
      updateIndicator(activeId);
    }
  }, [activeId]);

  // Atualizar indicador no resize
  useEffect(() => {
    const handleResize = () => {
      if (activeId) {
        updateIndicator(activeId);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeId]);

  // Inicializar indicador
  useEffect(() => {
    if (activeId) {
      // Pequeno delay para garantir que o DOM está renderizado
      setTimeout(() => updateIndicator(activeId), 100);
    }
  }, []);

  const handleItemClick = (item: NavItem) => {
    setActiveId(item.id);
    onItemChange?.(item.id);

    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      // Navegação será feita pelo Link ou router
      window.location.href = item.href;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full max-w-md mx-auto",
        "bg-card rounded-2xl p-2",
        "shadow-lg shadow-black/10",
        "border border-border/50",
        className
      )}
    >
      {/* Background com efeito glassmorphism */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl" />

      {/* Container dos itens */}
      <div className="relative flex items-center justify-around gap-2">
        {/* Indicador animado com curva externa - EFEITO CUT-OUT */}
        <motion.div
          className="absolute top-0 bottom-0 rounded-full bg-gradient-to-br from-[#a4e155] via-[#8acc3d] to-[#7ab82f] shadow-lg shadow-[#a4e155]/40 z-0"
          style={{
            x: xSpring,
            width: widthSpring,
            height: heightSpring,
          }}
        >
          {/* Efeito de brilho interno */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-white/10 to-transparent" />
          
          {/* Sombra interna para profundidade */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-transparent" />
          
          {/* Curva externa superior (cut-out effect) - MAIS PRONUNCIADA */}
          <div className="absolute -top-3 left-0 right-0 h-6 pointer-events-none overflow-hidden">
            <svg
              className="w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 100 24"
            >
              {/* Path que cria o "corte" na barra branca */}
              <path
                d="M 0 24 
                   Q 15 24 25 20
                   Q 35 16 50 16
                   Q 65 16 75 20
                   Q 85 24 100 24
                   L 100 0
                   L 0 0
                   Z"
                fill="hsl(var(--card))"
                className="drop-shadow-lg"
              />
              {/* Linha de brilho na curva */}
              <path
                d="M 0 24 
                   Q 15 24 25 20
                   Q 35 16 50 16
                   Q 65 16 75 20
                   Q 85 24 100 24"
                fill="none"
                stroke="url(#curve-gradient-top)"
                strokeWidth="1.5"
                className="opacity-40"
              />
              <defs>
                <linearGradient id="curve-gradient-top" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a4e155" stopOpacity="0" />
                  <stop offset="50%" stopColor="#a4e155" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#a4e155" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Curva externa inferior (cut-out effect) - MAIS PRONUNCIADA */}
          <div className="absolute -bottom-3 left-0 right-0 h-6 pointer-events-none overflow-hidden">
            <svg
              className="w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 100 24"
            >
              {/* Path que cria o "corte" na barra branca */}
              <path
                d="M 0 0 
                   Q 15 0 25 4
                   Q 35 8 50 8
                   Q 65 8 75 4
                   Q 85 0 100 0
                   L 100 24
                   L 0 24
                   Z"
                fill="hsl(var(--card))"
                className="drop-shadow-lg"
              />
              {/* Linha de brilho na curva */}
              <path
                d="M 0 0 
                   Q 15 0 25 4
                   Q 35 8 50 8
                   Q 65 8 75 4
                   Q 85 0 100 0"
                fill="none"
                stroke="url(#curve-gradient-bottom)"
                strokeWidth="1.5"
                className="opacity-40"
              />
              <defs>
                <linearGradient id="curve-gradient-bottom" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a4e155" stopOpacity="0" />
                  <stop offset="50%" stopColor="#a4e155" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#a4e155" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>

        {/* Itens de navegação */}
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;

          return (
            <motion.button
              key={item.id}
              ref={(el) => {
                if (el) itemRefs.current.set(item.id, el);
              }}
              onClick={() => handleItemClick(item)}
              className={cn(
                "relative z-10 flex flex-col items-center justify-center",
                "min-w-[60px] px-4 py-3 rounded-full",
                "transition-all duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4e155] focus-visible:ring-offset-2",
                isActive
                  ? "text-gray-900 scale-105"
                  : "text-muted-foreground hover:text-foreground"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Ícone */}
              <motion.div
                className={cn(
                  "mb-1 transition-colors",
                  isActive ? "text-gray-900" : "text-muted-foreground"
                )}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  rotate: isActive ? [0, -10, 10, -10, 0] : 0,
                }}
                transition={{
                  scale: { duration: 0.2 },
                  rotate: { duration: 0.5, delay: 0.1 },
                }}
              >
                <Icon className="h-6 w-6" />
              </motion.div>

              {/* Label */}
              <motion.span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  isActive ? "text-gray-900 font-semibold" : "text-muted-foreground"
                )}
                animate={{
                  opacity: isActive ? 1 : 0.7,
                  y: isActive ? 0 : 2,
                }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.span>

              {/* Efeito de brilho no hover */}
              {!isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#a4e155]/10 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Efeito de glow externo animado */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${glowX}px 50%, rgba(164, 225, 85, 0.15) 0%, transparent 60%)`,
        }}
      />
      
      {/* Efeito de partículas brilhantes */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-[#a4e155] blur-sm"
          style={{
            x: particleX,
            y: "50%",
            opacity: 0.6,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}

