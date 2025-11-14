import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ErrorBoundary } from "@/components/error-boundary";
import { InteractiveCursor } from "@/components/ui/interactive-cursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Turbofy — Gateway de Pagamentos",
    template: "%s | Turbofy",
  },
  description: "Speed, security e compliance. PCI‑DSS & LGPD, suporte a PIX & Boleto.",
  applicationName: "Turbofy",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Turbofy — Gateway de Pagamentos",
    description: "Pagamentos em milissegundos com segurança e conformidade.",
    url: "/",
    siteName: "Turbofy",
    images: ["/next.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Turbofy — Gateway de Pagamentos",
    description: "Pagamentos em milissegundos com segurança e conformidade.",
    images: ["/next.svg"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
  keywords: ["gateway", "pagamentos", "PIX", "boleto", "PCI-DSS", "LGPD"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0b0b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ cursor: "none" }}
      >
        <ErrorBoundary>
          <ScrollProgress />
          <InteractiveCursor />
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
