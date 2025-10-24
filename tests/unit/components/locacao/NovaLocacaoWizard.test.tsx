import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NovaLocacaoWizard } from '@/components/locacao/NovaLocacaoWizard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock do Next.js Router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
}));

// Mock do Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
        single: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 'test-id' }, error: null })),
        })),
      })),
    })),
  })),
}));

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

describe('NovaLocacaoWizard', () => {
  describe('Renderização', () => {
    it('deve renderizar o wizard com título correto', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <NovaLocacaoWizard />
        </Wrapper>
      );

      expect(screen.getByText(/Nova Locação/i)).toBeInTheDocument();
    });

    it('deve mostrar progress bar', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <NovaLocacaoWizard />
        </Wrapper>
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('deve mostrar os 5 steps', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <NovaLocacaoWizard />
        </Wrapper>
      );

      expect(screen.getByText(/Seleção de Imóvel/i)).toBeInTheDocument();
      expect(screen.getByText(/Dados do Locatário/i)).toBeInTheDocument();
      expect(screen.getByText(/Escolha de Garantia/i)).toBeInTheDocument();
      expect(screen.getByText(/Dados Financeiros/i)).toBeInTheDocument();
      expect(screen.getByText(/Preview e Confirmação/i)).toBeInTheDocument();
    });

    it('deve iniciar no step 0 (Seleção de Imóvel)', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <NovaLocacaoWizard />
        </Wrapper>
      );

      const step0 = screen.getByTestId('step-0');
      expect(step0).toHaveClass('active');
    });
  });

  describe('Navegação', () => {
    it('botão "Próximo" deve estar desabilitado inicialmente', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <NovaLocacaoWizard />
        </Wrapper>
      );

      const nextButton = screen.getByRole('button', { name: /próximo/i });
      expect(nextButton).toBeDisabled();
    });

    it('botão "Anterior" não deve aparecer no primeiro step', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <NovaLocacaoWizard />
        </Wrapper>
      );

      const prevButton = screen.queryByRole('button', { name: /anterior/i });
      expect(prevButton).not.toBeInTheDocument();
    });

    it('deve habilitar botão "Próximo" quando step estiver válido', async () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <NovaLocacaoWizard />
        </Wrapper>
      );

      // Simular seleção de imóvel
      const imovelCard = screen.getAllByTestId('imovel-card')[0];
      fireEvent.click(imovelCard);

      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /próximo/i });
        expect(nextButton).not.toBeDisabled();
      });
    });

    it('deve avançar para o próximo step ao clicar em "Próximo"', async () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <NovaLocacaoWizard />
        </Wrapper>
      );

      // Selecionar imóvel
      const imovelCard = screen.getAllByTestId('imovel-card')[0];
      fireEvent.click(imovelCard);

      // Clicar em próximo
      const nextButton = screen.getByRole('button', { name: /próximo/i });
      await waitFor(() => expect(nextButton).not.toBeDisabled());
      fireEvent.click(nextButton);

      // Verificar que está no step 1
      await waitFor(() => {
        const step1 = screen.getByTestId('step-1');
        expect(step1).toHaveClass('active');
      });
    });

    it('deve voltar para o step anterior ao clicar em "Anterior"', async () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <NovaLocacaoWizard />
        </Wrapper>
      );

      // Avançar para step 1
      const imovelCard = screen.getAllByTestId('imovel-card')[0];
      fireEvent.click(imovelCard);
      const nextButton = screen.getByRole('button', { name: /próximo/i });
      await waitFor(() => expect(nextButton).not.toBeDisabled());
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByTestId('step-1')).toHaveClass('active');
      });

      // Voltar para step 0
      const prevButton = screen.getByRole('button', { name: /anterior/i });
      fireEvent.click(prevButton);

      await waitFor(() => {
        expect(screen.getByTestId('step-0')).toHaveClass('active');
      });
    });

    it('deve permitir navegar clicando nos steps já visitados', async () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <NovaLocacaoWizard />
        </Wrapper>
      );

      // Ir para step 2
      const imovelCard = screen.getAllByTestId('imovel-card')[0];
      fireEvent.click(imovelCard);

      for (let i = 0; i < 2; i++) {
        const nextButton = screen.getByRole('button', { name: /próximo/i });
        await waitFor(() => expect(nextButton).not.toBeDisabled());
        fireEvent.click(nextButton);
      }

      // Clicar no step 0
      const step0Button = screen.getByText(/Seleção de Imóvel/i);
      fireEvent.click(step0Button);

      await waitFor(() => {
        expect(screen.getByTestId('step-0')).toHaveClass('active');
      });
    });
  });

  describe('Progress Bar', () => {
    it('deve mostrar 0% de progresso no step 0', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <NovaLocacaoWizard />
        </Wrapper>
      );

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    });

    it('deve mostrar 20% de progresso no step 1', async () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <NovaLocacaoWizard />
        </Wrapper>
      );

      // Ir para step 1
      const imovelCard = screen.getAllByTestId('imovel-card')[0];
      fireEvent.click(imovelCard);
      const nextButton = screen.getByRole('button', { name: /próximo/i });
      await waitFor(() => expect(nextButton).not.toBeDisabled());
      fireEvent.click(nextButton);

      await waitFor(() => {
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow', '20');
      });
    });

    it('deve mostrar 100% de progresso no último step', async () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <NovaLocacaoWizard />
        </Wrapper>
      );

      // Preencher todos os steps e ir para o último
      // ... (código simplificado para o teste)

      await waitFor(() => {
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow', '100');
      });
    });
  });

  describe('Validação de Steps', () => {
    it('não deve permitir avançar se step atual não estiver válido', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <NovaLocacaoWizard />
        </Wrapper>
      );

      const nextButton = screen.getByRole('button', { name: /próximo/i });
      expect(nextButton).toBeDisabled();
    });

    it('deve manter dados preenchidos ao voltar de step', async () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <NovaLocacaoWizard />
        </Wrapper>
      );

      // Selecionar imóvel
      const imovelCard = screen.getAllByTestId('imovel-card')[0];
      const imovelNome = imovelCard.querySelector('[data-testid="imovel-nome"]')?.textContent;
      fireEvent.click(imovelCard);

      // Avançar
      const nextButton = screen.getByRole('button', { name: /próximo/i });
      await waitFor(() => expect(nextButton).not.toBeDisabled());
      fireEvent.click(nextButton);

      // Voltar
      const prevButton = screen.getByRole('button', { name: /anterior/i });
      fireEvent.click(prevButton);

      // Verificar que imóvel ainda está selecionado
      await waitFor(() => {
        const selectedCard = screen.getByTestId('imovel-selecionado');
        expect(selectedCard).toHaveTextContent(imovelNome || '');
      });
    });
  });

  describe('Salvar Rascunho', () => {
    it('deve ter botão "Salvar Rascunho"', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <NovaLocacaoWizard />
        </Wrapper>
      );

      expect(screen.getByRole('button', { name: /salvar rascunho/i })).toBeInTheDocument();
    });

    it('deve salvar estado atual como rascunho', async () => {
      const Wrapper = createWrapper();
      const onSaveDraft = vi.fn();

      render(
        <Wrapper>
          <NovaLocacaoWizard onSaveDraft={onSaveDraft} />
        </Wrapper>
      );

      // Selecionar imóvel
      const imovelCard = screen.getAllByTestId('imovel-card')[0];
      fireEvent.click(imovelCard);

      // Salvar rascunho
      const saveButton = screen.getByRole('button', { name: /salvar rascunho/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(onSaveDraft).toHaveBeenCalledWith(
          expect.objectContaining({
            imovelSelecionado: expect.any(Object),
          })
        );
      });
    });
  });

  describe('Cancelar', () => {
    it('deve ter botão "Cancelar"', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <NovaLocacaoWizard />
        </Wrapper>
      );

      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    });

    it('deve chamar callback ao cancelar', () => {
      const Wrapper = createWrapper();
      const onCancel = vi.fn();

      render(
        <Wrapper>
          <NovaLocacaoWizard onCancel={onCancel} />
        </Wrapper>
      );

      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      fireEvent.click(cancelButton);

      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('Confirmação Final', () => {
    it('deve mostrar botão "Confirmar" no último step', async () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <NovaLocacaoWizard />
        </Wrapper>
      );

      // Navegar até o último step (simplificado)
      // ... código para preencher todos os steps

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument();
      });
    });

    it('deve chamar onCreate ao confirmar', async () => {
      const Wrapper = createWrapper();
      const onCreate = vi.fn();

      render(
        <Wrapper>
          <NovaLocacaoWizard onCreate={onCreate} />
        </Wrapper>
      );

      // Preencher todos os steps e confirmar
      // ... código simplificado

      await waitFor(() => {
        expect(onCreate).toHaveBeenCalled();
      });
    });
  });
});
