"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";

interface AuthenticatedUser {
  id: string;
  email: string;
  roles: string[];
  name?: string;
}

interface UseAuthState {
  user: AuthenticatedUser | null;
  loading: boolean;
  error: string | null;
}

const CACHE_KEY = "turbofy:user";
const REFRESH_INTERVAL_MS = 30_000; // 30s

export const useAuth = (): UseAuthState => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchUser = async () => {
    try {
      setError(null);
      const response = await api.get<AuthenticatedUser>("/auth/me");
      const data = response.data;
      setUser(data);
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch {
        /* ignore storage errors */
      }
    } catch (err: unknown) {
      setError(
        (err as { message?: string }).message || "Falha ao carregar usuário"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Warm cache from sessionStorage
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as AuthenticatedUser;
        setUser(parsed);
        setLoading(false);
      }
    } catch {
      /* ignore */
    }

    // Initial fetch
    fetchUser();

    // Refresh interval for near real-time updates
    intervalRef.current = setInterval(fetchUser, REFRESH_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, loading, error };
};