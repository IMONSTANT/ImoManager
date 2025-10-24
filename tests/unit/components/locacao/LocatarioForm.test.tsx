import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocatarioForm } from '@/components/locacao/LocatarioForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('LocatarioForm', () => {
  describe('Renderização', () => {
    it('deve renderizar opções novo/existente', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByLabelText(/novo locatário/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/locatário existente/i)).toBeInTheDocument();
    });

    it('deve iniciar com "novo locatário" selecionado', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      const novoRadio = screen.getByLabelText(/novo locatário/i) as HTMLInputElement;
      expect(novoRadio.checked).toBe(true);
    });
  });

  describe('Formulário Novo Locatário', () => {
    it('deve exibir todos os campos obrigatórios', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cpf\/cnpj/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    });

    it('deve exibir campos de endereço', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByLabelText(/logradouro/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/número/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/bairro/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cidade/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/uf/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cep/i)).toBeInTheDocument();
    });

    it('deve validar nome mínimo', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      const nomeInput = screen.getByLabelText(/nome completo/i);
      await user.type(nomeInput, 'Jo');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/nome deve ter no mínimo 3 caracteres/i)).toBeInTheDocument();
      });
    });

    it('deve validar CPF inválido', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      const cpfInput = screen.getByLabelText(/cpf\/cnpj/i);
      await user.type(cpfInput, '111.111.111-11');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/cpf\/cnpj inválido/i)).toBeInTheDocument();
      });
    });

    it('deve aceitar CPF válido', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      const cpfInput = screen.getByLabelText(/cpf\/cnpj/i);
      await user.type(cpfInput, '123.456.789-09'); // CPF válido (formato)
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/cpf\/cnpj inválido/i)).not.toBeInTheDocument();
      });
    });

    it('deve validar email', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'email-invalido');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
      });
    });

    it('deve aplicar máscara de telefone', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      const telefoneInput = screen.getByLabelText(/telefone/i);
      await user.type(telefoneInput, '11987654321');

      await waitFor(() => {
        expect(telefoneInput).toHaveValue('(11) 98765-4321');
      });
    });

    it('deve validar CEP', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      const cepInput = screen.getByLabelText(/cep/i);
      await user.type(cepInput, '123');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/cep inválido/i)).toBeInTheDocument();
      });
    });

    it('deve ter seção de upload de documentos', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText(/documentos/i)).toBeInTheDocument();
      expect(screen.getByText(/pelo menos 1 documento é obrigatório/i)).toBeInTheDocument();
    });

    it('deve permitir upload de documentos', async () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      const file = new File(['dummy'], 'documento.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/adicionar documento/i);

      await waitFor(() => {
        fireEvent.change(input, { target: { files: [file] } });
      });

      await waitFor(() => {
        expect(screen.getByText('documento.pdf')).toBeInTheDocument();
      });
    });

    it('deve permitir remover documentos', async () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      const file = new File(['dummy'], 'documento.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/adicionar documento/i);

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('documento.pdf')).toBeInTheDocument();
      });

      const removeButton = screen.getByRole('button', { name: /remover documento/i });
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(screen.queryByText('documento.pdf')).not.toBeInTheDocument();
      });
    });
  });

  describe('Formulário Locatário Existente', () => {
    it('deve exibir autocomplete ao selecionar existente', async () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      const existenteRadio = screen.getByLabelText(/locatário existente/i);
      fireEvent.click(existenteRadio);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/buscar por nome ou cpf/i)).toBeInTheDocument();
      });
    });

    it('deve buscar locatários existentes', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      // Mock de locatários existentes
      vi.mock('@/lib/supabase/client', () => ({
        createClient: vi.fn(() => ({
          from: vi.fn(() => ({
            select: vi.fn(() => ({
              ilike: vi.fn(() => ({
                data: [
                  {
                    id: '1',
                    nome: 'João Silva',
                    cpf_cnpj: '123.456.789-00',
                    email: 'joao@email.com',
                    telefone: '(11) 98765-4321',
                  },
                ],
                error: null,
              })),
            })),
          })),
        })),
      }));

      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      const existenteRadio = screen.getByLabelText(/locatário existente/i);
      fireEvent.click(existenteRadio);

      const searchInput = await screen.findByPlaceholderText(/buscar por nome ou cpf/i);
      await user.type(searchInput, 'João');

      await waitFor(() => {
        expect(screen.getByText('João Silva')).toBeInTheDocument();
      });
    });

    it('deve preencher dados ao selecionar locatário', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      const existenteRadio = screen.getByLabelText(/locatário existente/i);
      fireEvent.click(existenteRadio);

      const searchInput = await screen.findByPlaceholderText(/buscar por nome ou cpf/i);
      await user.type(searchInput, 'João');

      await waitFor(() => {
        const option = screen.getByText('João Silva');
        fireEvent.click(option);
      });

      await waitFor(() => {
        expect(screen.getByText('123.456.789-00')).toBeInTheDocument();
        expect(screen.getByText('joao@email.com')).toBeInTheDocument();
      });
    });
  });

  describe('Submissão', () => {
    it('deve chamar onSubmit com dados válidos', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <LocatarioForm onSubmit={onSubmit} />
        </Wrapper>
      );

      // Preencher formulário
      await user.type(screen.getByLabelText(/nome completo/i), 'João Silva');
      await user.type(screen.getByLabelText(/cpf\/cnpj/i), '123.456.789-09');
      await user.type(screen.getByLabelText(/email/i), 'joao@email.com');
      await user.type(screen.getByLabelText(/telefone/i), '11987654321');
      await user.type(screen.getByLabelText(/logradouro/i), 'Rua A');
      await user.type(screen.getByLabelText(/número/i), '100');
      await user.type(screen.getByLabelText(/bairro/i), 'Centro');
      await user.type(screen.getByLabelText(/cidade/i), 'São Paulo');
      await user.type(screen.getByLabelText(/uf/i), 'SP');
      await user.type(screen.getByLabelText(/cep/i), '01000-000');

      // Upload documento
      const file = new File(['dummy'], 'documento.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/adicionar documento/i);
      fireEvent.change(input, { target: { files: [file] } });

      // Submeter
      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            tipo: 'novo',
            dados: expect.objectContaining({
              nome: 'João Silva',
              email: 'joao@email.com',
            }),
          })
        );
      });
    });

    it('não deve submeter com dados inválidos', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <LocatarioForm onSubmit={onSubmit} />
        </Wrapper>
      );

      // Preencher parcialmente
      await user.type(screen.getByLabelText(/nome completo/i), 'Jo'); // muito curto

      // Tentar submeter
      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).not.toHaveBeenCalled();
        expect(screen.getByText(/nome deve ter no mínimo 3 caracteres/i)).toBeInTheDocument();
      });
    });
  });

  describe('Campos Opcionais', () => {
    it('deve exibir campos opcionais para pessoa física', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByLabelText(/profissão/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/renda mensal/i)).toBeInTheDocument();
    });

    it('deve formatar renda mensal como moeda', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      const rendaInput = screen.getByLabelText(/renda mensal/i);
      await user.type(rendaInput, '5000');

      await waitFor(() => {
        expect(rendaInput).toHaveValue('R$ 5.000,00');
      });
    });
  });

  describe('Validação de CNPJ', () => {
    it('deve validar CNPJ inválido', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      const cpfCnpjInput = screen.getByLabelText(/cpf\/cnpj/i);
      await user.type(cpfCnpjInput, '11.111.111/1111-11');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/cpf\/cnpj inválido/i)).toBeInTheDocument();
      });
    });

    it('deve aceitar CNPJ válido', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <LocatarioForm onSubmit={vi.fn()} />
        </Wrapper>
      );

      const cpfCnpjInput = screen.getByLabelText(/cpf\/cnpj/i);
      await user.type(cpfCnpjInput, '11.222.333/0001-81'); // CNPJ válido (formato)
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/cpf\/cnpj inválido/i)).not.toBeInTheDocument();
      });
    });
  });
});
