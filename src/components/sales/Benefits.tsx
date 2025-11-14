"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  BarChart3,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/ui/border-beam";

const benefits = [
  {
    icon: Zap,
    title: "Integre em 15 Minutos",
    description: "Comece a receber pagamentos hoje mesmo. Setup completo em menos de 15 minutos sem complicação",
    features: ["API REST completa e documentada", "SDKs prontos para uso", "Guia passo a passo"],
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Segurança Máxima",
    description: "Proteção de ponta a ponta com as mais avançadas tecnologias de segurança",
    features: ["Certificação PCI DSS", "Criptografia AES-256", "Anti-fraude integrado"],
    color: "from-red-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    title: "Aumente Vendas em até 45%",
    description: "Checkout otimizado que converte mais. Empresas que usam Turbofy aumentam vendas em média 45%",
    features: ["Checkout otimizado para conversão", "One-click payment", "Recuperação automática de carrinho"],
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Clock,
    title: "Receba Mais Rápido",
    description: "Prazos de repasse mais curtos do mercado para você ter dinheiro em caixa",
    features: ["Pix instantâneo", "D+1 para cartão", "Antecipação disponível"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: DollarSign,
    title: "Taxas a partir de 1,99%",
    description: "Sem taxas escondidas, sem mensalidade, sem pegadinha. Você paga apenas pelo que usar",
    features: ["Taxas a partir de 1,99%", "Sem mensalidade fixa", "Sem taxa de setup"],
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: BarChart3,
    title: "Analytics Poderoso",
    description: "Dashboards em tempo real para você acompanhar cada detalhe do seu negócio",
    features: ["Relatórios customizáveis", "Exportação de dados", "Alertas inteligentes"],
    color: "from-indigo-500 to-blue-500",
  },
];

const comparisonFeatures = [
  "Pix, Boleto e Cartão",
  "API REST completa",
  "Dashboard em tempo real",
  "Suporte 24/7 em português",
  "Sem mensalidade fixa",
  "Antecipação de recebíveis",
  "Checkout personalizado",
  "Webhooks em tempo real",
  "Split de pagamento",
  "Gestão de assinaturas",
];

export const Benefits = () => {
  return (
    <section id="beneficios" className="relative py-24 bg-linear-to-b from-background to-muted/20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-30">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 border border-primary/20">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Por que escolher o Turbofy</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Por que{" "}
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              5.000+ empresas
            </span>{" "}
            escolheram o Turbofy
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Aumente suas vendas, reduza custos e receba mais rápido com o gateway de pagamentos mais confiável do Brasil
          </p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 transition-all hover:border-primary/30 hover:shadow-xl"
            >
              {/* Icon with gradient */}
              <div className="relative inline-flex mb-6">
                <div
                  className={cn(
                    "absolute inset-0 bg-linear-to-br opacity-20 blur-xl group-hover:opacity-40 transition-opacity",
                    benefit.color
                  )}
                />
                <div className="relative rounded-xl bg-linear-to-br from-primary/20 to-primary/10 p-4">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {benefit.description}
              </p>

              {/* Features list */}
              <ul className="space-y-2">
                {benefit.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 text-sm text-foreground/80"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Shine effect */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent" />
              
              {/* Animated Border Beams */}
              <BorderBeam
                duration={7}
                delay={index * 1.5}
                size={180}
                colorFrom="#72879c"
                colorTo="transparent"
                borderWidth={2}
              />
              <BorderBeam
                duration={7}
                delay={index * 1.5 + 3.5}
                size={180}
                colorFrom="#a4e155"
                colorTo="transparent"
                borderWidth={1}
              />
            </motion.div>
          ))}
        </div>

        {/* Comparison section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-border/50 bg-linear-to-br from-card/80 to-card/40 backdrop-blur-sm p-8 md:p-12"
        >
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold mb-3">
                Comece{" "}
                <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  grátis agora
                </span>{" "}
                e pague apenas quando vender
              </h3>
              <p className="text-lg text-muted-foreground">
                Sem mensalidade, sem taxa de setup, sem compromisso. Pague apenas uma pequena taxa por transação aprovada
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {comparisonFeatures.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 rounded-lg bg-background/50 p-4 border border-border/30"
                >
                  <div className="rounded-full bg-primary/20 p-1">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <motion.a
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-primary to-primary/80 px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Começar Agora - Grátis</span>
                <Headphones className="h-5 w-5" />
              </motion.a>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          
          {/* Animated Border Beams */}
          <BorderBeam
            duration={12}
            size={300}
            colorFrom="#72879c"
            colorTo="transparent"
            borderWidth={2}
          />
          <BorderBeam
            duration={12}
            delay={6}
            size={300}
            colorFrom="#a4e155"
            colorTo="transparent"
            borderWidth={1}
          />
        </motion.div>
      </div>
    </section>
  );
};
