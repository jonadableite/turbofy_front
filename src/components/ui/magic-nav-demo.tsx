"use client";

import { MagicNavIndicator, NavItem } from "./magic-nav-indicator";
import { Home, User, MessageSquare, Camera, Settings, CreditCard, BarChart3, Users } from "lucide-react";

// Exemplo de uso com diferentes configurações
export function MagicNavDemo() {
  const defaultItems: NavItem[] = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "profile", label: "Profile", icon: User, href: "/profile" },
    { id: "messages", label: "Messages", icon: MessageSquare, href: "/messages" },
    { id: "photos", label: "Photos", icon: Camera, href: "/photos" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ];

  const dashboardItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
    { id: "transactions", label: "Transações", icon: CreditCard, href: "/transactions" },
    { id: "analytics", label: "Analytics", icon: BarChart3, href: "/analytics" },
    { id: "customers", label: "Clientes", icon: Users, href: "/customers" },
    { id: "settings", label: "Config", icon: Settings, href: "/settings" },
  ];

  return (
    <div className="space-y-12 p-8 bg-background min-h-screen">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#a4e155] to-[#72879c] bg-clip-text text-transparent">
          Magic Navigation Indicator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Navegação mágica com indicador animado e efeito de curva externa (cut-out)
        </p>
      </div>

      {/* Demo 1: Navegação padrão */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Navegação Padrão</h2>
        <MagicNavIndicator items={defaultItems} defaultActive="home" />
      </div>

      {/* Demo 2: Dashboard Navigation */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Navegação Dashboard</h2>
        <MagicNavIndicator items={dashboardItems} defaultActive="dashboard" />
      </div>

      {/* Demo 3: Com callbacks */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Com Callbacks</h2>
        <MagicNavIndicator
          items={defaultItems}
          defaultActive="home"
          onItemChange={(id) => {
            console.log("Item ativo mudou para:", id);
          }}
        />
      </div>
    </div>
  );
}

