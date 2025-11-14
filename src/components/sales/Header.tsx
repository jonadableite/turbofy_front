"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Header({ className }: { className?: string }) {
  return (
    <header className={cn("w-full sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border", className)}>
      <nav className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between" role="navigation" aria-label="Principal">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <Image src="/next.svg" alt="Turbofy" width={28} height={28} priority />
          <span className="text-sm font-semibold">Turbofy</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="#recursos" className="text-sm hover:text-primary focus-visible:ring-2 focus-visible:ring-primary">Recursos</Link>
          <Link href="#beneficios" className="text-sm hover:text-primary focus-visible:ring-2 focus-visible:ring-primary">Benefícios</Link>
          <Link href="#depoimentos" className="text-sm hover:text-primary focus-visible:ring-2 focus-visible:ring-primary">Depoimentos</Link>
          <Link href="/register" className="inline-flex h-9 px-4 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary" aria-label="Comece agora">Comece Grátis</Link>
        </div>
      </nav>
    </header>
  );
}

