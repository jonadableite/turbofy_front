import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

describe('useRecaptcha', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('retorna isReady=true em dev quando lib indisponível', async () => {
    await vi.doMock('react-google-recaptcha-v3', () => ({
      useGoogleReCaptcha: () => ({ executeRecaptcha: undefined }),
    }));
    const { useRecaptcha } = await import('@/hooks/useRecaptcha');

    const { result } = renderHook(() => useRecaptcha());
    expect(result.current.isReady).toBe(true);
    const token = await result.current.executeRecaptcha('register');
    expect(token).toBe('');
  });

  it('executa recaptcha quando disponível', async () => {
    const exec = vi.fn().mockResolvedValue('token-xyz');
    await vi.doMock('react-google-recaptcha-v3', () => ({
      useGoogleReCaptcha: () => ({ executeRecaptcha: exec }),
    }));
    const { useRecaptcha } = await import('@/hooks/useRecaptcha');

    const { result } = renderHook(() => useRecaptcha());
    expect(result.current.isReady).toBe(true);
    const tok = await result.current.executeRecaptcha('register');
    expect(tok).toBe('token-xyz');
    expect(exec).toHaveBeenCalledWith('register');
  });
});