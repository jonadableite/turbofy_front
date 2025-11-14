"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Receipt,
  Zap,
  Shield,
  BarChart3,
  Clock,
  HeadphonesIcon,
  Code2,
  Globe,
  Lock,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/ui/border-beam";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { DotPattern } from "@/components/ui/dot-pattern";

const features = [
  {
    icon: CreditCard,
    title: "Pix em Tempo Real",
    description: "Receba pagamentos Pix instantaneamente com taxas a partir de 1,99% e zero complicação",
    className: "col-span-12 md:col-span-6 lg:col-span-4 row-span-2",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: Receipt,
    title: "Boleto Bancário",
    description: "Emissão automatizada de boletos com baixa automática",
    className: "col-span-12 md:col-span-6 lg:col-span-4 row-span-2",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Smartphone,
    title: "Cartão de Crédito",
    description: "Aceite todas as bandeiras com anti-fraude integrado",
    className: "col-span-12 md:col-span-12 lg:col-span-4 row-span-2",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Shield,
    title: "Segurança Máxima",
    description: "Certificação PCI DSS e criptografia ponta a ponta",
    className: "col-span-12 md:col-span-4 lg:col-span-3",
    gradient: "from-red-500/20 to-orange-500/20",
  },
  {
    icon: BarChart3,
    title: "Dashboard Analytics",
    description: "Relatórios em tempo real e insights poderosos",
    className: "col-span-12 md:col-span-4 lg:col-span-3",
    gradient: "from-yellow-500/20 to-amber-500/20",
  },
  {
    icon: Clock,
    title: "Conciliação Automática",
    description: "Reconciliação bancária automática diária",
    className: "col-span-12 md:col-span-4 lg:col-span-3",
    gradient: "from-indigo-500/20 to-violet-500/20",
  },
  {
    icon: HeadphonesIcon,
    title: "Suporte Humano 24/7",
    description: "Equipe brasileira disponível 24 horas por dia, 7 dias por semana, em português",
    className: "col-span-12 md:col-span-4 lg:col-span-3",
    gradient: "from-teal-500/20 to-cyan-500/20",
  },
  {
    icon: Code2,
    title: "API Completa",
    description: "Documentação detalhada e SDKs em várias linguagens",
    className: "col-span-12 md:col-span-4 lg:col-span-4",
    gradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    icon: Globe,
    title: "Multi-moeda",
    description: "Suporte para transações internacionais",
    className: "col-span-12 md:col-span-4 lg:col-span-4",
    gradient: "from-lime-500/20 to-green-500/20",
  },
  {
    icon: Lock,
    title: "Compliance Total",
    description: "LGPD, PCI DSS e certificações internacionais",
    className: "col-span-12 md:col-span-12 lg:col-span-4",
    gradient: "from-orange-500/20 to-red-500/20",
  },
];

export const PremiumDemo = () => {
  return (
    <ParallaxScroll offset={80}>
      <section id="recursos" className="relative py-24 bg-linear-to-b from-muted/20 to-background overflow-hidden">
      {/* Dot Pattern Background */}
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "text-[#a4e155]/20 dark:text-[#a4e155]/10",
          "[mask-image:linear-gradient(to_bottom,white,transparent)]"
        )}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#a4e155]/10 to-[#72879c]/10 px-4 py-2 border border-[#a4e155]/20">
            <Zap className="h-4 w-4 text-[#a4e155]" />
            <span className="text-sm font-medium bg-gradient-to-r from-[#a4e155] to-[#72879c] bg-clip-text text-transparent font-semibold">Recursos Completos</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Tudo em{" "}
            <span className="bg-gradient-to-r from-[#a4e155] to-[#72879c] bg-clip-text text-transparent">
              uma plataforma única
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Aceite Pix, boleto e cartão. Gerencie finanças, analise vendas e escale seu negócio com o gateway mais completo do Brasil
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-4 auto-rows-[180px]">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all hover:border-primary/30 hover:shadow-xl",
                feature.className
              )}
            >
              {/* Gradient background */}
              <div
                className={cn(
                  "absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  feature.gradient
                )}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05, type: "spring" }}
                    viewport={{ once: true }}
                    className="rounded-full bg-primary/20 px-3 py-1"
                  >
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </motion.div>
                </div>
                <div className="space-y-2 mt-auto">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent" />
              
              {/* Animated Border Beams */}
              <BorderBeam
                duration={8}
                size={200}
                colorFrom="#72879c"
                colorTo="transparent"
                borderWidth={2}
              />
              <BorderBeam
                duration={8}
                delay={4}
                size={200}
                colorFrom="#a4e155"
                colorTo="transparent"
                borderWidth={1}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.a
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#a4e155] to-[#8acc3d] px-8 py-4 text-base font-semibold text-gray-900 shadow-lg shadow-[#a4e155]/25 transition-all hover:shadow-xl hover:shadow-[#a4e155]/40"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
                <span>Começar Agora - Grátis</span>
                <Zap className="h-5 w-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
    </ParallaxScroll>
  );
};
