/**
 * HOOK USE-COBRANCAS
 *
 * Hook para gerenciamento de cobranças (boletos/PIX)
 * Implementa listagem, cancelamento, reenvio e utilitários
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type {
  Cobranca,
  CobrancaFilters,
} from '@/types/financeiro'

// Tipos temporários até serem definidos em @/types/financeiro
type CancelarCobrancaFormData = {
  cobranca_id: number
  motivo?: string
}

type ReenviarBoletoFormData = {
  cobranca_id: number
  canal?: string
  destinatario?: string
  email?: string
}
import { toast } from 'sonner'

/**
 * Hook para listar cobranças com filtros
 */
export function useCobrancas(filters: CobrancaFilters) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['cobrancas', filters],
    queryFn: async () => {
      let query = supabase
        .from('cobranca')
        .select(
          `
          *,
          parcela:parcela_id(
            id,
            numero_parcela,
            competencia,
            vencimento,
            valor_total,
            status,
            contrato:contrato_locacao(
              numero_contrato,
              locatario:locatario_id(
                pessoa:pessoa_id(nome, cpf_cnpj)
              )
            )
          )
        `
        )

      // Aplicar filtros
      if (filters.gateway && filters.gateway.length > 0) {
        query = query.in('gateway', filters.gateway)
      }

      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status)
      }

      if (filters.data_emissao_inicio) {
        query = query.gte('data_emissao', filters.data_emissao_inicio)
      }

      if (filters.data_emissao_fim) {
        query = query.lte('data_emissao', filters.data_emissao_fim)
      }

      if (filters.data_pagamento_inicio) {
        query = query.gte('data_pagamento', filters.data_pagamento_inicio)
      }

      if (filters.data_pagamento_fim) {
        query = query.lte('data_pagamento', filters.data_pagamento_fim)
      }

      // Ordenação
      query = query.order('created_at', { ascending: false })

      // Paginação
      if (filters.page && filters.limit) {
        const from = (filters.page - 1) * filters.limit
        const to = from + filters.limit - 1
        query = query.range(from, to)
      }

      const { data, error } = await query

      if (error) throw error
      return (data || []) as unknown as Cobranca[]
    },
  })
}

/**
 * Hook para cancelar cobrança
 */
export function useCancelarCobranca() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CancelarCobrancaFormData) => {
      // 1. Buscar cobrança
      const { data: cobranca, error: cobrancaError } = await supabase
        .from('cobranca')
        .select('*')
        .eq('id', input.cobranca_id)
        .single()

      if (cobrancaError) throw cobrancaError
      if (!cobranca) throw new Error('Cobrança não encontrada')

      // 2. Cancelar no gateway (em produção)
      // await cancelarNoGateway(cobranca.gateway, cobranca.gateway_id)

      // 3. Atualizar status da cobrança
      const { error: updateCobrancaError } = await supabase
        .from('cobranca')
        .update({
          status: 'cancelada',
          payload_webhook: {
            ...(typeof cobranca.payload_webhook === 'object' && cobranca.payload_webhook !== null
              ? cobranca.payload_webhook
              : {}),
            cancelamento: {
              data: new Date().toISOString(),
              motivo: input.motivo,
            },
          } as any,
        })
        .eq('id', input.cobranca_id)

      if (updateCobrancaError) throw updateCobrancaError

      // 4. Atualizar parcela para "pendente"
      const { error: updateParcelaError } = await supabase
        .from('parcela')
        .update({ status: 'pendente' })
        .eq('id', cobranca.parcela_id)

      if (updateParcelaError) throw updateParcelaError

      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cobrancas'] })
      queryClient.invalidateQueries({ queryKey: ['parcelas'] })
      toast.success('Cobrança cancelada com sucesso')
    },
    onError: (error: Error) => {
      toast.error(`Erro ao cancelar cobrança: ${error.message}`)
    },
  })
}

/**
 * Hook para reenviar boleto/PIX
 */
