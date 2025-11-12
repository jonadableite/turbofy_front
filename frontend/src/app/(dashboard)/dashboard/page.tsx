"use client";

import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink, SidebarSection } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { HealthStatusCard } from "@/components/dashboard/health-status-card";
import { TopProducts } from "@/components/dashboard/top-products";
import { Achievements } from "@/components/dashboard/achievements";
import { Logo, LogoIcon } from "@/components/sidebar-demo";
import { useDashboard } from "@/hooks/use-dashboard";
import { useAuth } from "@/contexts/auth-context";
import {
  IconBrandTabler,
  IconShoppingCart,
  IconChartLine,
  IconUsers,
  IconAffiliate,
  IconSettings,
  IconPlug,
} from "@tabler/icons-react";
import {
  ShoppingCart,
  TrendingUp,
  DollarSign,
  CreditCard,
  Receipt,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trophy,
  Award,
  Star,
  Package,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockAchievements = [
  {
    id: "1",
    title: "Primeiro Milhão",
    description: "Alcançou R$ 1M em vendas",
    icon: <Trophy className="h-6 w-6" />,
    color: "bg-green-500/20 text-green-500",
  },
  {
    id: "2",
    title: "Vendedor Top",
    description: "Top 10 do mês",
    icon: <Award className="h-6 w-6" />,
    color: "bg-orange-500/20 text-orange-500",
  },
  {
    id: "3",
    title: "Estrela",
    description: "100+ avaliações 5 estrelas",
    icon: <Star className="h-6 w-6" />,
    color: "bg-blue-500/20 text-blue-500",
  },
];

export default function DashboardPage() {
  // Sidebar começa aberta e fixada por padrão
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, loading: authLoading, error: authError, isAuthenticated } = useAuth();

  const getDisplayName = (email?: string, name?: string) => {
    if (name && name.trim().length > 0) return name.trim();
    if (email && email.includes("@")) return email.split("@")[0];
    return "Usuário";
  };

  const displayName = getDisplayName(user?.email, user?.name);

  const merchantId = (() => {
    if (!isAuthenticated || !user) return "";
    try {
      const stored = sessionStorage.getItem("turbofy:merchantId");
      if (stored && stored.length > 0) return stored;
    } catch {
      /* ignore */
    }
    return user.id;
  })();

  const {
    metrics,
    revenueData,
    healthMetrics,
    topProducts,
    loading,
    error,
  } = useDashboard(merchantId);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value / 100); // Converter de centavos para reais
  };

  // Preparar métricas de saúde
  const healthMetricsData = healthMetrics
    ? [
      {
        label: "Pagamentos aprovados",
        value: formatCurrency(healthMetrics.approvedPayments),
        status: "success" as const,
        icon: <CheckCircle2 className="h-5 w-5" />,
      },
      {
        label: "Pagamentos reembolsados",
        value: formatCurrency(healthMetrics.refundedPayments),
        status: "warning" as const,
        icon: <AlertTriangle className="h-5 w-5" />,
      },
      {
        label: "Pagamentos com falha",
        value: formatCurrency(healthMetrics.failedPayments),
        status: "error" as const,
        icon: <XCircle className="h-5 w-5" />,
      },
      {
        label: "Chargebacks",
        value: `${healthMetrics.chargebackRate.toFixed(2)}%`,
        status: "warning" as const,
        icon: <AlertTriangle className="h-5 w-5" />,
      },
    ]
    : [];

  const sidebarLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-primary" />,
    },
    {
      label: "Vitrine",
      href: "/vitrine",
      icon: <IconShoppingCart className="h-5 w-5 shrink-0 text-foreground" />,
    },
    {
      label: "Vendas",
      href: "/vendas",
      icon: <IconChartLine className="h-5 w-5 shrink-0 text-foreground" />,
    },
    {
      label: "Financeiro",
      href: "/financeiro",
      icon: <DollarSign className="h-5 w-5 shrink-0 text-foreground" />,
    },
    {
      label: "Clientes",
      href: "/clientes",
      icon: <IconUsers className="h-5 w-5 shrink-0 text-foreground" />,
    },
    {
      label: "Afiliados",
      href: "/afiliados",
      icon: <IconAffiliate className="h-5 w-5 shrink-0 text-foreground" />,
    },
    {
      label: "Produtos",
      href: "/produtos",
      icon: <Package className="h-5 w-5 shrink-0 text-foreground" />,
    },
    {
      label: "Configurações",
      href: "/configuracoes",
      icon: <IconSettings className="h-5 w-5 shrink-0 text-foreground" />,
    },
    {
      label: "Integrações",
      href: "/integracoes",
      icon: <IconPlug className="h-5 w-5 shrink-0 text-foreground" />,
    },
  ];

  const salesLabels = ["Vitrine", "Vendas", "Clientes", "Afiliados", "Produtos"] as const;
  const financeLabels = ["Financeiro", "Integrações", "Configurações"] as const;

  const dashboardLink = sidebarLinks.find((l) => l.label === "Dashboard");
  const salesLinks = sidebarLinks.filter((l) => salesLabels.includes(l.label as typeof salesLabels[number]));
  const financeLinks = sidebarLinks.filter((l) => financeLabels.includes(l.label as typeof financeLabels[number]));


  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Fixada e aberta por padrão */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} variant="flat">
        <SidebarBody className="justify-between gap-8">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <div className="mb-6">
              {sidebarOpen ? <Logo /> : <LogoIcon />}
            </div>
            <div className="flex flex-col gap-4">
              {dashboardLink && (
                <SidebarLink
                  link={dashboardLink}
                  className={cn("bg-primary/10 text-primary font-semibold")}
                />
              )}
              <SidebarSection title="Área de Vendas">
                {salesLinks.map((link, idx) => (
                  <SidebarLink key={`sales-${idx}`} link={link} />
                ))}
              </SidebarSection>
              <SidebarSection title="Financeiro">
                {financeLinks.map((link, idx) => (
                  <SidebarLink key={`fin-${idx}`} link={link} />
                ))}
              </SidebarSection>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="mt-auto pt-4 border-t border-border">
            {authLoading ? (
              <SidebarLink
                link={{
                  label: "Carregando…",
                  href: "#",
                  icon: (
                    <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ),
                }}
              />
            ) : authError ? (
              <SidebarLink
                link={{
                  label: "Erro ao carregar",
                  href: "#",
                  icon: (
                    <div className="h-8 w-8 shrink-0 rounded-full bg-destructive/20 flex items-center justify-center border-2 border-destructive">
                      <XCircle className="h-4 w-4 text-destructive" />
                    </div>
                  ),
                }}
              />
            ) : (
              <SidebarLink
                link={{
                  label: displayName,
                  href: "/profile",
                  icon: (
                    <div className="h-8 w-8 shrink-0 rounded-full bg-primary flex items-center justify-center border-2 border-primary shadow-lg shadow-primary/20">
                      <span className="text-xs font-bold text-primary-foreground">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  ),
                }}
              />
            )}
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden bg-card">
        <DashboardHeader
          progress={{ current: 582200, target: 650000 }}
          userName={authLoading ? "Carregando…" : displayName}
          notifications={2}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {authLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !isAuthenticated ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-destructive mb-2">Você precisa estar autenticado para acessar o dashboard</p>
                <button
                  onClick={() => window.location.href = "/login"}
                  className="text-primary hover:underline"
                >
                  Ir para login
                </button>
              </div>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-destructive mb-2">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-primary hover:underline"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-7xl space-y-6">
              {/* Metrics Cards */}
              {metrics && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                  <MetricCard
                    title="Total em vendas"
                    value={formatCurrency(metrics.totalSales)}
                    subtitle={formatCurrency(metrics.totalSales)}
                    icon={ShoppingCart}
                    action={{
                      label: "Solicitar saque",
                      onClick: () => console.log("Solicitar saque"),
                    }}
                  />
                  <MetricCard
                    title="Total de transações"
                    value={metrics.totalTransactions.toLocaleString("pt-BR")}
                    icon={Activity}
                    trend={{ value: "+12%", isPositive: true }}
                  />
                  <MetricCard
                    title="Ticket médio"
                    value={formatCurrency(metrics.averageTicket)}
                    icon={TrendingUp}
                  />
                  <MetricCard
                    title="Vendas por PIX"
                    value={formatCurrency(metrics.pixSales)}
                    icon={DollarSign}
                  />
                  <MetricCard
                    title="Vendas por Cartão"
                    value={formatCurrency(metrics.cardSales)}
                    icon={CreditCard}
                  />
                  <MetricCard
                    title="Vendas por Boleto"
                    value={formatCurrency(metrics.boletoSales)}
                    icon={Receipt}
                  />
                </div>
              )}

              {/* Charts and Health */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <RevenueChart
                  data={revenueData}
                  className="lg:col-span-2"
                />
                {healthMetricsData.length > 0 && (
                  <HealthStatusCard metrics={healthMetricsData} />
                )}
              </div>

              {/* Products and Achievements */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {topProducts.length > 0 && (
                  <TopProducts products={topProducts} className="lg:col-span-2" />
                )}
                <Achievements achievements={mockAchievements} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

