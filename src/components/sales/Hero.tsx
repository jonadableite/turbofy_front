"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, TrendingUp, CheckCircle2 } from "lucide-react";
import { SparklesCore } from "@/components/ui/sparkles";
import { ParallaxSection, ParallaxFloating } from "@/components/ui/parallax-section";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { RevealText, RevealCharacters } from "@/components/ui/reveal-text";
import { FloatingElement } from "@/components/ui/floating-element";
import { AnimatedBackground } from "@/components/ui/animated-background";

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
      {/* Animated Background */}
      <AnimatedBackground variant="gradient" colors={["#a4e155", "#72879c"]} />

      {/* Parallax Background Layers */}
      <div className="parallax-layer parallax-layer-bg absolute inset-0 w-full h-full pointer-events-none">
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

      {/* Grid pattern - layer média */}
      <div className="parallax-layer parallax-layer-mid absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Gradient orbs - cores da marca com parallax AUMENTADO */}
      <ParallaxFloating depth={4}>
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#a4e155]/30 rounded-full blur-3xl animate-pulse" />
      </ParallaxFloating>
      <ParallaxFloating depth={6} delay={500} style={{ animationDelay: '1s' }}>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#72879c]/30 rounded-full blur-3xl animate-pulse" />
      </ParallaxFloating>
      <ParallaxFloating depth={2}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-r from-[#a4e155]/20 to-[#72879c]/20 rounded-full blur-3xl" />
      </ParallaxFloating>

      <div className="parallax-layer-content relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
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
              <div className="inline-flex items-center gap-2 rounded-full bg-card px-6 py-3 border border-white/10 shadow-lg shadow-black/20">
                <Zap className="h-4 w-4 text-[#a4e155] animate-pulse" />
                <span className="text-sm font-medium text-white">
                  🚀 Gateway de Pagamentos #1 do Brasil • 5.000+ Empresas Confiam
                </span>
              </div>
            </motion.div>

            {/* Heading com animação avançada */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <RevealText className="block bg-gradient-to-br from-[#ffffff] via-[#e0e0e0] to-[#9d9da0] bg-clip-text text-transparent">
                  Transforme seu negócio com
                </RevealText>
                <RevealCharacters
                  delay={0.5}
                  className="block bg-gradient-to-r from-[#a4e155] to-[#8acc3d] bg-clip-text text-transparent"
                >
                  pagamentos instantâneos
                </RevealCharacters>
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="text-xl text-muted-foreground max-w-2xl leading-relaxed"
              >
                Aceite Pix, boleto e cartão em uma única plataforma. <strong className="text-foreground">Aumente suas vendas em até 45%</strong> com checkout otimizado,
                taxas transparentes a partir de 1,99% e suporte especializado 24/7.
              </motion.p>
            </div>

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

            {/* CTA Buttons com efeito magnético */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <MagneticButton
                magneticStrength={0.4}
                className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#a4e155] via-[#8acc3d] to-[#7ab82f] px-8 h-[56px] text-base font-bold text-gray-900 shadow-[0_10px_30px_rgba(164,225,85,0.3),0_5px_15px_rgba(164,225,85,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_15px_40px_rgba(164,225,85,0.4),0_8px_20px_rgba(164,225,85,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] overflow-hidden"
              >
                <a href="/register" className="absolute inset-0" />
                <span className="relative z-10 drop-shadow-sm">Começar Grátis Agora</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2 relative z-10 drop-shadow-sm" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#8acc3d] via-[#a4e155] to-[#8acc3d]"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </MagneticButton>

              <MagneticButton
                magneticStrength={0.3}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#72879c]/40 bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm px-8 h-[56px] text-base font-semibold text-foreground shadow-[0_8px_20px_rgba(114,135,156,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all hover:bg-gradient-to-br hover:from-[#72879c]/20 hover:to-[#72879c]/10 hover:border-[#72879c]/60 hover:shadow-[0_12px_25px_rgba(114,135,156,0.2),inset_0_1px_0_rgba(255,255,255,0.15)]"
              >
                <a href="#demo" className="absolute inset-0" />
                <span className="drop-shadow-sm">Ver Demo Gratuita</span>
              </MagneticButton>
            </motion.div>

            {/* Urgency indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex items-center gap-3 pt-2"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#a4e155]/10 border border-[#a4e155]/20">
                <div className="w-2 h-2 bg-[#a4e155] rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-[#8acc3d] dark:text-[#a4e155]">
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

          {/* Right column - Stats Cards com animações avançadas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <FloatingElement
                key={stat.label}
                intensity="low"
                duration={3 + index * 0.5}
                delay={index * 0.2}
                className="relative group"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    transition: { duration: 0.2 }
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#a4e155]/20 via-[#72879c]/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-lg transition-all group-hover:border-[#a4e155]/30 group-hover:shadow-2xl group-hover:shadow-[#a4e155]/20">
                    <div className="space-y-2">
                      <RevealCharacters
                        delay={0.5 + index * 0.1}
                        className="text-4xl font-bold bg-gradient-to-br from-[#a4e155] to-[#72879c] bg-clip-text text-transparent"
                      >
                        {stat.value}
                      </RevealCharacters>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="text-sm text-muted-foreground"
                      >
                        {stat.label}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </FloatingElement>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
