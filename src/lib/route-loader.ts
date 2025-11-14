/**
 * Sistema de lazy loading e pré-carregamento de rotas
 */

import { ComponentType, lazy, LazyExoticComponent } from "react";

// Cache de componentes carregados
const componentCache = new Map<string, LazyExoticComponent<ComponentType<unknown>>>();

// Rotas prioritárias (pré-carregar)
const PRIORITY_ROUTES = [
  "/dashboard",
  "/login",
  "/register",
];

/**
 * Criar componente lazy com cache
 */
export const createLazyRoute = <T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  routeName: string
): LazyExoticComponent<T> => {
  // Verificar cache primeiro
  if (componentCache.has(routeName)) {
    return componentCache.get(routeName) as LazyExoticComponent<T>;
  }

  // Criar componente lazy
  const LazyComponent = lazy(importFn) as LazyExoticComponent<T>;
  
  // Armazenar no cache
  componentCache.set(routeName, LazyComponent as LazyExoticComponent<ComponentType<unknown>>);
  
  return LazyComponent;
};

/**
 * Pré-carregar rota
 */
export const preloadRoute = async (routeName: string): Promise<void> => {
  // Mapeamento de rotas para seus imports
  // Apenas rotas existentes são incluídas aqui
  const routeMap: Record<string, () => Promise<unknown>> = {
    "/dashboard": () => import("@/app/(dashboard)/dashboard/page"),
    "/login": () => import("@/app/(auth)/login/page"),
    "/register": () => import("@/app/(auth)/register/page"),
    "/forgot": () => import("@/app/(auth)/forgot/page"),
    // Rotas futuras serão adicionadas quando as páginas forem criadas
    // "/vitrine": () => import("@/app/(dashboard)/vitrine/page"),
    // "/vendas": () => import("@/app/(dashboard)/vendas/page"),
    // "/financeiro": () => import("@/app/(dashboard)/financeiro/page"),
    // "/clientes": () => import("@/app/(dashboard)/clientes/page"),
    // "/afiliados": () => import("@/app/(dashboard)/afiliados/page"),
    // "/produtos": () => import("@/app/(dashboard)/produtos/page"),
    // "/configuracoes": () => import("@/app/(dashboard)/configuracoes/page"),
    // "/integracoes": () => import("@/app/(dashboard)/integracoes/page"),
  };

  const importFn = routeMap[routeName];
  if (!importFn) return;

  try {
    await importFn();
  } catch (error) {
    console.warn(`Falha ao pré-carregar rota ${routeName}:`, error);
  }
};

/**
 * Pré-carregar rotas prioritárias
 */
export const preloadPriorityRoutes = (): void => {
  if (typeof window === "undefined") return;

  // Pré-carregar após um pequeno delay para não bloquear renderização inicial
  setTimeout(() => {
    PRIORITY_ROUTES.forEach((route) => {
      preloadRoute(route);
    });
  }, 1000);
};

/**
 * Pré-carregar rota ao hover em link
 */
export const useRoutePreload = () => {
  const handleMouseEnter = (routeName: string) => {
    preloadRoute(routeName);
  };

  return { handleMouseEnter };
};

