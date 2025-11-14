import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas públicas (acessíveis sem autenticação)
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/forgot",
  "/healthz",
  "/",
];

// Rotas protegidas (requerem autenticação)
const PROTECTED_ROUTES = [
  "/dashboard",
  "/vitrine",
  "/vendas",
  "/financeiro",
  "/clientes",
  "/afiliados",
  "/produtos",
  "/configuracoes",
  "/integracoes",
  "/profile",
];

// Verificar se a rota é pública
const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
};

// Verificar se a rota é protegida
const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
};

// Verificar token de autenticação via cookie
const hasValidAuth = (request: NextRequest): boolean => {
  // Verificar cookies HttpOnly (accessToken e refreshToken)
  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");

  // Se ambos os tokens existem, considerar autenticado
  // A validação real será feita no servidor quando necessário
  return Boolean(accessToken?.value && refreshToken?.value);
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir assets estáticos e arquivos de API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isAuthenticated = hasValidAuth(request);
  const isPublic = isPublicRoute(pathname);
  const isProtected = isProtectedRoute(pathname);

  // Se está tentando acessar rota protegida sem autenticação
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se está autenticado e tentando acessar página de autenticação
  if (isPublic && isAuthenticated && pathname !== "/") {
    // Redirecionar para dashboard se tentar acessar login/register quando já autenticado
    if (
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/forgot-password" ||
      pathname === "/forgot"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Adicionar headers de segurança
  const response = NextResponse.next();

  // Headers de segurança
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // CSP ajustado: permitir carregamento seguro de recursos externos necessários
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const isProduction = process.env.NODE_ENV === "production";
  
  // Em produção, permitir conexões com o domínio da API
  const connectSrc = isProduction && apiUrl.startsWith("https://")
    ? `'self' ${apiUrl} https://www.google.com https://static.cloudflareinsights.com`
    : "'self' http://localhost:3000 ws://localhost:3001 https://www.google.com https://static.cloudflareinsights.com";
  
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      // Scripts: permitir Google, Cloudflare Insights e scripts inline necessários
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://static.cloudflareinsights.com",
      // Scripts de elementos: mesma política para elementos <script>
      "script-src-elem 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://static.cloudflareinsights.com",
      // Estilos: permitir CSS inline e de fontes externas
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Estilos de elementos: mesma política para elementos <style>
      "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Imagens: locais, data URIs e HTTPS
      "img-src 'self' data: https:",
      // Fontes: permitir self, data URIs e gstatic (Google Fonts)
      "font-src 'self' data: https://fonts.gstatic.com",
      // Conexões: backend configurado via variável de ambiente e Cloudflare
      `connect-src ${connectSrc}`,
    ].join("; ")
  );

  return response;
}

// Configurar quais rotas o middleware deve executar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
