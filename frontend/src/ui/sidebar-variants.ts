import { cva } from "class-variance-authority";

export const sidebarContainerVariants = cva(
  "bg-[hsl(var(--sidebar))] border-r border-[hsl(var(--sidebar-border))]",
  {
    variants: {
      style: {
        flat: "shadow-none",
        glass:
          "backdrop-blur-sm bg-[hsl(var(--sidebar))]/90",
        neon:
          "ring-1 ring-[hsl(var(--sidebar-ring))] shadow-[0_0_18px_rgba(88,144,255,0.35)]",
      },
    },
    defaultVariants: {
      style: "flat",
    },
  }
);