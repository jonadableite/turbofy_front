/**
 * Utilitários de autenticação e segurança
 * Gerencia tokens, validação e proteção CSRF
 */

const TOKEN_KEY = "turbofy:accessToken";
const REFRESH_TOKEN_KEY = "turbofy:refreshToken";
const CSRF_TOKEN_KEY = "turbofy:csrfToken";
const LAST_ACTIVITY_KEY = "turbofy:lastActivity";
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutos

interface TokenData {
  token: string;
  expiresAt: number;
}

/**
 * Armazenar token de acesso de forma segura
 */
export const setAccessToken = (token: string, expiresIn: number): void => {
  if (typeof window === "undefined") return;

  const expiresAt = Date.now() + expiresIn * 1000;
  const tokenData: TokenData = { token, expiresAt };

  try {
    // Armazenar em sessionStorage (mais seguro que localStorage)
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
    updateLastActivity();
  } catch (error) {
    console.error("Erro ao armazenar token:", error);
  }
};

/**
 * Obter token de acesso
 */
export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (!stored) return null;

    const tokenData: TokenData = JSON.parse(stored);

    // Verificar se o token expirou
    if (Date.now() >= tokenData.expiresAt) {
      clearTokens();
      return null;
    }

    return tokenData.token;
  } catch {
    return null;
  }
};

/**
 * Verificar se o token é válido
 */
export const isTokenValid = (): boolean => {
  return getAccessToken() !== null;
};

/**
 * Limpar todos os tokens
 */
export const clearTokens = (): void => {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(CSRF_TOKEN_KEY);
    sessionStorage.removeItem(LAST_ACTIVITY_KEY);
  } catch (error) {
    console.error("Erro ao limpar tokens:", error);
  }
};

/**
 * Armazenar token CSRF
 */
export const setCsrfToken = (token: string): void => {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  } catch (error) {
    console.error("Erro ao armazenar CSRF token:", error);
  }
};

/**
 * Buscar token CSRF do servidor
 */
export const fetchCsrfToken = async (): Promise<string | null> => {
  try {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${API_BASE_URL}/api/auth/csrf`, {
      credentials: "include",
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { csrfToken: string };
    setCsrfToken(data.csrfToken);
    return data.csrfToken;
  } catch {
    return null;
  }
};

/**
 * Obter token CSRF
 */
export const getCsrfToken = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    return sessionStorage.getItem(CSRF_TOKEN_KEY);
  } catch {
    return null;
  }
};

/**
 * Atualizar última atividade do usuário
 */
export const updateLastActivity = (): void => {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  } catch {
    // Ignorar erros de storage
  }
};

/**
 * Verificar se o usuário está inativo há muito tempo
 */
export const checkInactivity = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const lastActivity = sessionStorage.getItem(LAST_ACTIVITY_KEY);
    if (!lastActivity) return false;

    const lastActivityTime = parseInt(lastActivity, 10);
    const now = Date.now();
    const inactiveTime = now - lastActivityTime;

    return inactiveTime > INACTIVITY_TIMEOUT_MS;
  } catch {
    return false;
  }
};

/**
 * Validar token no servidor
 */
export const validateToken = async (): Promise<boolean> => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    return response.ok;
  } catch {
    return false;
  }
};
