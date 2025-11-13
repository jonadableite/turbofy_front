"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  ArrowRight,
  Shield,
  Lock,
  Award,
  CheckCircle2,
  FileCheck,
} from "lucide-react";

const footerLinks = {
  produto: [
    { name: "Recursos", href: "#recursos" },
    { name: "Benefícios", href: "#beneficios" },
    { name: "API", href: "/docs" },
    { name: "Integrações", href: "#integracoes" },
    { name: "Changelog", href: "/changelog" },
  ],
  empresa: [
    { name: "Sobre Nós", href: "/about" },
    { name: "Carreiras", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Parceiros", href: "/partners" },
    { name: "Imprensa", href: "/press" },
  ],
  recursos: [
    { name: "Documentação", href: "/docs" },
    { name: "Guias", href: "/guides" },
    { name: "Tutoriais", href: "/tutorials" },
    { name: "Suporte", href: "/support" },
    { name: "Status", href: "https://status.turbofy.com" },
  ],
  legal: [
    { name: "Privacidade", href: "/privacy" },
    { name: "Termos de Uso", href: "/terms" },
    { name: "Segurança", href: "/security" },
    { name: "LGPD", href: "/lgpd" },
    { name: "Compliance", href: "/compliance" },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/turbofy" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/turbofy" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/turbofy" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/@turbofy" },
];

const certifications = [
  { icon: Shield, label: "PCI DSS Level 1", description: "Certificado" },
  { icon: Lock, label: "LGPD Compliant", description: "Conforme" },
  { icon: Award, label: "ISO 27001", description: "Certificado" },
  { icon: FileCheck, label: "SSL 256 bits", description: "Criptografia" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background border-t border-border overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Newsletter section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="py-12 border-b border-border/50"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">
                Fique por dentro das{" "}
                <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  novidades exclusivas
                </span>
              </h3>
              <p className="text-muted-foreground">
                Receba atualizações exclusivas sobre novos recursos, integrações premium e estratégias comprovadas
                para <strong className="text-foreground">aumentar suas vendas em até 45%</strong>
              </p>
            </div>
            <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Seu melhor email corporativo"
                required
                className="flex-1 rounded-lg border border-border bg-background/50 backdrop-blur-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <motion.button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-primary to-primary/80 px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="hidden sm:inline">Assinar Gratuitamente</span>
                <span className="sm:hidden">Assinar</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Certifications & Trust */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="py-8 border-b border-border/50"
        >
          <div className="text-center mb-6">
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Certificações e Compliance Internacional
            </h4>
            <p className="text-xs text-muted-foreground">
              Segurança e conformidade em primeiro lugar
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 rounded-lg bg-card/50 backdrop-blur-sm px-4 py-3 border border-border/30 hover:border-primary/30 transition-all"
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <cert.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{cert.label}</div>
                  <div className="text-xs text-muted-foreground">{cert.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main footer content */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="col-span-2 space-y-6"
          >
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-0 bg-primary blur-xl opacity-30" />
                <div className="relative h-10 w-10 rounded-lg bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Turbofy
              </span>
            </div>

            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              O gateway de pagamentos mais completo e confiável do Brasil. Transforme seu negócio com tecnologia de ponta,
              taxas transparentes e suporte especializado 24/7. <strong className="text-foreground">Mais de 5.000 empresas confiam em nós.</strong>
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 backdrop-blur-sm border border-border/30">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">R$ 2B+ Processados</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 backdrop-blur-sm border border-border/30">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">99.9% Uptime</span>
              </div>
            </div>

            {/* Contact info */}
            <div className="space-y-3 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:contato@turbofypay.com" className="hover:text-primary transition-colors">
                  contato@turbofypay.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+5561994614394" className="hover:text-primary transition-colors">
                  +55 (61) 99461-4394
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>São Paulo, SP - Brasil</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-primary/10 p-2.5 text-primary hover:bg-primary/20 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h4 className="font-semibold text-foreground capitalize text-sm">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar - Copyright & Legal */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="py-8 border-t border-border/50"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="text-center md:text-left space-y-2">
              <p className="text-sm font-semibold text-foreground">
                © {currentYear} <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">Turbofy Gateway de Pagamentos</span>. Todos os direitos reservados.
              </p>
              <p className="text-xs text-muted-foreground max-w-md">
                Turbofy Tecnologia em Pagamentos LTDA. CNPJ: 49.165.395/0001-71.
                Processamento de pagamentos seguro e confiável desde 2024. São Paulo, SP - Brasil.
              </p>
              <p className="text-xs text-muted-foreground">
                Turbofy é uma marca registrada. Todas as marcas, logotipos e nomes comerciais mencionados
                são de propriedade de seus respectivos proprietários. Os serviços financeiros são fornecidos
                por parceiros certificados e regulamentados pelo Banco Central do Brasil.
              </p>
            </div>

            {/* Legal links & Status */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Status indicator */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-green-600 dark:text-green-400">Sistema Online</span>
              </div>

              {/* Legal links */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                <Link href="/privacy" className="hover:text-primary transition-colors font-medium">
                  Política de Privacidade
                </Link>
                <span className="text-border">•</span>
                <Link href="/terms" className="hover:text-primary transition-colors font-medium">
                  Termos de Uso
                </Link>
                <span className="text-border">•</span>
                <Link href="/security" className="hover:text-primary transition-colors font-medium">
                  Segurança
                </Link>
                <span className="text-border">•</span>
                <Link href="/lgpd" className="hover:text-primary transition-colors font-medium">
                  LGPD
                </Link>
              </div>
            </div>
          </div>

          {/* Additional trust elements */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-6 pt-6 border-t border-border/30"
          >
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Pagamentos 100% Seguros</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                <span>Criptografia End-to-End</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                <span>Certificado PCI DSS Level 1</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Conforme LGPD</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};
