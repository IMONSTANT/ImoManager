import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImovelSelector } from '@/components/locacao/ImovelSelector';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock do Supabase
const mockImoveis = [
  {
    id: '1',
    codigo_interno: 'AP001',
    tipo_imovel: { descricao: 'Apartamento' },
    endereco: {
      logradouro: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      uf: 'SP',
    },
    caracteristicas: {
      quartos: 2,
      banheiros: 1,
      vagas: 1,
      area: 65,
    },
    valor_aluguel: 1500,
    foto_url: null,
  },
  {
    id: '2',
    codigo_interno: 'CA002',
    tipo_imovel: { descricao: 'Casa' },
    endereco: {
      logradouro: 'Av. Principal',
      numero: '456',
      bairro: 'Jardins',
      cidade: 'São Paulo',
      uf: 'SP',
    },
    caracteristicas: {
      quartos: 3,
      banheiros: 2,
      vagas: 2,
      area: 120,
    },
    valor_aluguel: 3000,
    foto_url: 'https://example.com/foto.jpg',
  },
  {
    id: '3',
    codigo_interno: 'CO003',
    tipo_imovel: { descricao: 'Comercial' },
    endereco: {
      logradouro: 'Rua Comercial',
      numero: '789',
      bairro: 'Centro',
      cidade: 'Campinas',
      uf: 'SP',
    },
    caracteristicas: {
      area: 80,
    },
    valor_aluguel: 2500,
    foto_url: null,
  },
];

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        in: vi.fn(() => ({
          data: mockImoveis,
          error: null,
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

describe('ImovelSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar lista de imóveis', async () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('AP001')).toBeInTheDocument();
        expect(screen.getByText('CA002')).toBeInTheDocument();
        expect(screen.getByText('CO003')).toBeInTheDocument();
      });
    });

    it('deve mostrar loading state', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    });

    it('deve mostrar mensagem quando não houver imóveis', async () => {
      vi.mock('@/lib/supabase/client', () => ({
        createClient: vi.fn(() => ({
          from: vi.fn(() => ({
            select: vi.fn(() => ({
              in: vi.fn(() => ({
                data: [],
                error: null,
              })),
            })),
          })),
        })),
      }));

      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/nenhum imóvel disponível/i)).toBeInTheDocument();
      });
    });
  });

  describe('Cards de Imóveis', () => {
    it('deve exibir informações corretas do imóvel', async () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Rua das Flores, 123')).toBeInTheDocument();
        expect(screen.getByText('Centro - São Paulo/SP')).toBeInTheDocument();
        expect(screen.getByText('R$ 1.500,00')).toBeInTheDocument();
        expect(screen.getByText('2 quartos')).toBeInTheDocument();
        expect(screen.getByText('1 vaga')).toBeInTheDocument();
        expect(screen.getByText('65 m²')).toBeInTheDocument();
      });
    });

    it('deve mostrar placeholder quando não houver foto', async () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} />
        </Wrapper>
      );

      await waitFor(() => {
        const placeholders = screen.getAllByAltText(/sem foto/i);
        expect(placeholders.length).toBeGreaterThan(0);
      });
    });

    it('deve mostrar foto quando disponível', async () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} />
        </Wrapper>
      );

      await waitFor(() => {
        const foto = screen.getByAltText('Imóvel CA002');
        expect(foto).toHaveAttribute('src', expect.stringContaining('foto.jpg'));
      });
    });

    it('deve ter botão "Selecionar" em cada card', async () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} />
        </Wrapper>
      );

      await waitFor(() => {
        const buttons = screen.getAllByRole('button', { name: /selecionar/i });
        expect(buttons.length).toBe(3);
      });
    });
  });

  describe('Seleção de Imóvel', () => {
    it('deve chamar onSelect ao clicar em "Selecionar"', async () => {
      const onSelect = vi.fn();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <ImovelSelector onSelect={onSelect} />
        </Wrapper>
      );

      await waitFor(() => {
        const buttons = screen.getAllByRole('button', { name: /selecionar/i });
        fireEvent.click(buttons[0]);
      });

      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          codigo_interno: 'AP001',
        })
      );
    });

    it('deve destacar imóvel selecionado', async () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} selectedId="1" />
        </Wrapper>
      );

      await waitFor(() => {
        const card = screen.getByTestId('imovel-card-1');
        expect(card).toHaveClass('selected');
      });
    });
  });

  describe('Filtros', () => {
    it('deve renderizar todos os filtros', async () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/bairro/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cidade/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/valor mínimo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/valor máximo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/quartos/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/vagas/i)).toBeInTheDocument();
    });

    it('deve filtrar por tipo de imóvel', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('AP001')).toBeInTheDocument();
      });

      const tipoSelect = screen.getByLabelText(/tipo/i);
      await user.selectOptions(tipoSelect, 'apartamento');

      await waitFor(() => {
        expect(screen.getByText('AP001')).toBeInTheDocument();
        expect(screen.queryByText('CA002')).not.toBeInTheDocument();
        expect(screen.queryByText('CO003')).not.toBeInTheDocument();
      });
    });

    it('deve filtrar por bairro', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('AP001')).toBeInTheDocument();
      });

      const bairroInput = screen.getByLabelText(/bairro/i);
      await user.type(bairroInput, 'Jardins');

      await waitFor(() => {
        expect(screen.queryByText('AP001')).not.toBeInTheDocument();
        expect(screen.getByText('CA002')).toBeInTheDocument();
      });
    });

    it('deve filtrar por cidade', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('CO003')).toBeInTheDocument();
      });

      const cidadeInput = screen.getByLabelText(/cidade/i);
      await user.type(cidadeInput, 'Campinas');

      await waitFor(() => {
        expect(screen.queryByText('AP001')).not.toBeInTheDocument();
        expect(screen.queryByText('CA002')).not.toBeInTheDocument();
        expect(screen.getByText('CO003')).toBeInTheDocument();
      });
    });

    it('deve filtrar por faixa de valor', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('AP001')).toBeInTheDocument();
      });

      const minInput = screen.getByLabelText(/valor mínimo/i);
      const maxInput = screen.getByLabelText(/valor máximo/i);

      await user.type(minInput, '2000');
      await user.type(maxInput, '2800');

      await waitFor(() => {
        expect(screen.queryByText('AP001')).not.toBeInTheDocument();
        expect(screen.queryByText('CA002')).not.toBeInTheDocument();
        expect(screen.getByText('CO003')).toBeInTheDocument();
      });
    });

    it('deve filtrar por número de quartos', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('AP001')).toBeInTheDocument();
      });

      const quartosInput = screen.getByLabelText(/quartos/i);
      await user.type(quartosInput, '3');

      await waitFor(() => {
        expect(screen.queryByText('AP001')).not.toBeInTheDocument();
        expect(screen.getByText('CA002')).toBeInTheDocument();
      });
    });

    it('deve filtrar por número de vagas', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('CA002')).toBeInTheDocument();
      });

      const vagasInput = screen.getByLabelText(/vagas/i);
      await user.type(vagasInput, '2');

      await waitFor(() => {
        expect(screen.queryByText('AP001')).not.toBeInTheDocument();
        expect(screen.getByText('CA002')).toBeInTheDocument();
      });
    });

    it('deve limpar filtros', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} />
        </Wrapper>
      );

      // Aplicar filtro
      const bairroInput = screen.getByLabelText(/bairro/i);
      await user.type(bairroInput, 'Jardins');

      await waitFor(() => {
        expect(screen.queryByText('AP001')).not.toBeInTheDocument();
      });

      // Limpar filtros
      const clearButton = screen.getByRole('button', { name: /limpar filtros/i });
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.getByText('AP001')).toBeInTheDocument();
        expect(screen.getByText('CA002')).toBeInTheDocument();
        expect(screen.getByText('CO003')).toBeInTheDocument();
      });
    });
  });

  describe('Grid Layout', () => {
    it('deve exibir cards em grid responsivo', async () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} />
        </Wrapper>
      );

      await waitFor(() => {
        const grid = screen.getByTestId('imoveis-grid');
        expect(grid).toHaveClass('grid');
      });
    });
  });

  describe('Busca', () => {
    it('deve ter campo de busca', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} />
        </Wrapper>
      );

      expect(screen.getByPlaceholderText(/buscar imóvel/i)).toBeInTheDocument();
    });

    it('deve buscar por código interno', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('AP001')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/buscar imóvel/i);
      await user.type(searchInput, 'CA002');

      await waitFor(() => {
        expect(screen.queryByText('AP001')).not.toBeInTheDocument();
        expect(screen.getByText('CA002')).toBeInTheDocument();
      });
    });

    it('deve buscar por endereço', async () => {
      const user = userEvent.setup();
      const Wrapper = createWrapper();

      render(
        <Wrapper>
          <ImovelSelector onSelect={vi.fn()} />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('AP001')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/buscar imóvel/i);
      await user.type(searchInput, 'Rua das Flores');

      await waitFor(() => {
        expect(screen.getByText('AP001')).toBeInTheDocument();
        expect(screen.queryByText('CA002')).not.toBeInTheDocument();
      });
    });
  });
});
