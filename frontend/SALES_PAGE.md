Objetivo
- Landing page premium na Home ("/") com foco em speed, security, compliance.

Estrutura
- Componentes em src/components/sales/* e rota API em src/app/api/contact/route.ts.
- SSG com `export const dynamic = "force-static"` em src/app/page.tsx.

Acessibilidade & SEO
- Semântica com sections e roles.
- `lib/seo.ts` para metadados; usar em head/metadata quando necessário.

Performance
- Imagens com next/image e placeholder blur.
- Animações curtas com Framer Motion.

Testes
- Playwright para cross-browser e responsividade.
- Axe-core para WCAG 2.1 AA.
- Vitest para schemas do formulário.

Build
- `pnpm -C frontend run dev` para desenvolvimento.
- `pnpm -C frontend run build` para produção.
