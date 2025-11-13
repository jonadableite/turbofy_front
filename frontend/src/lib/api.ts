import axios, { AxiosError } from "axios";
import { getAccessToken, getCsrfToken, clearTokens } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class ApiException extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiException";
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Para cookies HttpOnly
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para adicionar token de autenticação e CSRF
api.interceptors.request.use(
  (config) => {
    // Adicionar token de acesso se existir
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Adicionar token CSRF para requisições mutáveis
    const csrfToken = getCsrfToken();
    if (csrfToken && (config.method === "post" || config.method === "put" || config.method === "patch" || config.method === "delete")) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: { code?: string; message?: string } }>) => {
    // Apenas fazer logout em erro 401 e se não for uma requisição de autenticação
    if (error.response?.status === 401) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
      const isAuthPage = currentPath === "/login" || currentPath === "/register" || currentPath === "/forgot" || currentPath === "/forgot-password";
      const isAuthEndpoint = error.config?.url?.includes("/auth/login") || error.config?.url?.includes("/auth/register");
      
      // Não fazer logout se estiver em página de autenticação ou fazendo login/registro
      if (!isAuthPage && !isAuthEndpoint) {
        clearTokens();
        
        // Redirecionar para login apenas se não estiver em página de autenticação
        if (typeof window !== "undefined" && !isAuthPage) {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }

    // Criar exceção customizada
    const apiError = new ApiException(
      error.response?.data?.error?.message || error.message || "Erro na requisição",
      error.response?.status,
      error.response?.data?.error?.code
    );

    return Promise.reject(apiError);
  }
);

export default api;
