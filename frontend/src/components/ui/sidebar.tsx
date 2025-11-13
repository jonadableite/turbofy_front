"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconPin, IconPinFilled, IconX } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { sidebarContainerVariants } from "@/ui/sidebar-variants";
import { Tooltip } from "@/components/ui/tooltip";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
  pinned: boolean;
  setPinned: React.Dispatch<React.SetStateAction<boolean>>;
  pinnedOpen: boolean;
  setPinnedOpen: React.Dispatch<React.SetStateAction<boolean>>;
  variant: "flat" | "glass" | "neon";
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
  variant = "flat",
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
  variant?: "flat" | "glass" | "neon";
}) => {
  // Sidebar começa aberta por padrão
  const [openState, setOpenState] = useState(true);
  const [pinned, setPinned] = useState<boolean>(() => {
    try {
      if (typeof window === "undefined") return true; // Fixada por padrão
      const stored = window.localStorage.getItem("turbofy:sidebar:pinned");
      // Se não houver valor salvo, retornar true (fixada por padrão)
      return stored === null ? true : stored === "1";
    } catch {
      return true; // Fixada por padrão em caso de erro
    }
  });
  const [pinnedOpen, setPinnedOpen] = useState<boolean>(() => {
    try {
      if (typeof window === "undefined") return true; // Aberta por padrão
      const v = window.localStorage.getItem("turbofy:sidebar:pinnedOpen");
      // Se não houver valor salvo, retornar true (aberta por padrão)
      return v === null ? true : v === "1";
    } catch {
      return true; // Aberta por padrão em caso de erro
    }
  });

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  useEffect(() => {
    try {
      window.localStorage.setItem("turbofy:sidebar:pinned", pinned ? "1" : "0");
    } catch { }
  }, [pinned]);

  useEffect(() => {
    try {
      window.localStorage.setItem("turbofy:sidebar:pinnedOpen", pinnedOpen ? "1" : "0");
    } catch { }
  }, [pinnedOpen]);

  return (
    <SidebarContext.Provider
      value={{
        open,
        setOpen,
        animate: animate,
        pinned,
        setPinned,
        pinnedOpen,
        setPinnedOpen,
        variant,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
  variant,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
  variant?: "flat" | "glass" | "neon";
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate} variant={variant}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof motion.div>, 'children'> & { children: React.ReactNode }) => {
  const { open, setOpen, animate, pinned, setPinned, pinnedOpen, setPinnedOpen, variant } = useSidebar();

  const effectiveOpen = pinned ? pinnedOpen : open;

  const handleMouseEnter = () => {
    if (!pinned) setOpen(true);
  };

  const handleMouseLeave = () => {
    if (!pinned) setOpen(false);
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!pinned) {
      // Fixar sidebar no estado atual (aberta)
      setPinned(true);
      setPinnedOpen(true);
      return;
    }

    if (pinned && pinnedOpen) {
      // Se está fixada e aberta, fechar mas manter fixada
      setPinnedOpen(false);
      return;
    }

    if (pinned && !pinnedOpen) {
      // Se está fixada e fechada, desafixar
      setPinned(false);
      setOpen(false);
      return;
    }
  };

  return (
    <>
      <motion.div
        className={cn(
          "h-screen sticky top-0 px-4 py-4 hidden md:flex md:flex-col w-[280px] shrink-0",
          "bg-[hsl(var(--sidebar))] border-r border-[hsl(var(--sidebar-border))]",
          sidebarContainerVariants({ style: variant }),
          className
        )}
        animate={{
          width: animate ? (effectiveOpen ? "280px" : "72px") : "280px",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="navigation"
        aria-label="Sidebar"
        {...props}
      >
        {children}
        <div className="absolute right-2 top-2 z-10">
          <button
            type="button"
            aria-label={
              !pinned
                ? "Fixar sidebar"
                : pinnedOpen
                  ? "Recolher sidebar"
                  : "Desafixar sidebar"
            }
            aria-pressed={pinned}
            title={!pinned ? "Fixar sidebar" : pinnedOpen ? "Recolher sidebar" : "Desafixar sidebar"}
            onClick={handlePinClick}
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded-md transition-all",
              "text-muted-foreground hover:text-primary",
              "bg-background/80 backdrop-blur-sm",
              "border border-border hover:border-primary/50",
              "hover:bg-accent/50 shadow-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            )}
          >
            {pinned ? (
              <IconPinFilled className="h-3.5 w-3.5" />
            ) : (
              <IconPin className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();

  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between w-full",
          "bg-[hsl(var(--sidebar))] border-b border-[hsl(var(--sidebar-border))]"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-[hsl(var(--sidebar-foreground))] cursor-pointer hover:text-primary transition-colors"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 p-10 z-100 flex flex-col justify-between",
                "bg-[hsl(var(--sidebar))] border-r border-[hsl(var(--sidebar-border))] backdrop-blur-sm",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-[hsl(var(--sidebar-foreground))] cursor-pointer hover:text-primary transition-colors"
                onClick={() => setOpen(!open)}
              >
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate, pinned, pinnedOpen } = useSidebar();
  const pathname = usePathname();
  const isActive = pathname === link.href;
  const effectiveOpen = pinned ? pinnedOpen : open;
  const anchor = (
    <a
      href={link.href}
      className={cn(
        "relative flex items-center justify-start gap-3 group/sidebar py-2.5 px-3 rounded-md",
        "transition-all duration-200",
        "hover:bg-accent/50 hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        isActive && "bg-primary/20 text-primary font-semibold border-l-2 border-primary",
        className
      )}
      aria-current={isActive ? "page" : undefined}
      title={link.label}
      {...props}
    >
      <span className="shrink-0 text-foreground group-hover/sidebar:scale-110 transition-transform">{link.icon}</span>
      {isActive && (
        <motion.span
          layoutId="sidebar-active-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
      <motion.span
        animate={{
          display: animate ? (effectiveOpen ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (effectiveOpen ? 1 : 0) : 1,
        }}
        className="text-sm text-foreground group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block p-0! m-0!"
      >
        {link.label}
      </motion.span>
    </a>
  );

  return effectiveOpen ? anchor : <Tooltip content={link.label} delay={120}>{anchor}</Tooltip>;
};

export interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const SidebarSection = ({ title, children, className }: SidebarSectionProps) => {
  const { pinned, pinnedOpen, open, animate } = useSidebar();
  const effectiveOpen = pinned ? pinnedOpen : open;

  return (
    <div className={cn("flex flex-col", className)}>
      <motion.div
        aria-hidden={!effectiveOpen}
        animate={{
          display: animate ? (effectiveOpen ? "block" : "none") : "block",
          opacity: animate ? (effectiveOpen ? 1 : 0) : 1,
        }}
        className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
      >
        {title}
      </motion.div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
};

