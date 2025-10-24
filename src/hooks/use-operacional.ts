/**
 * =====================================================
 * HOOKS: CONTROLE OPERACIONAL
 * =====================================================
 * Hooks para rescisões, vistorias, chaves e pendências
 * =====================================================
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type {
  Rescisao,
  RescisaoWithRelations,
  Vistoria,
  VistoriaWithRelations,
  ChaveMovimentacao,
  ChaveMovimentacaoWithRelations,
  Pendencia,
  PendenciaWithRelations,
  RescisaoFilters,
  VistoriaFilters,
  ChaveFilters,
  PendenciaFilters,
  CriarRescisaoInput,
  CriarVistoriaInput,
  RegistrarMovimentacaoChaveInput,
  CriarPendenciaInput,
  RealizarVistoriaInput,
  ResolverPendenciaInput,
} from '@/lib/types/operacional'

// =====================================================
// RESCISÕES
// =====================================================

export function useRescisoes(filters: RescisaoFilters = {}) {
  return useQuery({
    queryKey: ['rescisoes', filters],
    queryFn: async () => {
      const supabase = createClient()
      let query = supabase
        .from('rescisao')
        .select(`
          *,
          contrato:contrato_id(
            numero_contrato,
            valor,
            locatario:locatario_id(
              pessoa:pessoa_id(nome, cpf_cnpj)
            ),
            imovel:imovel_id(
              endereco:endereco_id(logradouro, numero, cidade)
            )
          ),
          vistoria_saida:vistoria_saida_id(*),
          pendencias:pendencia(*)
        `)
        .order('criado_em', { ascending: false })

      if (filters.status?.length) {
        query = query.in('status', filters.status)
      }
      if (filters.tipo) {
        query = query.eq('tipo', filters.tipo)
      }
      if (filters.contrato_id) {
        query = query.eq('contrato_id', filters.contrato_id)
      }
      if (filters.data_inicio) {
        query = query.gte('data_solicitacao', filters.data_inicio)
      }
      if (filters.data_fim) {
        query = query.lte('data_solicitacao', filters.data_fim)
      }
      if (filters.com_pendencias !== undefined) {
        query = query.eq('tem_pendencias', filters.com_pendencias)
      }

      const { data, error } = await query

      if (error) throw error
      return (data || []) as unknown as RescisaoWithRelations[]
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useRescisaoById(id: number | null) {
  return useQuery({
    queryKey: ['rescisao', id],
    queryFn: async () => {
      const supabase = createClient()
      if (!id) return null

      const { data, error } = await supabase
        .from('rescisao')
        .select(`
          *,
          contrato:contrato_id(*),
          vistoria_saida:vistoria_saida_id(*),
          pendencias:pendencia(*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data as unknown as RescisaoWithRelations
    },
    enabled: !!id,
  })
}

export function useCriarRescisao() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CriarRescisaoInput) => {
      const supabase = createClient()
      const userId = (await supabase.auth.getUser()).data.user?.id

      const { data, error } = await supabase
        .from('rescisao')
        .insert({
          contrato_id: input.contrato_id,
          tipo: input.tipo,
          data_desejada_saida: input.data_desejada_saida.toISOString(),
          solicitado_por: input.solicitado_por,
          motivo: input.motivo,
          observacoes: input.observacoes,
          tem_multa: input.tem_multa,
          valor_multa: input.valor_multa,
          responsavel_id: userId,
        })
        .select()
        .single()

      if (error) throw error
      return data as unknown as Rescisao
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rescisoes'] })
      toast.success('Rescisão criada com sucesso!')
    },
    onError: (error) => {
      toast.error(`Erro ao criar rescisão: ${error.message}`)
    },
  })
}

export function useAtualizarRescisao() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Rescisao> }) => {
      const supabase = createClient()

      // Converter Dates para strings (ISO format)
      const dbUpdates: any = { ...updates }
      if (updates.data_desejada_saida) {
        dbUpdates.data_desejada_saida = updates.data_desejada_saida.toISOString()
      }
      if (updates.data_efetiva_saida) {
        dbUpdates.data_efetiva_saida = updates.data_efetiva_saida.toISOString()
      }
      if (updates.data_solicitacao) {
        dbUpdates.data_solicitacao = updates.data_solicitacao.toISOString()
      }
      if (updates.data_devolucao_chaves) {
        dbUpdates.data_devolucao_chaves = updates.data_devolucao_chaves.toISOString()
      }

      const { error } = await supabase
        .from('rescisao')
        .update(dbUpdates)
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rescisoes'] })
      queryClient.invalidateQueries({ queryKey: ['rescisao'] })
      toast.success('Rescisão atualizada!')
    },
  })
}

export function useConcluirRescisao() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('rescisao')
        .update({
          status: 'concluida',
          concluido_em: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rescisoes'] })
      toast.success('Rescisão concluída!')
    },
  })
}

// =====================================================
// VISTORIAS
// =====================================================

export function useVistorias(filters: VistoriaFilters = {}) {
  return useQuery({
    queryKey: ['vistorias', filters],
    queryFn: async () => {
      const supabase = createClient()
      let query = supabase
        .from('vistoria')
        .select(`
          *,
          contrato:contrato_id(
            numero_contrato,
            locatario:locatario_id(
              pessoa:pessoa_id(nome)
            )
          ),
          imovel:imovel_id(
            endereco:endereco_id(logradouro, numero)
          ),
          pendencias:pendencia(*)
        `)
        .order('data_agendada', { ascending: false })

      if (filters.status?.length) {
        query = query.in('status', filters.status)
      }
      if (filters.tipo) {
        query = query.eq('tipo', filters.tipo)
      }
      if (filters.contrato_id) {
        query = query.eq('contrato_id', filters.contrato_id)
      }
      if (filters.imovel_id) {
        query = query.eq('imovel_id', filters.imovel_id)
      }
      if (filters.data_inicio) {
        query = query.gte('data_agendada', filters.data_inicio)
      }
      if (filters.data_fim) {
        query = query.lte('data_agendada', filters.data_fim)
      }

      const { data, error } = await query

      if (error) throw error
      return (data || []) as unknown as VistoriaWithRelations[]
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useCriarVistoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CriarVistoriaInput) => {
      const supabase = createClient()
      const userId = (await supabase.auth.getUser()).data.user?.id

      const { data, error } = await supabase
        .from('vistoria')
        .insert({
          contrato_id: input.contrato_id,
          imovel_id: input.imovel_id,
          tipo: input.tipo,
          data_agendada: input.data_agendada.toISOString(),
          vistoriador_nome: input.vistoriador_nome,
          vistoriador_id: userId,
        })
        .select()
        .single()

      if (error) throw error
      return data as unknown as Vistoria
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vistorias'] })
      toast.success('Vistoria agendada!')
    },
  })
}

export function useRealizarVistoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, dados }: { id: number; dados: RealizarVistoriaInput }) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('vistoria')
        .update({
          checklist: dados.checklist as any,
          fotos: dados.fotos as any,
          observacoes_gerais: dados.observacoes_gerais,
          aprovada: dados.aprovada,
          status: 'realizada',
          data_realizada: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vistorias'] })
      toast.success('Vistoria realizada!')
    },
  })
}

// =====================================================
// CHAVES
// =====================================================

export function useMovimentacoesChaves(filters: ChaveFilters = {}) {
  return useQuery({
    queryKey: ['chaves', filters],
    queryFn: async () => {
      const supabase = createClient()
      let query = supabase
        .from('chave_movimentacao')
        .select(`
          *,
          contrato:contrato_id(numero_contrato),
          imovel:imovel_id(
            endereco:endereco_id(logradouro, numero)
          )
        `)
        .order('data_movimentacao', { ascending: false })

      if (filters.tipo?.length) {
        query = query.in('tipo', filters.tipo)
      }
      if (filters.contrato_id) {
        query = query.eq('contrato_id', filters.contrato_id)
      }
      if (filters.imovel_id) {
        query = query.eq('imovel_id', filters.imovel_id)
      }
      if (filters.data_inicio) {
        query = query.gte('data_movimentacao', filters.data_inicio)
      }
      if (filters.data_fim) {
        query = query.lte('data_movimentacao', filters.data_fim)
      }

      const { data, error } = await query

      if (error) throw error
      return (data || []) as unknown as ChaveMovimentacaoWithRelations[]
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useRegistrarMovimentacaoChave() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: RegistrarMovimentacaoChaveInput) => {
      const supabase = createClient()
      const userId = (await supabase.auth.getUser()).data.user?.id

      const { data, error } = await supabase
        .from('chave_movimentacao')
        .insert({
          ...input,
          responsavel_id: userId,
        })
        .select()
        .single()

      if (error) throw error
      return data as unknown as ChaveMovimentacao
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chaves'] })
      toast.success('Movimentação de chave registrada!')
    },
  })
}

// =====================================================
// PENDÊNCIAS
// =====================================================

export function usePendencias(filters: PendenciaFilters = {}) {
  return useQuery({
    queryKey: ['pendencias', filters],
    queryFn: async () => {
      const supabase = createClient()
      let query = supabase
        .from('pendencia')
        .select(`
          *,
          contrato:contrato_id(numero_contrato),
          imovel:imovel_id(
            endereco:endereco_id(logradouro, numero)
          ),
          vistoria:vistoria_id(tipo, data_realizada),
          rescisao:rescisao_id(tipo, data_solicitacao)
        `)
        .order('prioridade', { ascending: false })
        .order('criado_em', { ascending: false })

      if (filters.status?.length) {
        query = query.in('status', filters.status)
      }
      if (filters.tipo) {
        query = query.eq('tipo', filters.tipo)
      }
      if (filters.prioridade?.length) {
        query = query.in('prioridade', filters.prioridade)
      }
      if (filters.contrato_id) {
        query = query.eq('contrato_id', filters.contrato_id)
      }
      if (filters.imovel_id) {
        query = query.eq('imovel_id', filters.imovel_id)
      }
      if (filters.responsavel_id) {
        query = query.eq('responsavel_id', filters.responsavel_id)
      }

      const { data, error } = await query

      if (error) throw error
      return (data || []) as unknown as PendenciaWithRelations[]
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useCriarPendencia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CriarPendenciaInput) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('pendencia')
        .insert({
          ...input,
          data_limite: input.data_limite?.toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data as unknown as Pendencia
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendencias'] })
      toast.success('Pendência criada!')
    },
  })
}

export function useResolverPendencia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, dados }: { id: number; dados: ResolverPendenciaInput }) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('pendencia')
        .update({
          ...dados,
          status: 'resolvida',
          data_resolucao: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendencias'] })
      toast.success('Pendência resolvida!')
    },
  })
}

export function useAtualizarPendencia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Pendencia> }) => {
      const supabase = createClient()

      // Converter Dates para strings
      const dbUpdates: any = { ...updates }
      if (updates.data_limite) {
        dbUpdates.data_limite = updates.data_limite.toISOString()
      }
      if (updates.data_resolucao) {
        dbUpdates.data_resolucao = updates.data_resolucao.toISOString()
      }

      const { error } = await supabase
        .from('pendencia')
        .update(dbUpdates)
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendencias'] })
      toast.success('Pendência atualizada!')
    },
  })
}
