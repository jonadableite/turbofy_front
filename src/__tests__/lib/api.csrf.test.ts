import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api } from '@/lib/api';

describe('API CSRF e fallback', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8080';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('faz fallback de CSRF e inclui header ao postar', async () => {
    const fetchMock = vi.fn()
      // 1) CSRF 8080 falha (network)
      .mockRejectedValueOnce(new Error('ECONNREFUSED'))
      // 2) CSRF 3000 sucesso
      .mockResolvedValueOnce(new Response(JSON.stringify({ csrfToken: 'csrf-123' }), { status: 200 }))
      // 3) POST 8080 falha
      .mockRejectedValueOnce(new Error('ECONNREFUSED'))
      // 4) POST 3000 sucesso
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    vi.stubGlobal('fetch', fetchMock as any);

    const res = await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'user@example.com' }),
    });

    expect(res).toEqual({ ok: true });

    // Verifica que o fallback foi usado (chamado 4 vezes)
    expect(fetchMock).toHaveBeenCalledTimes(4);

    // A segunda chamada deve ser para /api/auth/csrf em 3000
    const csrfFallbackCall = fetchMock.mock.calls[1][0] as string;
    expect(csrfFallbackCall).toContain('http://localhost:3000/api/auth/csrf');

    // A quarta chamada deve ser o POST em 3000 e conter X-CSRF-Token
    const postFallbackArgs = fetchMock.mock.calls[3][1];
    expect(postFallbackArgs?.headers['X-CSRF-Token']).toBe('csrf-123');
    expect(postFallbackArgs?.credentials).toBe('include');
  });
});