import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'standalone',
  // Configurar Turbopack com root explícito para monorepo
  turbopack: {
    root: resolve(process.cwd()),
  },
};

export default nextConfig;
