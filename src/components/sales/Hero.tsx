"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, TrendingUp, CheckCircle2 } from "lucide-react";
import { SparklesCore } from "@/components/ui/sparkles";

const stats = [
  { label: "Transações Processadas", value: "10M+" },
  { label: "Empresas Ativas", value: "5K+" },
  { label: "Uptime", value: "99.9%" },
  { label: "Suporte 24/7", value: "100%" },
];

const features = [
  "Integração em minutos",
  "Sem taxas escondidas",
  "Suporte dedicado 24/7",
  "API completa e documentada",
];

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-b from-background via-background to-muted/20">
      {/* Animated background */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="hero-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#a4e155"
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 border border-primary/20">
                <Zap className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">
                  🚀 Gateway de Pagamentos #1 do Brasil • 5.000+ Empresas Confiam
                </span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-foreground">
                  Transforme seu negócio com
                </span>
                <span className="block bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  pagamentos instantâneos
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Aceite Pix, boleto e cartão em uma única plataforma. <strong className="text-foreground">Aumente suas vendas em até 45%</strong> com checkout otimizado, 
                taxas transparentes a partir de 1,99% e suporte especializado 24/7.
              </p>
            </motion.div>

            {/* Features list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 gap-3"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-foreground/80"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.a
                href="/register"
                className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-primary to-primary/80 px-8 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Começar Grátis Agora</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 relative z-10" />
                <div className="absolute inset-0 bg-linear-to-r from-primary/90 to-primary/70 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>
              <motion.a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary/30 bg-background/50 backdrop-blur-sm px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-primary/10 hover:border-primary/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver Demo Gratuita
              </motion.a>
            </motion.div>

            {/* Urgency indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex items-center gap-3 pt-2"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                  Sem cartão de crédito • Cancele quando quiser
                </span>
              </div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 backdrop-blur-sm border border-border/30">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">
                  Certificado PCI DSS
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 backdrop-blur-sm border border-border/30">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">
                  99.9% Uptime Garantido
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 backdrop-blur-sm border border-border/30">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">
                  LGPD Compliant
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right column - Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-lg transition-all group-hover:border-primary/30 group-hover:shadow-xl">
                  <div className="space-y-2">
                    <div className="text-4xl font-bold bg-linear-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