export function useReenviarBoleto() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: ReenviarBoletoFormData) => {
      // 1. Buscar cobrança
      const { data: cobranca, error: cobrancaError } = await supabase
        .from('cobranca')
        .select('*, parcela:parcela_id(*)')
        .eq('id', input.cobranca_id)
        .single()

      if (cobrancaError) throw cobrancaError
      if (!cobranca) throw new Error('Cobrança não encontrada')

      // 2. Criar notificação de reenvio
      const { data: notificacao, error: notifError } = await supabase
        .from('notificacao')
        .insert({
          parcela_id: cobranca.parcela_id,
          canal: input.canal as 'email' | 'whatsapp' | 'sms' | 'push' | 'outro',
          tipo_evento: 'lembrete',
          destinatario: input.destinatario,
          status: 'enviado',
          data_envio: new Date().toISOString(),
          tentativas: 1,
        } as any)
        .select()
        .single()

      if (notifError) throw notifError

      // 3. Incrementar contador de tentativas
      const { data: cobrancaAtualizada, error: updateError } = await supabase
        .from('cobranca')
        .update({
          tentativas_envio: ((cobranca as any).tentativas_envio || 0) + 1,
        } as any)
        .eq('id', input.cobranca_id)
        .select()
        .single()

      if (updateError) throw updateError

      return {
        ...cobrancaAtualizada,
        notificacao,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cobrancas'] })
      toast.success('Boleto reenviado com sucesso')
    },
    onError: (error: Error) => {
      toast.error(`Erro ao reenviar boleto: ${error.message}`)
    },
  })
}

/**
 * Hook para copiar linha digitável
 */
export function useCopiarLinhaDigitavel() {
  return useMutation({
    mutationFn: async (linhaDigitavel: string) => {
      await navigator.clipboard.writeText(linhaDigitavel)
      return { success: true }
    },
    onSuccess: () => {
      toast.success('Linha digitável copiada')
    },
    onError: () => {
      toast.error('Erro ao copiar linha digitável')
    },
  })
}

/**
 * Hook para copiar QR Code PIX
 */
export function useCopiarQRCode() {
  return useMutation({
    mutationFn: async (qrcode: string) => {
      await navigator.clipboard.writeText(qrcode)
      return { success: true }
    },
    onSuccess: () => {
      toast.success('QR Code PIX copiado')
    },
    onError: () => {
      toast.error('Erro ao copiar QR Code')
    },
  })
}

/**
 * Hook para baixar PDF do boleto
 */
export function useBaixarBoleto() {
  return useMutation({
    mutationFn: async (url: string) => {
      // Abrir em nova aba (ou download)
      window.open(url, '_blank')
      return { url }
    },
    onSuccess: () => {
      toast.success('Download iniciado')
    },
  })
}

/**
 * Hook para buscar detalhes de webhook
 */
export function useDetalhesWebhook(cobrancaId: number) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['webhook', cobrancaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cobranca')
        .select('payload_webhook')
        .eq('id', cobrancaId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!cobrancaId,
  })
}

/**
 * Função auxiliar para verificar se cobrança está conciliada
 */
export function isConciliada(cobranca: Cobranca): boolean {
  return cobranca.status === 'paga' && !!cobranca.data_pagamento
}

/**
 * Função auxiliar para formatar linha digitável
 */
export function formatarLinhaDigitavel(linha?: string): string {
  if (!linha) return '-'

  // Formato: 12345.67890 12345.678901 12345.678901 1 12345678901234
  return linha.replace(/(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d)(\d{14})/, '$1.$2 $3.$4 $5.$6 $7 $8')
}

/**
 * Função auxiliar para obter label de status
 */
export function getStatusLabel(
  status: Cobranca['status']
): { label: string; color: string } {
  const statusMap = {
    criada: { label: 'Preparando', color: 'gray' },
    emitida: { label: 'Aguardando Pagamento', color: 'blue' },
    paga: { label: 'Confirmada', color: 'green' },
    vencida: { label: 'Atrasada', color: 'red' },
    cancelada: { label: 'Cancelada', color: 'orange' },
    estornada: { label: 'Estornada', color: 'yellow' },
  }

  return statusMap[status] || { label: status, color: 'gray' }
}
