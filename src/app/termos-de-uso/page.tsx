import { Header } from "@/components/sales/Header";
import { Footer } from "@/components/sales/Footer";

export const metadata = {
  title: "Termos de Uso | Turbofy",
  description: "Termos de Uso da plataforma Turbofy - Gateway de Pagamentos",
};

export default function TermosDeUso() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4 pb-8 border-b border-border">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Termos de Uso
            </h1>
            <p className="text-lg text-muted-foreground">
              Última atualização: 14 de novembro de 2024
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">I. DEFINIÇÕES</h2>
              <p className="text-muted-foreground leading-relaxed">
                1.1. Para fins deste Termo de Uso:
              </p>
              
              <div className="space-y-4 pl-4">
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">a) Gateway de Pagamento:</strong> serviço tecnológico prestado pela turbofy SOLUÇÕES FINANCEIRAS LTDA, que permite a integração de sistemas de pagamento com sites, plataformas ou aplicativos de terceiros, viabilizando a comunicação entre o Usuário e instituições financeiras;
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">b) Usuário:</strong> pessoa jurídica que contrata os serviços da turbofy SOLUÇÕES FINANCEIRAS LTDA para viabilizar a integração dos sistemas da plataforma, junto a adquirentes, subadquirentes ou instituições financeiras;
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">c) Cliente Final:</strong> consumidor que realiza a compra de produtos ou serviços junto ao Usuário;
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">d) Instituição Financeira:</strong> adquirente, subadquirente ou outro agente financeiro responsável pela autorização e liquidação de pagamentos;
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">e) Plataforma:</strong> ambiente digital fornecido pela turbofy SOLUÇÕES FINANCEIRAS LTDA para gestão técnica das integrações de pagamento.
                </p>
              </div>
            </section>

            <section className="space-y-4 pt-8">
              <h2 className="text-3xl font-bold text-foreground">II. OBJETO</h2>
              <p className="text-muted-foreground leading-relaxed">
                2.1. O presente Termo regula o uso da Plataforma tecnológica de gateway de pagamento da turbofy SOLUÇÕES FINANCEIRAS LTDA, cuja função é viabilizar a integração entre sistemas do Usuário e redes de pagamento, sem intermediação financeira direta ou participação na relação de consumo entre o Usuário e o Cliente Final.
              </p>
            </section>

            <section className="space-y-4 pt-8">
              <h2 className="text-3xl font-bold text-foreground">III. ACEITAÇÃO DOS TERMOS</h2>
              <p className="text-muted-foreground leading-relaxed">
                3.1. A utilização da Plataforma implica na leitura, compreensão e aceitação integral deste Termo, sendo vinculante para o Usuário a partir do primeiro acesso ou contratação. Portanto, o usuário concorda em cumprir e estar vinculado a estes Termos de Uso e à Política de Privacidade. Caso discorde de qualquer termo ora avençado, não proceda com a utilização dos serviços prestados pela turbofy SOLUÇÕES FINANCEIRAS LTDA.
              </p>
            </section>

            <section className="space-y-4 pt-8">
              <h2 className="text-3xl font-bold text-foreground">IV. DO PAPEL DA PLATAFORMA</h2>
              <p className="text-muted-foreground leading-relaxed">
                4.1. A turbofy SOLUÇÕES FINANCEIRAS LTDA oferece soluções de pagamentos eletrônicos para empresas, com foco em segurança e compliance. Ela permite transações rápidas, integração por API para e-commerces e ERPs, e suporte para múltiplos métodos de pagamento, incluindo PIX. O processo de abertura de conta é simplificado, e a plataforma prioriza a privacidade e a proteção contra fraudes.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                4.2. A turbofy SOLUÇÕES FINANCEIRAS LTDA não atua como instituição financeira ou subadquirente, tampouco realiza intermediação na relação de consumo entre o Usuário e seu Cliente Final. Sua atuação limita-se à execução técnica das operações autorizadas e à disponibilização de funcionalidades de gestão e segurança das transações.
              </p>
            </section>

            <section className="space-y-4 pt-8">
              <h2 className="text-3xl font-bold text-foreground">V. DA PRESTAÇÃO DE SERVIÇOS E DA LIMITAÇÃO DE RESPONSABILIDADE DAS PARTES</h2>
              <p className="text-muted-foreground leading-relaxed">
                5.1. O Usuário declara estar ciente que a turbofy SOLUÇÕES FINANCEIRAS LTDA fornece soluções tecnológicas de integração para pagamentos eletrônicos com foco em segurança e compliance. A plataforma permite/fornece a(o):
              </p>
              <div className="space-y-2 pl-4">
                <p className="text-muted-foreground">a) Integração via API com ERPs, e-commerces, com adquirentes e subadquirentes credenciados;</p>
                <p className="text-muted-foreground">b) Geração e gestão de QR Codes para pagamentos via Pix;</p>
                <p className="text-muted-foreground">c) Suporte técnico para monitoramento e registro de transações;</p>
                <p className="text-muted-foreground">d) Mecanismos de prevenção a fraudes;</p>
              </div>
            </section>

            <section className="space-y-4 pt-8">
              <h2 className="text-3xl font-bold text-foreground">VI. LIMITAÇÃO DE RESPONSABILIDADE SOBRE A RELAÇÃO COMERCIAL</h2>
              <p className="text-muted-foreground leading-relaxed">
                6.1. A turbofy SOLUÇÕES FINANCEIRAS LTDA não tem qualquer participação ou responsabilidade sobre os produtos, serviços ou relações comerciais estabelecidas entre o Usuário e seus respectivos Clientes Finais, não respondendo por eventuais disputas, vícios, inadimplementos ou obrigações decorrentes de tais relações.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                6.2. A responsabilidade integral por tais relações comerciais, inclusive, mas não se limitando a atendimento ao consumidor, estornos, fraudes e disputas financeiras no âmbito extrajudicial e/ou judicial, de qualquer natureza, é exclusiva do Usuário contratante.
              </p>
            </section>

            <section className="space-y-4 pt-8">
              <h2 className="text-3xl font-bold text-foreground">VII. OBRIGAÇÕES DO USUÁRIO</h2>
              <p className="text-muted-foreground leading-relaxed">
                8.1. Compete ao Usuário:
              </p>
              <div className="space-y-2 pl-4">
                <p className="text-muted-foreground">a) Manter sua infraestrutura técnica compatível com a Plataforma;</p>
                <p className="text-muted-foreground">b) Obter e manter as credenciais junto às adquirentes ou subadquirentes integradas;</p>
                <p className="text-muted-foreground">c) Zelar pelo uso ético, legal e seguro da Plataforma;</p>
                <p className="text-muted-foreground">d) Prestar atendimento direto ao seu Cliente Final;</p>
                <p className="text-muted-foreground">e) Responder integralmente por fraudes, estornos e disputas.</p>
              </div>
            </section>

            <section className="space-y-4 pt-8">
              <h2 className="text-3xl font-bold text-foreground">VIII. PRIVACIDADE E PROTEÇÃO DE DADOS</h2>
              <p className="text-muted-foreground leading-relaxed">
                10.1. A turbofy SOLUÇÕES FINANCEIRAS LTDA compromete-se a tratar os dados pessoais coletados por meio da Plataforma em conformidade com a Lei Federal nº 13.709/2018 (Lei Geral de Proteção de Dados – LGPD) e demais normas aplicáveis, observando os princípios da finalidade, necessidade, adequação, segurança e transparência.
              </p>
            </section>

            <section className="space-y-4 pt-8">
              <h2 className="text-3xl font-bold text-foreground">IX. FORO</h2>
              <p className="text-muted-foreground leading-relaxed">
                18.1. Fica eleito o foro da comarca de São Paulo, capital do Estado de São Paulo, com renúncia de qualquer outro, por mais privilegiado que seja, para dirimir eventuais conflitos decorrentes da interpretação ou execução deste Termo.
              </p>
            </section>

            {/* CTA Section */}
            <section className="pt-12 mt-12 border-t border-border">
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 text-center space-y-4">
                <h3 className="text-2xl font-bold text-foreground">
                  Tem alguma dúvida sobre nossos termos?
                </h3>
                <p className="text-muted-foreground">
                  Nossa equipe está pronta para ajudar você
                </p>
                <a
                  href="/contato"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 px-6 py-3 text-base font-semibold text-background hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  Falar com o Suporte
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

