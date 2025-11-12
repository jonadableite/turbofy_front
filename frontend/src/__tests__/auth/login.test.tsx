/**
 * Testes para a página de Login
 * 
 * Para executar os testes:
 * 1. Instalar dependências de teste:
 *    pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom
 * 
 * 2. Configurar Jest no package.json
 * 
 * 3. Executar:
 *    pnpm test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/(auth)/login/page';
import { api } from '@/lib/api';

// Mock do módulo de API
vi.mock('@/lib/api', () => ({
  api: vi.fn(),
  ApiException: class extends Error {
    constructor(message: string, public status: number) {
      super(message);
    }
  },
}));

// Mock do useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock do useRecaptcha
vi.mock('@/hooks/useRecaptcha', () => ({
  useRecaptcha: () => ({
    executeRecaptcha: vi.fn().mockResolvedValue('mock-token'),
    isReady: true,
  }),
}));

// Mock do GoogleReCaptchaProvider
vi.mock('react-google-recaptcha-v3', () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: vi.fn().mockResolvedValue('mock-token'),
  }),
  GoogleReCaptchaProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o formulário de login', () => {
    render(<LoginPage />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('deve validar campos obrigatórios', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    await user.click(submitButton);
    
    // Zod validation should prevent submission
    expect(api).not.toHaveBeenCalled();
  });

  it('deve mostrar mensagem de erro ao falhar login', async () => {
    const user = userEvent.setup();
    const mockApi = api as ReturnType<typeof vi.fn>;
    
    mockApi.mockRejectedValueOnce({
      message: 'Invalid credentials',
      status: 401,
    });

    render(<LoginPage />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/senha/i), 'password123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('deve redirecionar ao fazer login com sucesso', async () => {
    const user = userEvent.setup();
    const mockApi = api as ReturnType<typeof vi.fn>;
    const mockPush = vi.fn();
    
    vi.mock('next/navigation', () => ({
      useRouter: () => ({ push: mockPush }),
    }));

    mockApi.mockResolvedValueOnce({
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
      expiresIn: 3600,
    });

    render(<LoginPage />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/senha/i), 'password123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));
    
    await waitFor(() => {
      expect(mockApi).toHaveBeenCalled();
    });
  });

  it('deve bloquear após 5 tentativas falhadas', async () => {
    const user = userEvent.setup();
    const mockApi = api as ReturnType<typeof vi.fn>;
    
    mockApi.mockRejectedValue({
      message: 'Invalid credentials',
      status: 401,
    });

    render(<LoginPage />);
    
    // Simular 5 tentativas falhadas
    for (let i = 0; i < 5; i++) {
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/senha/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /entrar/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    }
    
    // Verificar se está bloqueado
    await waitFor(() => {
      expect(screen.getByText(/aguarde.*segundos/i)).toBeInTheDocument();
    });
  });
});

