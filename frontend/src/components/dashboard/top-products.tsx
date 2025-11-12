"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  category: string;
  revenue: number;
  icon?: React.ReactNode;
}

interface TopProductsProps {
  products: Product[];
  className?: string;
}

export const TopProducts = ({ products, className }: TopProductsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-lg",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg bg-primary/10 p-2">
          <Package className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Produtos Mais Vendidos
        </h2>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              {product.icon || (
                <div className="rounded-lg bg-primary/10 p-2">
                  <Package className="h-4 w-4 text-primary" />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {product.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {product.category}
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-primary">
              {formatCurrency(product.revenue)}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

