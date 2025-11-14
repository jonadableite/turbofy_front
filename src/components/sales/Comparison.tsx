"use client";

import { motion } from "framer-motion";
import { Users, UserCheck } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";

const comparison = {
  them: [
    "Desenham o funil → Vão pra outra ferramenta editar",
    "Voltam pro funil → Vão pra outra ferramenta ver dados",
    "Voltam pro funil → Vão pra outra ferramenta de email",
    "15 abas abertas, 15 logins, 15 mensalidades",
  ],
  you: [
    "Clica no funil → Edita ali mesmo",
    "Arrasta mensagem → Configura ali mesmo",
    "Vê conversão → Em tempo real ali mesmo",
    "1 tela, 1 login, 1 investimento",
  ],
};

export const Comparison = () => {
  return (
    <section id="comparacao" className="relative py-24 overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(164,225,85,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(164,225,85,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="block text-foreground/80">O que os outros fazem</span>
            <span className="block text-foreground">vs</span>
            <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              O que você faz aqui:
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            O primeiro funil que pensa, adapta e vende sozinho. É como montar Lego.{" "}
            <strong className="text-primary">Arrasta, solta, vende.</strong> Templates prontos de quem já faturou milhões.
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Them side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/30 backdrop-blur-sm p-8 h-full">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border/30">
                <div className="rounded-xl bg-muted/50 p-3">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Eles</h3>
                  <p className="text-sm text-muted-foreground">Outras plataformas</p>
                </div>
              </div>

              {/* List items */}
              <ul className="space-y-4">
                {comparison.them.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-background/50 border border-border/30"
                  >
                    <div className="mt-1 h-2 w-2 rounded-full bg-muted-foreground/50 shrink-0" />
                    <span className="text-base text-muted-foreground leading-relaxed">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* You side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl border border-primary/50 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm p-8 h-full">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-primary/30">
                <div className="rounded-xl bg-primary/20 p-3">
                  <UserCheck className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Você</h3>
                  <p className="text-sm text-primary">Com Turbofy</p>
                </div>
              </div>

              {/* List items */}
              <ul className="space-y-4">
                {comparison.you.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20"
                  >
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                    <span className="text-base text-foreground leading-relaxed font-medium">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* Animated Border Beams */}
              <BorderBeam
                duration={10}
                size={300}
                colorFrom="#a4e155"
                colorTo="transparent"
                borderWidth={2}
              />
              <BorderBeam
                duration={10}
                delay={5}
                size={300}
                colorFrom="#72879c"
                colorTo="transparent"
                borderWidth={1}
              />
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.a
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 px-10 py-5 text-lg font-bold text-background shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Começar agora</span>
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

