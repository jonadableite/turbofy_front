"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
  }>;
  period?: string;
  className?: string;
}

export const RevenueChart = ({
  data,
  period = "Última semana",
  className,
}: RevenueChartProps) => {
  const formatCurrency = (value: number) => {
    // Se o valor for muito grande (centavos), converter para reais
    const amount = value > 10000 ? value / 100 : value;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={cn(
        "rounded-xl border border-border/50 glass p-6 shadow-lg",
        className
      )}
    >
      <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/20 backdrop-blur-sm p-2 border border-primary/30">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Vendas dia a dia
          </h2>
        </div>
        <select className="rounded-md border border-border/50 glass px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
          <option>{period}</option>
          <option>Último mês</option>
          <option>Últimos 3 meses</option>
          <option>Último ano</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
            formatter={(value: number) => formatCurrency(value)}
            labelFormatter={(label) => `Data: ${formatDate(label)}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="hsl(142 71% 45%)"
            strokeWidth={3}
            dot={{ fill: "hsl(142 71% 45%)", r: 4 }}
            activeDot={{ r: 6 }}
            name="Vendas"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

