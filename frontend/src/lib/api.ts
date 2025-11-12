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
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      clearTokens();
      
      // Redirecionar para login se não estiver em página de autenticação
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const isAuthPage = currentPath === "/login" || currentPath === "/register" || currentPath === "/forgot" || currentPath === "/forgot-password";
        
        if (!isAuthPage) {
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
