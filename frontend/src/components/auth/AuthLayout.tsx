"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Logo */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 group"
      >
        <motion.div
          className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-primary-foreground font-bold text-xl">T</span>
        </motion.div>
        <span className="text-lg font-bold text-foreground hidden sm:block">
          Turbofy
        </span>
      </Link>

      {/* Card com formulário */}
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-card/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-border p-8"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {/* Header */}
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* Conteúdo (formulário) */}
          {children}
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-sm text-muted-foreground mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Protegido por{" "}
          <span className="text-primary font-medium">reCAPTCHA v3</span>
        </motion.p>
      </motion.div>
    </div>
  );
}

