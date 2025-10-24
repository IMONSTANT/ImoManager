import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContratoPreview } from '@/components/locacao/ContratoPreview';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockDados = {
  imovelSelecionado: {
    id: 'imovel-1',
    codigo_interno: 'AP001',
    tipo_imovel: 'Apartamento',
    endereco: {
      logradouro: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01000-000',
    },
    valor_aluguel: 1500,
  },
  locatario: {
    tipo: 'novo' as const,
    dados: {
      tipo_pessoa: 'fisica' as const,
      nome: 'João Silva',
      cpf_cnpj: '123.456.789-00',
      email: 'joao@email.com',
      telefone: '(11) 98765-4321',
      endereco: {
        logradouro: 'Rua A',
        numero: '100',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP',
        cep: '01000-000',
      },
      documentos: [],
    },
  },
  garantia: {
    tipo: 'caucao' as const,
    valor: 4500,
  },
  dadosFinanceiros: {
    valor_aluguel: 1500,
    valor_iptu: 100,
    valor_condominio: 300,
    dia_vencimento: 10,
    indice_reajuste: 'IGPM' as const,
    data_inicio: new Date('2025-11-01'),
    duracao_meses: 12,
  },
};

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

describe('ContratoPreview', () => {
  describe('Renderização', () => {
    it('deve renderizar título', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText(/preview do contrato/i)).toBeInTheDocument();
    });

    it('deve exibir todas as seções', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText(/dados do imóvel/i)).toBeInTheDocument();
      expect(screen.getByText(/dados do locatário/i)).toBeInTheDocument();
      expect(screen.getByText(/garantia/i)).toBeInTheDocument();
      expect(screen.getByText(/dados financeiros/i)).toBeInTheDocument();
    });
  });

  describe('Dados do Imóvel', () => {
    it('deve exibir código interno', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText('AP001')).toBeInTheDocument();
    });

    it('deve exibir tipo do imóvel', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText('Apartamento')).toBeInTheDocument();
    });

    it('deve exibir endereço completo', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText(/rua das flores, 123/i)).toBeInTheDocument();
      expect(screen.getByText(/centro - são paulo\/sp/i)).toBeInTheDocument();
      expect(screen.getByText(/01000-000/i)).toBeInTheDocument();
    });

    it('deve exibir valor do aluguel', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText(/r\$ 1\.500,00/i)).toBeInTheDocument();
    });
  });

  describe('Dados do Locatário', () => {
    it('deve exibir nome do locatário', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    it('deve exibir CPF/CNPJ', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText('123.456.789-00')).toBeInTheDocument();
    });

    it('deve exibir email e telefone', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText('joao@email.com')).toBeInTheDocument();
      expect(screen.getByText('(11) 98765-4321')).toBeInTheDocument();
    });

    it('deve exibir endereço do locatário', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText(/rua a, 100/i)).toBeInTheDocument();
    });
  });

  describe('Garantia - Caução', () => {
    it('deve exibir tipo de garantia', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText(/caução/i)).toBeInTheDocument();
    });

    it('deve exibir valor da caução', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText(/r\$ 4\.500,00/i)).toBeInTheDocument();
    });
  });

  describe('Garantia - Fiador', () => {
    it('deve exibir dados do fiador quando selecionado', () => {
      const Wrapper = createWrapper();
      const dadosComFiador = {
        ...mockDados,
        garantia: {
          tipo: 'fiador' as const,
          fiador: {
            nome: 'Maria Silva',
            cpf: '987.654.321-00',
            email: 'maria@email.com',
            telefone: '(11) 91234-5678',
            profissao: 'Advogada',
            renda_mensal: 8000,
            endereco: {
              logradouro: 'Av. Principal',
              numero: '500',
              bairro: 'Jardins',
              cidade: 'São Paulo',
              uf: 'SP',
              cep: '01000-100',
            },
            documentos: [],
          },
        },
      };

      render(
        <Wrapper>
          <ContratoPreview dados={dadosComFiador} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText(/fiador/i)).toBeInTheDocument();
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
      expect(screen.getByText('987.654.321-00')).toBeInTheDocument();
      expect(screen.getByText('Advogada')).toBeInTheDocument();
    });
  });

  describe('Dados Financeiros', () => {
    it('deve exibir breakdown de valores', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText(/aluguel:/i)).toBeInTheDocument();
      expect(screen.getByText(/iptu:/i)).toBeInTheDocument();
      expect(screen.getByText(/condomínio:/i)).toBeInTheDocument();
    });

    it('deve calcular e exibir valor total', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText(/total mensal: r\$ 1\.900,00/i)).toBeInTheDocument();
    });

    it('deve exibir dia de vencimento', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText(/dia 10/i)).toBeInTheDocument();
    });

    it('deve exibir índice de reajuste', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText(/igpm/i)).toBeInTheDocument();
    });

    it('deve exibir período do contrato', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText(/01\/11\/2025/i)).toBeInTheDocument();
      expect(screen.getByText(/01\/11\/2026/i)).toBeInTheDocument();
      expect(screen.getByText(/12 meses/i)).toBeInTheDocument();
    });
  });

  describe('Ações', () => {
    it('deve ter botão "Voltar e Editar"', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByRole('button', { name: /voltar e editar/i })).toBeInTheDocument();
    });

    it('deve ter botão "Gerar Contrato"', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByRole('button', { name: /gerar contrato/i })).toBeInTheDocument();
    });

    it('deve chamar onEdit ao clicar em "Voltar e Editar"', () => {
      const Wrapper = createWrapper();
      const onEdit = vi.fn();

      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={onEdit} />
        </Wrapper>
      );

      const editButton = screen.getByRole('button', { name: /voltar e editar/i });
      fireEvent.click(editButton);

      expect(onEdit).toHaveBeenCalled();
    });

    it('deve chamar onConfirm ao clicar em "Gerar Contrato"', () => {
      const Wrapper = createWrapper();
      const onConfirm = vi.fn();

      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={onConfirm} onEdit={vi.fn()} />
        </Wrapper>
      );

      const confirmButton = screen.getByRole('button', { name: /gerar contrato/i });
      fireEvent.click(confirmButton);

      expect(onConfirm).toHaveBeenCalled();
    });

    it('deve mostrar loading durante criação', async () => {
      const Wrapper = createWrapper();
      const onConfirm = vi.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));

      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={onConfirm} onEdit={vi.fn()} />
        </Wrapper>
      );

      const confirmButton = screen.getByRole('button', { name: /gerar contrato/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText(/criando contrato.../i)).toBeInTheDocument();
      });
    });
  });

  describe('Botões de Edição Rápida', () => {
    it('deve ter botão de editar em cada seção', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      const editButtons = screen.getAllByRole('button', { name: /editar/i });
      expect(editButtons.length).toBeGreaterThan(0);
    });

    it('deve permitir editar seção específica', () => {
      const Wrapper = createWrapper();
      const onEdit = vi.fn();

      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={onConfirm} onEdit={onEdit} />
        </Wrapper>
      );

      const editButtons = screen.getAllByRole('button', { name: /editar/i });
      fireEvent.click(editButtons[0]);

      expect(onEdit).toHaveBeenCalledWith(expect.any(Number));
    });
  });

  describe('Resumo Geral', () => {
    it('deve exibir card de resumo', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText(/resumo do contrato/i)).toBeInTheDocument();
    });

    it('deve mostrar informações principais no resumo', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ContratoPreview dados={mockDados} onConfirm={vi.fn()} onEdit={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText(/imóvel: ap001/i)).toBeInTheDocument();
      expect(screen.getByText(/locatário: joão silva/i)).toBeInTheDocument();
      expect(screen.getByText(/valor mensal: r\$ 1\.900,00/i)).toBeInTheDocument();
      expect(screen.getByText(/duração: 12 meses/i)).toBeInTheDocument();
    });
  });
});
