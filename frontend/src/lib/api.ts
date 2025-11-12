/**
 * API client com suporte a CSRF tokens e credentials
 */

export interface ApiError {
  message: string;
  issues?: Array<{ path: string[]; message: string }>;
}

export class ApiException extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly issues?: Array<{ path: string[]; message: string }>
  ) {
    super(message);
    this.name = "ApiException";
  }
}

let csrfToken: string | null = null;

/**
 * Busca o CSRF token do backend
 */
async function fetchCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/auth/csrf`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      console.warn("Failed to fetch CSRF token, continuing without it");
      return "";
    }

    const data = await response.json();
    csrfToken = data.csrfToken || "";
    return csrfToken || "";
  } catch (error) {
    console.warn("Error fetching CSRF token:", error);
    return "";
  }
}

/**
 * Cliente API type-safe com suporte a CSRF e HttpOnly cookies
 */
export async function api<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // Buscar CSRF token se for método mutável
  const needsCsrf = ["POST", "PUT", "PATCH", "DELETE"].includes(
    options.method?.toUpperCase() || "GET"
  );

  const csrf = needsCsrf ? await fetchCsrfToken() : "";

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(csrf && { "X-CSRF-Token": csrf }),
    ...(options.headers || {}),
  };

  const fullUrl = url.startsWith("http")
    ? url
    : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${url}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers,
    credentials: "include", // Necessário para HttpOnly cookies
  });

  if (!response.ok) {
    let errorMessage = "Erro inesperado";
    let errorIssues: Array<{ path: string[]; message: string }> | undefined;

    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
      errorIssues = errorData.issues;
    } catch {
      // Se não conseguir parsear JSON, usar mensagem padrão
    }

    throw new ApiException(errorMessage, response.status, errorIssues);
  }

  // Se for 204 No Content, não tentar parsear JSON
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * Invalida o CSRF token (útil após logout)
 */
export function invalidateCsrfToken(): void {
  csrfToken = null;
}
