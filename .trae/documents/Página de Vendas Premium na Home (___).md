## Objetivo
Entregar uma landing page premium e performática para o endereço "/" que valorize o gateway de pagamentos (speed, security, compliance), com UI moderna, acessível, responsiva e testada.

## Arquitetura & Padrões
- Estrutura: Next.js App Router (src/app), SSG (estático) com `export const dynamic = "force-static"` e uso de `next/image`.
- Componentização: criação de componentes em `src/components/sales/*` e hooks em `src/hooks/*`.
- Naming: arquivos em kebab-case, componentes em PascalCase, hooks em camelCase; tipagem completa sem `any`.
- Tokens: reusar cores/tokens já existentes, garantindo contraste ≥ 4.5:1.

## Bibliotecas & UI
- Magic UI: usar como base para layout (grid, container, section) — caso não exista pacote, criar wrappers internos “MagicContainer”, “MagicSection”, “MagicGrid” com utilitários de responsividade e spacing.
- Aceternity UI: aproveitar componentes e padrões interativos/animados (botões, efeitos, microinterações) já presentes e estender onde necessário com Framer Motion.
- Framer Motion: animações suaves com duração ≤ 60ms de delay e easing consistente.

## Componentes (novos arquivos)
- `src/components/sales/Header.tsx`: logo, menu, role="navigation", foco visível, tema/CTA.
- `src/components/sales/Hero.tsx`: chamada principal, CTA “Comece agora” (link `/auth/register`), imagem otimizada WebP com `next/image` e `placeholder="blur"`.
- `src/components/sales/PremiumDemo.tsx`: demonstração interativa dos recursos premium (motion + parallax leve).
- `src/components/sales/Benefits.tsx`: 3–5 benefícios (“Transações em milissegundos”, “PCI‑DSS & LGPD”, “Suporte a PIX & Boleto”, etc.).
- `src/components/sales/PlansTable.tsx`: tabela comparativa de planos, células com feedback visual.
- `src/components/sales/Testimonials.tsx`: depoimentos com avatars WebP, slider acessível.
- `src/components/sales/Partners.tsx`: logotipos de parceiros (bancos/adquirentes) — assets em `public/partners/*.webp`.
- `src/components/sales/ContactForm.tsx`: formulário com validação (zod + react-hook-form), feedback visual, acessível.
- `src/components/sales/Footer.tsx`: links úteis, termos, privacidade, © ortte 2025.
- `src/hooks/useParallax.ts`: parallax suave baseado em `scrollYProgress`.
- `src/lib/seo.ts`: meta tags (title, description, og, twitter), helpers para `App Router`.

## Página Home
- `src/app/page.tsx`: composição dos componentes acima dentro de estrutura semântica (`<header>`, `<main>`, `<section>`, `<footer>`), roles ARIA e `aria-labelledby`.
- SSG: evitar data fetching dinâmico; carregar assets estáticos.

## Acessibilidade & SEO
- Semântico: `<header>`, `<main>`, `<section>`, `<footer>`; roles: `role="navigation"`, `role="region"` com `aria-labelledby`.
- Focus: `focus-visible:ring-2`; navegação de teclado sem armadilhas.
- ARIA: labels em botões/CTAs e sliders.
- SEO: `lib/seo.ts` + uso em `app/head.tsx`/metadata; lazy-load de imagens com `next/image`.

## Performance
- Tempo de carregamento < 2s: SSG, minimizar JS, imagens WebP, `next/image` com `priority` apenas no hero, `preload` de fontes essenciais.
- Animações: durações curtas, sem bloqueio do main thread; evitar heavy layouts.
- Audit: gerar relatório Lighthouse e otimizar até alcançar score alto (performance ≥ 90).

## Responsividade
- Breakpoints: validar 375, 480, 768, 1024, 1440/1920.
- Layout fluido: grid responsivo, imagens responsivas, tipografia adaptativa.

## Integrações & Conteúdo
- Valor do gateway: seção dedicada com cards de speed/security/compliance.
- Benefícios: blocos claros com ícones.
- Prova social: parceiros (logos) e depoimentos.
- CTA principal: “Comece agora” → `/auth/register`.
- Copyright: mensagem forte visível em Footer (e discreta nos créditos gerais).

## Testes
- Cross-browser: Playwright em Chrome/Firefox/WebKit (Safari)/Edge.
- Responsividade: testes automáticos em 5 breakpoints via Playwright.
- Acessibilidade: `@axe-core/playwright` para WCAG 2.1 AA (sem cores/título inválidos, labels ausentes, etc.).
- Formulários: validação client-side (zod) + testes de interação (Playwright) e unitários (vitest) para schema.

## Entregáveis
- Código organizado e reutilizável (components/sales/*, hooks, lib/seo.ts).
- Documentação técnica básica (`frontend/SALES_PAGE.md`): estrutura, decisões, como testar/rodar, checklist de A11y/SEO.
- Assets otimizados (WebP), pasta `public/partners`.
- Relatório Lighthouse (`frontend/reports/lighthouse.html` + `frontend/reports/lighthouse.json`).

## Implementação Técnica Detalhada
- Criar componentes com props tipadas, sem `any`.
- Parallax: `useParallax` com `useScroll` + `useTransform` (Framer Motion).
- Form: `react-hook-form` + `zod`; submissão client-side (placeholder para envio, ex: `/api/contact` ou `mailto:`); feedback de sucesso/erro.
- Efeitos: microinterações (hover, focus), transitions ≤ 60ms; respeitar `prefers-reduced-motion`.
- SEO: configurar metadata e Open Graph; títulos e descrições relevantes.

## Ajustes de Build & Config (se necessário)
- Garantir que a página na home substitua o conteúdo atual em `src/app/page.tsx`.
- Manter SSG para garantir performance.
- Se “Magic UI” não estiver disponível como pacote, implementar internamente as abstrações de layout.

## Plano de Testes
- Playwright: specs para navegação, hero/CTA, responsividade, a11y com axe, sliders/testimonials, formulário.
- Vitest: schemas zod e componentes críticos sem efeitos colaterais.
- Lighthouse: script de geração local com server estático.

## Aceite & Critérios
- Build sem erros; tempo de carregamento < 2s em desktop (rede standard local), imagens WebP, animações suaves.
- Acessibilidade WCAG 2.1 AA: sem issues críticas no axe.
- Cross-browser sem regressões (Chrome/Firefox/Safari/Edge).
- CTA funcional e conteúdo conforme especificado.

## Cronograma
- Fase 1: componentes e página (home).
- Fase 2: performance e a11y.
- Fase 3: testes automatizados e relatório Lighthouse.

Confirma este plano para que eu implemente os componentes, página e testes conforme descrito?