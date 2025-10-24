import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type {
  LocatarioFormData,
  GarantiaFormData,
  DadosFinanceirosFormData,
} from '@/lib/validations/locacao-forms';

/**
 * Interface para imóvel selecionado
 */
export interface ImovelSelecionado {
  id: string;
  codigo_interno: string;
  tipo_imovel: string;
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
    complemento?: string;
  };
  valor_aluguel: number;
  caracteristicas?: {
    quartos?: number;
    banheiros?: number;
    vagas?: number;
    area?: number;
  };
}

/**
 * Interface para estado do wizard
 */
export interface NovaLocacaoState {
  currentStep: number;
  imovelSelecionado: ImovelSelecionado | null;
  locatario: LocatarioFormData | null;
  garantia: GarantiaFormData | null;
  dadosFinanceiros: DadosFinanceirosFormData | null;
}

/**
 * Hook para gerenciar o fluxo de criação de locação
 */
export function useCreateLocacao() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Estado do wizard
  const [state, setState] = useState<NovaLocacaoState>({
    currentStep: 0,
    imovelSelecionado: null,
    locatario: null,
    garantia: null,
    dadosFinanceiros: null,
  });

  // Total de steps
  const TOTAL_STEPS = 5;

  /**
   * Navegação entre steps
   */
  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, TOTAL_STEPS - 1),
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(0, Math.min(step, TOTAL_STEPS - 1)),
    }));
  }, []);

  /**
   * Setters para cada parte do estado
   */
  const setImovelSelecionado = useCallback((imovel: ImovelSelecionado) => {
    setState((prev) => ({
      ...prev,
      imovelSelecionado: imovel,
    }));
  }, []);

  const setLocatario = useCallback((locatario: LocatarioFormData) => {
    setState((prev) => ({
      ...prev,
      locatario,
    }));
  }, []);

  const setGarantia = useCallback((garantia: GarantiaFormData) => {
    setState((prev) => ({
      ...prev,
      garantia,
    }));
  }, []);

  const setDadosFinanceiros = useCallback((dados: DadosFinanceirosFormData) => {
    setState((prev) => ({
      ...prev,
      dadosFinanceiros: dados,
    }));
  }, []);

  /**
   * Validação do step atual
   */
  const isCurrentStepValid = useCallback(() => {
    switch (state.currentStep) {
      case 0: // Seleção de imóvel
        return state.imovelSelecionado !== null;
      case 1: // Dados do locatário
        return state.locatario !== null;
      case 2: // Garantia
        return state.garantia !== null;
      case 3: // Dados financeiros
        return state.dadosFinanceiros !== null;
      case 4: // Preview
        return (
          state.imovelSelecionado !== null &&
          state.locatario !== null &&
          state.garantia !== null &&
          state.dadosFinanceiros !== null
        );
      default:
        return false;
    }
  }, [state]);

  /**
   * Cálculo do progresso
   */
  const progress = Math.round((state.currentStep / TOTAL_STEPS) * 100);

  /**
   * Mutation para criar o contrato
   */
  const mutation = useMutation({
    mutationFn: async () => {
      // Validar que todos os dados estão preenchidos
      if (
        !state.imovelSelecionado ||
        !state.locatario ||
        !state.garantia ||
        !state.dadosFinanceiros
      ) {
        throw new Error('Dados incompletos para criar contrato');
      }

      // 1. Criar/obter locatário
      let locatarioId: string | number;

      if (state.locatario.tipo === 'novo') {
        const { data: locatarioData, error: locatarioError } = await supabase
          .from('pessoa')
          .insert({
            tipo_pessoa: state.locatario.dados.tipo_pessoa,
            nome: state.locatario.dados.nome,
            cpf_cnpj: state.locatario.dados.cpf_cnpj,
            email: state.locatario.dados.email,
            telefone: state.locatario.dados.telefone,
            tipo_cadastro: 'locatario',
          })
          .select('id')
          .single();

        if (locatarioError) throw locatarioError;
        locatarioId = locatarioData.id;

        // Inserir endereço
        await supabase.from('endereco').insert({
          pessoa_id: locatarioId,
          ...state.locatario.dados.endereco,
          tipo: 'residencial',
        });
      } else {
        locatarioId = state.locatario.dados.id;
      }

      // 2. Criar/obter fiador (se houver)
      let fiadorId: string | number | null = null;
      if (state.garantia.tipo === 'fiador') {
        const { data: fiadorData, error: fiadorError } = await supabase
          .from('pessoa')
          .insert({
            tipo_pessoa: 'fisica',
            nome: state.garantia.fiador.nome,
            cpf_cnpj: state.garantia.fiador.cpf,
            email: state.garantia.fiador.email,
            telefone: state.garantia.fiador.telefone,
            tipo_cadastro: 'fiador',
          })
          .select('id')
          .single();

        if (fiadorError) throw fiadorError;
        fiadorId = fiadorData.id;

        // Inserir endereço do fiador
        await supabase.from('endereco').insert({
          pessoa_id: fiadorId,
          ...state.garantia.fiador.endereco,
          tipo: 'residencial',
        });
      }

      // 3. Calcular data fim
      const dataFim = new Date(state.dadosFinanceiros.data_inicio);
      dataFim.setMonth(dataFim.getMonth() + state.dadosFinanceiros.duracao_meses);

      // 4. Criar contrato de locação

      const { data: contratoData, error: contratoError } = await supabase
        .from('contrato_locacao')
        .insert({
          imovel_id: parseInt(state.imovelSelecionado.id as string),
          locatario_id: locatarioId as number,
          fiador_id: fiadorId as number | null,
          tipo_locacao_id: 1, // TODO: permitir seleção do tipo
          valor: state.dadosFinanceiros.valor_aluguel,
          valor_iptu: state.dadosFinanceiros.valor_iptu || null,
          valor_condominio: state.dadosFinanceiros.valor_condominio || null,
          caucao: state.garantia.tipo === 'caucao' ? state.garantia.valor : null,
          data_inicio_contrato: state.dadosFinanceiros.data_inicio.toISOString().split('T')[0],
          data_fim_contrato: dataFim.toISOString().split('T')[0],
          data_vencimento_aluguel: state.dadosFinanceiros.dia_vencimento,
          dia_vencimento: state.dadosFinanceiros.dia_vencimento,
          indice_reajuste: state.dadosFinanceiros.indice_reajuste,
          observacoes: state.dadosFinanceiros.observacoes || null,
          status: 'ativo',
        })
        .select()
        .single();

      if (contratoError) throw contratoError;

      return contratoData;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  /**
   * Função para criar contrato
   */
  const createContrato = useCallback(async () => {
    return mutation.mutateAsync();
  }, [mutation]);

  /**
   * Reset do estado
   */
  const reset = useCallback(() => {
    setState({
      currentStep: 0,
      imovelSelecionado: null,
      locatario: null,
      garantia: null,
      dadosFinanceiros: null,
    });
    mutation.reset();
  }, [mutation]);

  return {
    // Estado
    currentStep: state.currentStep,
    imovelSelecionado: state.imovelSelecionado,
    locatario: state.locatario,
    garantia: state.garantia,
    dadosFinanceiros: state.dadosFinanceiros,

    // Navegação
    nextStep,
    prevStep,
    goToStep,

    // Setters
    setImovelSelecionado,
    setLocatario,
    setGarantia,
    setDadosFinanceiros,

    // Validação
    isCurrentStepValid,

    // Progresso
    progress,
    totalSteps: TOTAL_STEPS,

    // Mutation
    createContrato,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,

    // Reset
    reset,
  };
}
