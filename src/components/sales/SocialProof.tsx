"use client";

import Image from "next/image";

export const SocialProof = () => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="flex items-center gap-2 rounded-full bg-background/80 backdrop-blur-lg px-4 py-2 border border-border/50 shadow-lg">
        <div className="flex -space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 border-2 border-background flex items-center justify-center text-xs font-bold">
            J
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 border-2 border-background flex items-center justify-center text-xs font-bold">
            M
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-400 border-2 border-background flex items-center justify-center text-xs font-bold">
            A
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 border-2 border-background flex items-center justify-center text-xs font-bold">
            R
          </div>
        </div>
        <span className="text-sm font-medium text-foreground">
          | Mais de <strong className="text-primary">30.100 usuários</strong> já usaram Turbofy
        </span>
      </div>
    </div>
  );
};

