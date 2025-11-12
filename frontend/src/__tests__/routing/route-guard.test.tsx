/**
 * Testes do componente RouteGuard
 */

import { render, screen } from "@testing-library/react";
import { RouteGuard } from "@/components/routing/route-guard";
import { AuthProvider } from "@/contexts/auth-context";
import api from "@/lib/api";

jest.mock("@/lib/api");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/dashboard",
}));

const mockApi = api as jest.Mocked<typeof api>;

describe("RouteGuard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it("deve mostrar loading enquanto verifica autenticação", () => {
    mockApi.get.mockImplementation(() => new Promise(() => {})); // Nunca resolve

    render(
      <AuthProvider>
        <RouteGuard requireAuth>
          <div>Conteúdo Protegido</div>
        </RouteGuard>
      </AuthProvider>
    );

    expect(screen.getByText("Verificando autenticação...")).toBeInTheDocument();
  });

  it("deve renderizar conteúdo quando autenticado e requireAuth=true", async () => {
    sessionStorage.setItem(
      "turbofy:accessToken",
      JSON.stringify({
        token: "valid-token",
        expiresAt: Date.now() + 900000,
      })
    );

    mockApi.get.mockResolvedValueOnce({
      data: {
        id: "user-id",
        email: "user@example.com",
        roles: ["USER"],
      },
    } as never);

    render(
      <AuthProvider>
        <RouteGuard requireAuth>
          <div>Conteúdo Protegido</div>
        </RouteGuard>
      </AuthProvider>
    );

    // Aguardar autenticação
    await screen.findByText("Conteúdo Protegido", {}, { timeout: 3000 });
  });

  it("deve redirecionar quando não autenticado e requireAuth=true", () => {
    const mockPush = jest.fn();
    jest.mock("next/navigation", () => ({
      useRouter: () => ({ push: mockPush }),
      usePathname: () => "/dashboard",
    }));

    render(
      <AuthProvider>
        <RouteGuard requireAuth>
          <div>Conteúdo Protegido</div>
        </RouteGuard>
      </AuthProvider>
    );

    // Deve redirecionar para login
    expect(mockPush).toHaveBeenCalled();
  });
});

