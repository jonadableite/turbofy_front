"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/api";
import {
  isTokenValid,
  clearTokens,
  updateLastActivity,
  checkInactivity,
  validateToken,
  setAccessToken,
  setCsrfToken,
} from "@/lib/auth";

interface AuthenticatedUser {
  id: string;
  email: string;
  roles: string[];
  name?: string;
}

interface AuthContextType {
  user: AuthenticatedUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INACTIVITY_CHECK_INTERVAL = 60000; // 1 minuto
const TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutos

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const inactivityCheckRef = useRef<NodeJS.Timeout | null>(null);
  const tokenRefreshRef = useRef<NodeJS.Timeout | null>(null);

  // Verificar autenticação inicial
  const checkAuth = useCallback(async () => {
    if (!isTokenValid()) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // Validar token no servidor
      const isValid = await validateToken();
      if (!isValid) {
        clearTokens();
        setUser(null);
        setLoading(false);
        return;
      }

      // Buscar dados do usuário
      const response = await api.get<AuthenticatedUser>("/auth/me");
      setUser(response.data);
      setError(null);
    } catch {
      clearTokens();
      setUser(null);
      setError("Sessão expirada. Faça login novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Obter token CSRF primeiro
      const csrfResponse = await api.get<{ csrfToken: string }>("/api/auth/csrf");
      const csrfToken = csrfResponse.data.csrfToken;
      setCsrfToken(csrfToken);

      // Fazer login (tokens serão armazenados em cookies HttpOnly pelo servidor)
      const response = await api.post<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      }>("/auth/login", {
        email,
        password,
      }, {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });

      const { accessToken, expiresIn } = response.data;

      // Armazenar token no sessionStorage para validação no cliente
      // O servidor já armazenou em cookies HttpOnly
      setAccessToken(accessToken, expiresIn);
      updateLastActivity();

      // Buscar dados do usuário
      await checkAuth();

      // Redirecionar para dashboard ou rota original
      const redirectUrl = new URLSearchParams(window.location.search).get("redirect") || "/dashboard";
      router.push(redirectUrl);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { error?: { message?: string } } } };
      setError(apiError.response?.data?.error?.message || "Erro ao fazer login");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router, checkAuth]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignorar erros no logout
    } finally {
      clearTokens();
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!isTokenValid()) {
      setUser(null);
      return;
    }

    try {
      const response = await api.get<AuthenticatedUser>("/auth/me");
      setUser(response.data);
      updateLastActivity();
    } catch {
      // Se falhar, fazer logout
      await logout();
    }
  }, [logout]);

  // Verificar inatividade
  useEffect(() => {
    const checkInactivityPeriodically = () => {
      if (checkInactivity() && user) {
        logout();
      }
    };

    inactivityCheckRef.current = setInterval(checkInactivityPeriodically, INACTIVITY_CHECK_INTERVAL);

    // Atualizar atividade em eventos do usuário
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    const updateActivity = () => {
      if (user) {
        updateLastActivity();
      }
    };

    events.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });

    return () => {
      if (inactivityCheckRef.current) {
        clearInterval(inactivityCheckRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [user, logout]);

  // Refresh token periodicamente
  useEffect(() => {
    if (!user) return;

    const refreshTokenPeriodically = async () => {
      if (!isTokenValid()) {
        await logout();
        return;
      }

      try {
        await refreshUser();
      } catch {
        // Ignorar erros silenciosamente
      }
    };

    tokenRefreshRef.current = setInterval(refreshTokenPeriodically, TOKEN_REFRESH_INTERVAL);

    return () => {
      if (tokenRefreshRef.current) {
        clearInterval(tokenRefreshRef.current);
      }
    };
  }, [user, refreshUser, logout]);

  // Verificar autenticação inicial
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Proteger rotas no cliente (comentado - RouteGuard já faz isso)
  // useEffect(() => {
  //   if (loading) return;

  //   const isPublicRoute = pathname === "/login" || pathname === "/register" || pathname === "/forgot" || pathname === "/forgot-password" || pathname === "/";
  //   const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/vitrine") || pathname.startsWith("/vendas") || pathname.startsWith("/financeiro") || pathname.startsWith("/clientes") || pathname.startsWith("/afiliados") || pathname.startsWith("/produtos") || pathname.startsWith("/configuracoes") || pathname.startsWith("/integracoes") || pathname.startsWith("/profile");

  //   if (isProtectedRoute && !user) {
  //     router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
  //   } else if (isPublicRoute && user && pathname !== "/") {
  //     router.push("/dashboard");
  //   }
  // }, [user, loading, pathname, router]);

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};

