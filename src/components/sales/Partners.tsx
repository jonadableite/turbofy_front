"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

const partners = [
  { name: "Stripe", logo: "https://cdn.worldvectorlogo.com/logos/stripe-4.svg" },
  { name: "PayPal", logo: "https://cdn.worldvectorlogo.com/logos/paypal-2.svg" },
  { name: "Visa", logo: "https://cdn.worldvectorlogo.com/logos/visa-2.svg" },
  { name: "Mastercard", logo: "https://cdn.worldvectorlogo.com/logos/mastercard-6.svg" },
  { name: "American Express", logo: "https://cdn.worldvectorlogo.com/logos/american-express-1.svg" },
  { name: "Elo", logo: "https://cdn.worldvectorlogo.com/logos/elo-2.svg" },
  { name: "Banco do Brasil", logo: "https://cdn.worldvectorlogo.com/logos/banco-do-brasil-1.svg" },
  { name: "Itaú", logo: "https://cdn.worldvectorlogo.com/logos/itau-2.svg" },
  { name: "Bradesco", logo: "https://cdn.worldvectorlogo.com/logos/bradesco-1.svg" },
  { name: "Santander", logo: "https://cdn.worldvectorlogo.com/logos/santander-5.svg" },
];

// Duplicate for seamless loop
const allPartners = [...partners, ...partners, ...partners];

export const Partners = () => {
  return (
    <section id="parceiros" className="relative py-16 bg-muted/20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 border border-primary/20">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Parceiros e Integrações</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Integrado com os{" "}
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              principais players
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conecte-se facilmente com bancos, processadores e ferramentas que você já usa
          </p>
        </motion.div>

        {/* Partners marquee */}
        <div className="relative">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-muted/20 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-muted/20 to-transparent z-10" />

          <motion.div
            animate={{
              x: [0, -1920],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
            className="flex gap-8 items-center"
          >
            {allPartners.map((partner, index) => (
              <motion.div
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 w-[160px] h-[80px] flex items-center justify-center rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 hover:border-primary/30 hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {[
            { value: "50+", label: "Integrações Disponíveis" },
            { value: "99.9%", label: "Uptime Garantido" },
            { value: "24/7", label: "Suporte Técnico" },
            { value: "< 2h", label: "Tempo de Integração" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-bold bg-linear-to-br from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
