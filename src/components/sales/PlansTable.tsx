import { BorderBeam } from "@/components/ui/border-beam";

type Plan = { name: string; price: string; features: string[]; cta: string };

const plans: Plan[] = [
  { name: "Start", price: "R$ 0/mês", features: ["Pix", "Boleto", "Suporte básico"], cta: "/auth/register" },
  { name: "Pro", price: "R$ 299/mês", features: ["Pix & Boleto", "PCI‑DSS", "SLA 99,9%"], cta: "/auth/register" },
  { name: "Enterprise", price: "Custom", features: ["Compliance avançado", "SLA dedicado", "Integrações"], cta: "/auth/register" },
];

export function PlansTable() {
  return (
    <section id="planos" aria-labelledby="planos-title" className="mx-auto max-w-7xl px-4 py-16">
      <h2 id="planos-title" className="text-2xl md:text-3xl font-semibold">Planos</h2>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {plans.map((p, index) => (
          <div key={p.name} className="relative rounded-lg border p-6 bg-background/70 overflow-hidden">
            <div className="flex items-baseline justify-between">
              <div className="text-xl font-semibold">{p.name}</div>
              <div className="text-sm text-muted-foreground">{p.price}</div>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2"><span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />{f}</li>
              ))}
            </ul>
            <a href={p.cta} className="mt-6 inline-flex h-9 px-4 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary" aria-label={`Selecionar ${p.name}`}>Selecionar</a>
            
            {/* Animated Border Beams */}
            <BorderBeam
              duration={6}
              delay={index * 2}
              size={150}
              colorFrom="#72879c"
              colorTo="transparent"
              borderWidth={2}
            />
            <BorderBeam
              duration={6}
              delay={index * 2 + 3}
              size={150}
              colorFrom="#a4e155"
              colorTo="transparent"
              borderWidth={1}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

