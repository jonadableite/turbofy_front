/**
 * Testes do contexto de autenticação
 */

import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";

// Mock do api
jest.mock("@/lib/api");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/dashboard",
}));

const mockApi = api as jest.Mocked<typeof api>;

describe("AuthContext", () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    // Limpar sessionStorage
    sessionStorage.clear();
  });

  describe("Login", () => {
    it("deve fazer login com sucesso", async () => {
      mockApi.get.mockResolvedValueOnce({
        data: { csrfToken: "csrf-token" },
      } as never);

      mockApi.post.mockResolvedValueOnce({
        data: {
          accessToken: "access-token",
          refreshToken: "refresh-token",
          expiresIn: 900,
        },
      } as never);

      mockApi.get.mockResolvedValueOnce({
        data: {
          id: "user-id",
          email: "user@example.com",
          roles: ["USER"],
        },
      } as never);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.login("user@example.com", "password123");

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user?.email).toBe("user@example.com");
      });
    });

    it("deve tratar erro de login", async () => {
      mockApi.get.mockResolvedValueOnce({
        data: { csrfToken: "csrf-token" },
      } as never);

      mockApi.post.mockRejectedValueOnce({
        response: {
          data: {
            error: {
              message: "Credenciais inválidas",
            },
          },
        },
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        result.current.login("user@example.com", "wrong-password")
      ).rejects.toBeDefined();

      expect(result.current.error).toBeTruthy();
    });
  });

  describe("Logout", () => {
    it("deve fazer logout com sucesso", async () => {
      mockApi.post.mockResolvedValueOnce({} as never);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await result.current.logout();

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
      });
    });
  });

  describe("Verificação de Autenticação", () => {
    it("deve verificar autenticação inicial", async () => {
      // Simular token válido
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

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});

