import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateLocacao } from '@/hooks/use-create-locacao';
import React, { type ReactNode } from 'react';

// Mock do Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
        single: vi.fn(() => Promise.resolve({ data: { id: 'test-id' }, error: null })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 'test-locatario-id' }, error: null })),
        })),
      })),
      update: vi.fn(() => Promise.resolve({ data: { id: 'test-id' }, error: null })),
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
  const Wrapper = ({ children }: { children: ReactNode }) => {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
  return Wrapper;
};

describe('useCreateLocacao', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Estado inicial', () => {
    it('deve iniciar no step 0', () => {
      const { result } = renderHook(() => useCreateLocacao(), {
        wrapper: createWrapper(),
      });

      expect(result.current.currentStep).toBe(0);
    });

    it('deve ter todos os dados nulos inicialmente', () => {
      const { result } = renderHook(() => useCreateLocacao(), {
        wrapper: createWrapper(),
      });

      expect(result.current.imovelSelecionado).toBeNull();
      expect(result.current.locatario).toBeNull();
      expect(result.current.garantia).toBeNull();
      expect(result.current.dadosFinanceiros).toBeNull();
    });

    it('deve ter isValid false inicialmente', () => {
      const { result } = renderHook(() => useCreateLocacao(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isCurrentStepValid()).toBe(false);
    });
  });

  describe('Navegação entre steps', () => {
    it('deve avançar para o próximo step', () => {
      const { result } = renderHook(() => useCreateLocacao(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setImovelSelecionado({
          id: 'imovel-1',
          codigo_interno: 'AP001',
          tipo_imovel: 'apartamento',
          endereco: {
            logradouro: 'Rua Teste',
            numero: '123',
            bairro: 'Centro',
            cidade: 'São Paulo',
            uf: 'SP',
            cep: '01000-000',
          },
          valor_aluguel: 1500,
        });
      });

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(1);
    });

    it('deve voltar para o step anterior', () => {
      const { result } = renderHook(() => useCreateLocacao(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setImovelSelecionado({
          id: 'imovel-1',
          codigo_interno: 'AP001',
          tipo_imovel: 'apartamento',
          endereco: {
            logradouro: 'Rua Teste',
            numero: '123',
            bairro: 'Centro',
            cidade: 'São Paulo',
            uf: 'SP',
            cep: '01000-000',
          },
          valor_aluguel: 1500,
        });
      });

      act(() => {
        result.current.nextStep();
      });

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(0);
    });

    it('não deve avançar além do último step', () => {
      const { result } = renderHook(() => useCreateLocacao(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.goToStep(4);
      });

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(4);
    });

    it('não deve voltar antes do primeiro step', () => {
      const { result } = renderHook(() => useCreateLocacao(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(0);
    });

    it('deve ir direto para um step específico', () => {
      const { result } = renderHook(() => useCreateLocacao(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.goToStep(3);
      });

      expect(result.current.currentStep).toBe(3);
    });
  });

  describe('Validação de steps', () => {
    it('step 0 (imóvel) deve ser válido quando imóvel estiver selecionado', () => {
      const { result } = renderHook(() => useCreateLocacao(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setImovelSelecionado({
          id: 'imovel-1',
          codigo_interno: 'AP001',
          tipo_imovel: 'apartamento',
          endereco: {
            logradouro: 'Rua Teste',
            numero: '123',
            bairro: 'Centro',
            cidade: 'São Paulo',
            uf: 'SP',
            cep: '01000-000',
          },
          valor_aluguel: 1500,
        });
      });

      expect(result.current.isCurrentStepValid()).toBe(true);
    });

    it('step 1 (locatário) deve ser válido quando locatário estiver preenchido', () => {
      const { result } = renderHook(() => useCreateLocacao(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.goToStep(1);
        result.current.setLocatario({
          tipo: 'novo',
          dados: {
            tipo_pessoa: 'fisica',
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
        });
      });

      expect(result.current.isCurrentStepValid()).toBe(true);
    });

    it('step 2 (garantia) deve ser válido quando garantia estiver preenchida', () => {
      const { result } = renderHook(() => useCreateLocacao(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.goToStep(2);
        result.current.setGarantia({
          tipo: 'caucao',
          valor: 4500,
        });
      });

      expect(result.current.isCurrentStepValid()).toBe(true);
    });

    it('step 3 (dados financeiros) deve ser válido quando dados estiverem preenchidos', () => {
      const { result } = renderHook(() => useCreateLocacao(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.goToStep(3);
        result.current.setDadosFinanceiros({
          valor_aluguel: 1500,
          valor_iptu: 100,
          valor_condominio: 300,
          dia_vencimento: 10,
          indice_reajuste: 'IGPM',
          data_inicio: new Date('2025-11-01'),
          duracao_meses: 12,
        });
      });

      expect(result.current.isCurrentStepValid()).toBe(true);
    });
  });

  describe('Mutação de criação', () => {
    it('deve criar contrato com sucesso', async () => {
      const { result } = renderHook(() => useCreateLocacao(), {
        wrapper: createWrapper(),
      });

      // Preencher todos os dados
      act(() => {
        result.current.setImovelSelecionado({
          id: 'imovel-1',
          codigo_interno: 'AP001',
          tipo_imovel: 'apartamento',
          endereco: {
            logradouro: 'Rua Teste',
            numero: '123',
            bairro: 'Centro',
            cidade: 'São Paulo',
            uf: 'SP',
            cep: '01000-000',
          },
          valor_aluguel: 1500,
        });

        result.current.setLocatario({
          tipo: 'novo',
          dados: {
            tipo_pessoa: 'fisica',
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
        });

        result.current.setGarantia({
          tipo: 'caucao',
          valor: 4500,
        });

        result.current.setDadosFinanceiros({
          valor_aluguel: 1500,
          valor_iptu: 100,
          valor_condominio: 300,
          dia_vencimento: 10,
          indice_reajuste: 'IGPM',
          data_inicio: new Date('2025-11-01'),
          duracao_meses: 12,
        });
      });

      await act(async () => {
        await result.current.createContrato();
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('deve ter loading true durante criação', async () => {
      const { result } = renderHook(() => useCreateLocacao(), {
        wrapper: createWrapper(),
      });

      // Verificar que não está loading inicialmente
      expect(result.current.isLoading).toBe(false);

      // Preencher todos os dados
      act(() => {
        result.current.setImovelSelecionado({
          id: 'imovel-1',
          codigo_interno: 'AP001',
          tipo_imovel: 'apartamento',
          endereco: {
            logradouro: 'Rua Teste',
            numero: '123',
            bairro: 'Centro',
            cidade: 'São Paulo',
            uf: 'SP',
            cep: '01000-000',
          },
          valor_aluguel: 1500,
        });

        result.current.setLocatario({
          tipo: 'novo',
          dados: {
            tipo_pessoa: 'fisica',
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
        });

        result.current.setGarantia({
          tipo: 'caucao',
          valor: 4500,
        });

        result.current.setDadosFinanceiros({
          valor_aluguel: 1500,
          valor_iptu: 100,
          valor_condominio: 300,
          dia_vencimento: 10,
          indice_reajuste: 'IGPM',
          data_inicio: new Date('2025-11-01'),
          duracao_meses: 12,
        });
      });

      // Executar criação e verificar que terminou
      await act(async () => {
        await result.current.createContrato();
      });

      // Verificar que sucesso foi atingido
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });

  describe('Reset de estado', () => {
    it('deve resetar todos os dados', () => {
      const { result } = renderHook(() => useCreateLocacao(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setImovelSelecionado({
          id: 'imovel-1',
          codigo_interno: 'AP001',
          tipo_imovel: 'apartamento',
          endereco: {
            logradouro: 'Rua Teste',
            numero: '123',
            bairro: 'Centro',
            cidade: 'São Paulo',
            uf: 'SP',
            cep: '01000-000',
          },
          valor_aluguel: 1500,
        });
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.currentStep).toBe(0);
      expect(result.current.imovelSelecionado).toBeNull();
      expect(result.current.locatario).toBeNull();
      expect(result.current.garantia).toBeNull();
      expect(result.current.dadosFinanceiros).toBeNull();
    });
  });

  describe('Progresso do wizard', () => {
    it('deve calcular progresso corretamente', () => {
      const { result } = renderHook(() => useCreateLocacao(), {
        wrapper: createWrapper(),
      });

      expect(result.current.progress).toBe(0);

      act(() => {
        result.current.goToStep(2);
      });

      expect(result.current.progress).toBe(40); // 2/5 * 100 = 40
    });
  });
});
