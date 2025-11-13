"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Maria Silva",
    role: "CEO",
    company: "E-commerce FastShop",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    content: "O Turbofy revolucionou nossa operação. Aumentamos 45% nas conversões apenas otimizando o checkout com as ferramentas deles.",
    rating: 5,
  },
  {
    name: "João Santos",
    role: "Fundador",
    company: "TechStartup",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
    content: "Integração mais rápida que já vi. Em 2 horas já estávamos aceitando pagamentos. Suporte impecável!",
    rating: 5,
  },
  {
    name: "Ana Costa",
    role: "CFO",
    company: "Marketplace ABC",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    content: "Reduzimos custos em 30% migrando para o Turbofy. As taxas são transparentes e o dashboard é muito intuitivo.",
    rating: 5,
  },
  {
    name: "Pedro Oliveira",
    role: "CTO",
    company: "SaaS Solutions",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
    content: "A API é completa e bem documentada. Implementamos split de pagamento em questão de horas.",
    rating: 5,
  },
  {
    name: "Carla Mendes",
    role: "Gerente de Produto",
    company: "RetailPro",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carla",
    content: "O melhor gateway que já usamos. Analytics em tempo real e relatórios que realmente fazem diferença.",
    rating: 5,
  },
  {
    name: "Ricardo Lima",
    role: "Diretor Comercial",
    company: "Digital Commerce",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ricardo",
    content: "Pix instantâneo funcionando perfeitamente. Nossos clientes amam a velocidade e praticidade.",
    rating: 5,
  },
];

// Duplicate for seamless loop
const allTestimonials = [...testimonials, ...testimonials];

export const Testimonials = () => {
  return (
    <section id="depoimentos" className="relative py-24 bg-linear-to-b from-muted/20 to-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 border border-primary/20">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span className="text-sm font-medium text-primary">Avaliação 4.9/5</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Amado por{" "}
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              mais de 5.000 empresas
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Veja o que nossos clientes dizem sobre a experiência com o Turbofy. 
            <strong className="text-foreground"> Avaliação média de 4.9/5 estrelas</strong> com mais de 10.000 avaliações.
          </p>
        </motion.div>

        {/* Testimonials marquee */}
        <div className="relative">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-background to-transparent z-10" />

          {/* First row - scroll right */}
          <motion.div
            animate={{
              x: [0, -2000],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
            className="flex gap-6 mb-6"
          >
            {allTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.name}-${index}`}
                className="flex-shrink-0 w-[400px]"
              >
                <div className="relative group overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all hover:border-primary/30 hover:shadow-xl h-full">
                  {/* Quote icon */}
                  <div className="absolute top-4 right-4 opacity-10">
                    <Quote className="h-16 w-16 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="relative space-y-4">
                    {/* Rating */}
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-primary fill-primary" />
                      ))}
                    </div>

                    {/* Testimonial text */}
                    <p className="text-foreground/90 leading-relaxed">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full bg-primary/10"
                      />
                      <div>
                        <div className="font-semibold text-foreground">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role} • {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shine effect */}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent" />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Second row - scroll left */}
          <motion.div
            animate={{
              x: [-2000, 0],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
            className="flex gap-6"
          >
            {allTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.name}-reverse-${index}`}
                className="flex-shrink-0 w-[400px]"
              >
                <div className="relative group overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all hover:border-primary/30 hover:shadow-xl h-full">
                  {/* Quote icon */}
                  <div className="absolute top-4 right-4 opacity-10">
                    <Quote className="h-16 w-16 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="relative space-y-4">
                    {/* Rating */}
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-primary fill-primary" />
                      ))}
                    </div>

                    {/* Testimonial text */}
                    <p className="text-foreground/90 leading-relaxed">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full bg-primary/10"
                      />
                      <div>
                        <div className="font-semibold text-foreground">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role} • {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shine effect */}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent" />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Junte-se a mais de 5.000 empresas que aumentaram vendas com o Turbofy
          </p>
          <motion.a
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-primary to-primary/80 px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Começar Agora - Grátis
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
