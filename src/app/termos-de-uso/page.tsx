"use client";

import { motion } from "framer-motion";
import { FileText, ArrowLeft, Scale, Shield, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 bg-linear-to-b from-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 px-6 py-3 border border-primary/20">
              <Scale className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Termos de Uso</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Termos de Uso da Plataforma
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              turbofy SOLUÇÕES FINANCEIRAS LTDA
            </p>
            
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Última atualização: Novembro 2024</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-lg prose-slate dark:prose-invert max-w-none"
          >
            {/* Alert Box */}
            <div className="not-prose mb-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex gap-4">
                <AlertCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">Importante</h3>
                  <p className="text-sm text-muted-foreground">
                    A utilização da Plataforma implica na leitura, compreensão e aceitação integral deste Termo. 
                    Caso discorde de qualquer termo, não proceda com a utilização dos serviços prestados pela turbofy SOLUÇÕES FINANCEIRAS LTDA.
                  </p>
                </div>
              </div>
            </div>

            {/* I. DEFINIÇÕES */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary text-xl">I</span>
                DEFINIÇÕES
              </h2>
              
              <div className="space-y-4 pl-4">
                <p className="text-muted-foreground">1.1. Para fins deste Termo de Uso:</p>
                
                <div className="space-y-3 pl-6">
                  <div>
                    <strong className="text-foreground">a) Gateway de Pagamento:</strong>
                    <span className="text-muted-foreground"> serviço tecnológico prestado pela turbofy SOLUÇÕES FINANCEIRAS LTDA, que permite a integração de sistemas de pagamento com sites, plataformas ou aplicativos de terceiros, viabilizando a comunicação entre o Usuário e instituições financeiras;</span>
                  </div>
                  
                  <div>
                    <strong className="text-foreground">b) Usuário:</strong>
                    <span className="text-muted-foreground"> pessoa jurídica que contrata os serviços da turbofy SOLUÇÕES FINANCEIRAS LTDA para viabilizar a integração dos sistemas da plataforma, junto a adquirentes, subadquirentes ou instituições financeiras;</span>
                  </div>
                  
                  <div>
                    <strong className="text-foreground">c) Cliente Final:</strong>
                    <span className="text-muted-foreground"> consumidor que realiza a compra de produtos ou serviços junto ao Usuário;</span>
                  </div>
                  
                  <div>
                    <strong className="text-foreground">d) Instituição Financeira:</strong>
                    <span className="text-muted-foreground"> adquirente, subadquirente ou outro agente financeiro responsável pela autorização e liquidação de pagamentos;</span>
                  </div>
                  
                  <div>
                    <strong className="text-foreground">e) Plataforma:</strong>
                    <span className="text-muted-foreground"> ambiente digital fornecido pela turbofy SOLUÇÕES FINANCEIRAS LTDA para gestão técnica das integrações de pagamento.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* II. OBJETO */}
            <div className="space-y-6 mt-12">
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary text-xl">II</span>
                OBJETO
              </h2>
              
              <div className="space-y-4 pl-4">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">2.1.</strong> O presente Termo regula o uso da Plataforma tecnológica de gateway de pagamento da turbofy SOLUÇÕES FINANCEIRAS LTDA, cuja função é viabilizar a integração entre sistemas do Usuário e redes de pagamento, sem intermediação financeira direta ou participação na relação de consumo entre o Usuário e o Cliente Final.
                </p>
              </div>
            </div>

            {/* III. ACEITAÇÃO DOS TERMOS */}
            <div className="space-y-6 mt-12">
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary text-xl">III</span>
                ACEITAÇÃO DOS TERMOS
              </h2>
              
              <div className="space-y-4 pl-4">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">3.1.</strong> A utilização da Plataforma implica na leitura, compreensão e aceitação integral deste Termo, sendo vinculante para o Usuário a partir do primeiro acesso ou contratação. Portanto, o usuário concorda em cumprir e estar vinculado a estes Termos de Uso e à Política de Privacidade. Caso discorde de qualquer termo ora avençado, não proceda com a utilização dos serviços prestados pela turbofy SOLUÇÕES FINANCEIRAS LTDA.
                </p>
              </div>
            </div>

            {/* IV. DO PAPEL DA PLATAFORMA */}
            <div className="space-y-6 mt-12">
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary text-xl">IV</span>
                DO PAPEL DA PLATAFORMA
              </h2>
              
              <div className="space-y-4 pl-4">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">4.1.</strong> A turbofy SOLUÇÕES FINANCEIRAS LTDA oferece soluções de pagamentos eletrônicos para empresas, com foco em segurança e compliance. Ela permite transações rápidas, integração por API para e-commerces e ERPs, e suporte para múltiplos métodos de pagamento, incluindo PIX. O processo de abertura de conta é simplificado, e a plataforma prioriza a privacidade e a proteção contra fraudes.
                </p>
                
                <p className="text-muted-foreground">
                  <strong className="text-foreground">4.2.</strong> A turbofy SOLUÇÕES FINANCEIRAS LTDA não atua como instituição financeira ou subadquirente, tampouco realiza intermediação na relação de consumo entre o Usuário e seu Cliente Final. Sua atuação limita-se à execução técnica das operações autorizadas e à disponibilização de funcionalidades de gestão e segurança das transações.
                </p>
              </div>
            </div>

            {/* V. DA PRESTAÇÃO DE SERVIÇOS */}
            <div className="space-y-6 mt-12">
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary text-xl">V</span>
                DA PRESTAÇÃO DE SERVIÇOS E DA LIMITAÇÃO DE RESPONSABILIDADE DAS PARTES
              </h2>
              
              <div className="space-y-4 pl-4">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">5.1.</strong> O Usuário declara estar ciente que a turbofy SOLUÇÕES FINANCEIRAS LTDA fornece soluções tecnológicas de integração para pagamentos eletrônicos com foco em segurança e compliance. A plataforma permite/fornece a(o):
                </p>
                
                <div className="space-y-2 pl-6">
                  <p className="text-muted-foreground">a) Integração via API com ERPs, e-commerces, com adquirentes e subadquirentes credenciados;</p>
                  <p className="text-muted-foreground">b) Geração e gestão de QR Codes para pagamentos via Pix;</p>
                  <p className="text-muted-foreground">c) Suporte técnico para monitoramento e registro de transações;</p>
                  <p className="text-muted-foreground">d) Mecanismos de prevenção a fraudes;</p>
                </div>
              </div>
            </div>

            {/* VI. LIMITAÇÃO DE RESPONSABILIDADE SOBRE A RELAÇÃO COMERCIAL */}
            <div className="space-y-6 mt-12">
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary text-xl">VI</span>
                LIMITAÇÃO DE RESPONSABILIDADE SOBRE A RELAÇÃO COMERCIAL
              </h2>
              
              <div className="space-y-4 pl-4">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">6.1.</strong> A turbofy SOLUÇÕES FINANCEIRAS LTDA não tem qualquer participação ou responsabilidade sobre os produtos, serviços ou relações comerciais estabelecidas entre o Usuário e seus respectivos Clientes Finais, não respondendo por eventuais disputas, vícios, inadimplementos ou obrigações decorrentes de tais relações.
                </p>
                
                <p className="text-muted-foreground">
                  <strong className="text-foreground">6.2.</strong> A responsabilidade integral por tais relações comerciais, inclusive, mas não se limitando a atendimento ao consumidor, estornos, fraudes e disputas financeiras no âmbito extrajudicial e/ou judicial, de qualquer natureza, é exclusiva do Usuário contratante.
                </p>
                
                <p className="text-muted-foreground">
                  <strong className="text-foreground">6.3.</strong> Não é de responsabilidade da turbofy SOLUÇÕES FINANCEIRAS LTDA:
                </p>
                
                <div className="space-y-2 pl-6">
                  <p className="text-muted-foreground">a) Realizar liquidação financeira ou repasse de valores;</p>
                  <p className="text-muted-foreground">b) Fornecer suporte ao Cliente Final;</p>
                  <p className="text-muted-foreground">c) Atuar como subadquirente, facilitador ou processador de pagamentos;</p>
                  <p className="text-muted-foreground">d) Intervir nas relações comerciais entre Usuário e Cliente Final.</p>
                </div>
                
                <p className="text-muted-foreground">
                  <strong className="text-foreground">6.4.</strong> A turbofy SOLUÇÕES FINANCEIRAS LTDA também não se responsabiliza por:
                </p>
                
                <div className="space-y-2 pl-6">
                  <p className="text-muted-foreground">a) Erros ou falhas na liquidação de pagamentos realizados por instituições financeiras;</p>
                  <p className="text-muted-foreground">b) Problemas técnicos decorrentes de terceiros;</p>
                  <p className="text-muted-foreground">c) Qualquer relação comercial entre Usuário e Cliente Final.</p>
                </div>
              </div>
            </div>

            {/* Continue com as outras seções... */}
            <div className="not-prose mt-16 p-8 rounded-2xl border border-border bg-card/50">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-primary shrink-0" />
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">Dúvidas sobre os Termos de Uso?</h3>
                  <p className="text-muted-foreground">
                    Entre em contato conosco através do e-mail <a href="mailto:juridico@turbofypay.com" className="text-primary hover:underline">juridico@turbofypay.com</a> ou 
                    através do nosso <Link href="/#contato" className="text-primary hover:underline">formulário de contato</Link>.
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    <strong>Foro:</strong> Comarca de São Paulo, capital do Estado de São Paulo
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-linear-to-b from-background to-primary/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-foreground">
              Pronto para começar?
            </h2>
            <p className="text-xl text-muted-foreground">
              Crie sua conta e comece a receber pagamentos hoje mesmo
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-primary to-primary/80 px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40"
            >
              Criar Conta Grátis
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

