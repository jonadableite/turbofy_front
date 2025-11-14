import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from '@/app/(auth)/register/page';
import * as apiModule from '@/lib/api';

// Mocks
vi.mock('@/hooks/useRecaptcha', () => ({
  useRecaptcha: () => ({
    executeRecaptcha: vi.fn().mockResolvedValue('mock-token'),
    isReady: true,
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza formulário de cadastro', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cpf\/cnpj/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument();
  });

  it('envia cadastro com sucesso e chama API', async () => {
    const user = userEvent.setup();
    const spyApi = vi.spyOn(apiModule, 'api').mockResolvedValueOnce({
      accessToken: 'a', refreshToken: 'b', expiresIn: 3600,
    } as any);

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/nome completo/i), 'Usuário Teste');
    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/cpf\/cnpj/i), '123.456.789-09');
    await user.type(screen.getByLabelText(/^telefone/i), '(11) 99999-9999');
    await user.type(screen.getByLabelText(/^senha$/i), 'Str0ng#Password!');
    await user.type(screen.getByLabelText(/confirmar senha/i), 'Str0ng#Password!');

    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(spyApi).toHaveBeenCalledWith('/auth/register', expect.objectContaining({ method: 'POST' }));
    });
  });

  it('mostra erro amigável em falha de conexão', async () => {
    const user = userEvent.setup();
    vi.spyOn(apiModule, 'api').mockRejectedValueOnce(new apiModule.ApiException('Falha de conexão', 0));

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/nome completo/i), 'Usuário Teste');
    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/cpf\/cnpj/i), '123.456.789-09');
    await user.type(screen.getByLabelText(/^senha$/i), 'Str0ng#Password!');
    await user.type(screen.getByLabelText(/confirmar senha/i), 'Str0ng#Password!');
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(screen.getByText(/erro ao criar conta/i)).toBeInTheDocument();
    });
  });

  it('suporta conexão lenta e conclui cadastro', async () => {
    const user = userEvent.setup();
    const delayedResolve = new Promise((resolve) => setTimeout(() => resolve({
      accessToken: 'a', refreshToken: 'b', expiresIn: 3600,
    }), 300));
    vi.spyOn(apiModule, 'api').mockImplementationOnce(() => delayedResolve as any);

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/nome completo/i), 'Usuário Dev Lento');
    await user.type(screen.getByLabelText(/email/i), 'slow@example.com');
    await user.type(screen.getByLabelText(/cpf\/cnpj/i), '123.456.789-09');
    await user.type(screen.getByLabelText(/^senha$/i), 'Str0ng#Password!');
    await user.type(screen.getByLabelText(/confirmar senha/i), 'Str0ng#Password!');

    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    // Deve desabilitar botão durante submissão
    expect(screen.getByRole('button', { name: /criando conta/i })).toBeDisabled();
    await waitFor(() => {
      // Ao resolver, deve voltar ao estado normal (router.push é chamado internamente)
      expect(screen.getByRole('button', { name: /criar conta/i })).not.toBeDisabled();
    });
  });

  it('mapeia TypeError para mensagem de falha de conexão amigável', async () => {
    const user = userEvent.setup();
    vi.spyOn(apiModule, 'api').mockRejectedValueOnce(new TypeError('Failed to fetch'));

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/nome completo/i), 'Usuário Teste');
    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/cpf\/cnpj/i), '123.456.789-09');
    await user.type(screen.getByLabelText(/^senha$/i), 'Str0ng#Password!');
    await user.type(screen.getByLabelText(/confirmar senha/i), 'Str0ng#Password!');
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/falha de conexão com a api/i)
      ).toBeInTheDocument();
    });
  });
});