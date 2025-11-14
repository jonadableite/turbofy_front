"use client";

import { motion } from "framer-motion";
import { Bell, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

interface DashboardHeaderProps {
  progress?: {
    current: number;
    target: number;
  };
  userName?: string;
  userAvatar?: string;
  notifications?: number;
  className?: string;
}

export const DashboardHeader = ({
  progress,
  userName = "Usuário",
  userAvatar,
  notifications = 0,
  className,
}: DashboardHeaderProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const progressPercentage = progress
    ? Math.min((progress.current / progress.target) * 100, 100)
    : 0;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/50 glass-strong",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Progress Bar */}
        {progress && (
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Meta do mês</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(progress.current)} /{" "}
                  {formatCurrency(progress.target)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted/30 overflow-hidden backdrop-blur-sm">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-primary rounded-full shadow-lg shadow-primary/30"
                />
              </div>
            </div>
          </div>
        )}

        {/* Right side - Notifications and User */}
        <div className="flex items-center gap-4">
          {/* Theme Toggler */}
          <AnimatedThemeToggler />

          {/* Notifications */}
          <button className="relative rounded-lg p-2 glass hover:bg-primary/10 transition-colors">
            <Bell className="h-5 w-5 text-foreground" />
            {notifications > 0 && (
              <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-lg shadow-primary/30">
                {notifications}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 glass hover:bg-primary/10 transition-colors"
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-8 w-8 rounded-full border-2 border-primary"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <span className="hidden md:block text-sm font-medium text-foreground">
                {userName}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 rounded-lg border border-border/50 glass-strong shadow-lg p-2"
              >
                <a
                  href="/profile"
                  className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  Meu Perfil
                </a>
                <a
                  href="/settings"
                  className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  Configurações
                </a>
                <div className="border-t border-border my-2" />
                <a
                  href="/logout"
                  className="block px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                >
                  Sair
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

