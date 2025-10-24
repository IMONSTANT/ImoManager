/**
 * HOOK USE-PARCELAS
 *
 * Hook para gerenciamento de parcelas de contratos de locação
 * Implementa listagem, filtros, emissão de boletos e baixa manual
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { FinanceiroService } from '@/lib/services/FinanceiroService'
import type {
  Parcela,
  ParcelaFilters,
  BaixaManualInput,
  BaixaManualResult,
  EmitirBoletoInput,
  EmitirBoletoResult,
  ParcelaTotalizadores,
  ParcelaStatus,
  Cobranca,
} from '@/types/financeiro'

/**
 * Hook para listar parcelas com filtros
 */
export function useParcelas(filters: ParcelaFilters) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['parcelas', filters],
    queryFn: async () => {
      let query = supabase
        .from('parcela')
        .select(
          `
          *,
          contrato:contrato_locacao(
            id,
            numero_contrato,
            locatario:locatario_id(
              pessoa:pessoa_id(
                nome,
                cpf_cnpj
              )
            ),
            imovel:imovel_id(
              endereco:endereco_id(
                logradouro,
                numero,
                bairro,
                cidade,
                uf
              )
            )
          )
        `
        )

      // Aplicar filtros
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status)
      }

      if (filters.contrato_id) {
        query = query.eq('contrato_id', filters.contrato_id)
      }

      if (filters.data_inicio) {
        query = query.gte('vencimento', filters.data_inicio)
      }

      if (filters.data_fim) {
        query = query.lte('vencimento', filters.data_fim)
      }

      // TODO: Filtro por locatário (busca textual)
      // Requer ajuste na query do Supabase

      // Ordenação
      query = query.order('vencimento', { ascending: false })

      // Paginação
      if (filters.page && filters.limit) {
        const from = (filters.page - 1) * filters.limit
        const to = from + filters.limit - 1
        query = query.range(from, to)
      }

      const { data, error } = await query

      if (error) throw error
      return (data || []) as unknown as Parcela[]
    },
  })
}

/**
 * Hook para emitir boleto/PIX
 */
export function useEmitirBoleto() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      input: EmitirBoletoInput
    ): Promise<EmitirBoletoResult> => {
      // 1. Buscar dados da parcela
      const { data: parcela, error: parcelaError } = await supabase
        .from('parcela')
        .select('*, contrato:contrato_locacao(*)')
        .eq('id', input.parcela_id)
        .single()

      if (parcelaError) throw parcelaError
      if (!parcela) throw new Error('Parcela não encontrada')

      // 2. Criar cobrança (simula chamada ao gateway)
      const { data: cobranca, error: cobrancaError } = await supabase
        .from('cobranca')
        .insert({
          parcela_id: input.parcela_id,
          gateway: input.gateway,
          status: 'emitida',
          valor: parcela.principal + (parcela.juros || 0) + (parcela.multa || 0) - (parcela.desconto || 0),
          data_emissao: new Date().toISOString(),
          tentativas_envio: 0,
          // Em produção, aqui viriam dados do gateway:
          // gateway_id, nosso_numero, linha_digitavel, qrcode_pix, url_boleto
        })
        .select()
        .single()

      if (cobrancaError) throw cobrancaError

      // 3. Atualizar status da parcela
      const { error: updateError } = await supabase
        .from('parcela')
        .update({ status: 'emitido' })
        .eq('id', input.parcela_id)

      if (updateError) throw updateError

      // 4. Criar notificações se solicitado
      const notificacoes = []
      if (input.enviar_notificacao && input.canais_notificacao) {
        for (const canal of input.canais_notificacao) {
          const mensagem = `Lembrete: Parcela vencendo em ${parcela.vencimento}`
          const { data: notif, error: notifError } = await supabase
            .from('notificacao')
            .insert({
              parcela_id: input.parcela_id,
              canal,
              mensagem,
              assunto: 'Lembrete de Vencimento',
              status: 'enviado',
              enviado_em: new Date().toISOString(),
              tentativas: 1,
            })
            .select()
            .single()

          if (!notifError && notif) {
            notificacoes.push(notif)
          }
        }
      }

      return {
        cobranca: cobranca as unknown as Cobranca,
        notificacoes: notificacoes as any,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelas'] })
      queryClient.invalidateQueries({ queryKey: ['cobrancas'] })
    },
  })
}

/**
 * Hook para baixa manual de parcela
 */
export function useBaixaManual() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: BaixaManualInput): Promise<BaixaManualResult> => {
      // 1. Buscar parcela atual
      const { data: parcela, error: parcelaError } = await supabase
        .from('parcela')
        .select('*')
        .eq('id', input.parcela_id)
        .single()

      if (parcelaError) throw parcelaError
      if (!parcela) throw new Error('Parcela não encontrada')

      // 2. Aplicar pagamento parcial usando FinanceiroService
      const divida = {
        principal: parcela.principal,
        multa: parcela.multa || 0,
        juros: parcela.juros || 0,
      }

      const resultado = FinanceiroService.aplicarPagamentoParcial(
        divida,
        input.valor_pago
      )

      // 3. Atualizar parcela
      const { data: parcelaAtualizada, error: updateError } = await supabase
        .from('parcela')
        .update({
          valor_pago: input.valor_pago,
          data_pagamento: input.data_pagamento.toISOString(),
          observacoes: input.observacoes,
          status: resultado.quitado ? 'pago' : 'pendente',
          // Atualizar valores restantes
          principal: resultado.principal,
          multa: resultado.multa,
          juros: resultado.juros,
        })
        .eq('id', input.parcela_id)
        .select()
        .single()

      if (updateError) throw updateError

      // 4. Upload de comprovante (se houver)
      let comprovante_url: string | undefined

      if (input.comprovante) {
        const fileName = `${input.parcela_id}_${Date.now()}.pdf`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('comprovantes')
          .upload(fileName, input.comprovante)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('comprovantes')
          .getPublicUrl(uploadData.path)

        comprovante_url = urlData.publicUrl
      }

      // 5. Retornar resultado
      return {
        parcela: parcelaAtualizada as any,
        breakdown: {
          abate_juros: divida.juros - resultado.juros,
          abate_multa: divida.multa - resultado.multa,
          abate_principal: divida.principal - resultado.principal,
          saldo_devedor: resultado.saldoDevedor,
          quitado: resultado.quitado || false,
        },
        comprovante_url,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelas'] })
    },
  })
}

/**
 * Hook para gerar 2ª via de boleto
 */
export function useGerar2Via() {
  const supabase = createClient()

  return useMutation({
    mutationFn: async (parcelaId: number) => {
      // Buscar cobrança existente
      const { data: cobranca, error } = await supabase
        .from('cobranca')
        .select('*')
        .eq('parcela_id', parcelaId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error) throw error
      if (!cobranca) throw new Error('Cobrança não encontrada')

      // Em produção, chamar API do gateway para regenerar boleto
      // Aqui apenas retornamos a cobrança existente

      return {
        ...cobranca,
        url_boleto: cobranca.url_boleto || 'https://gateway.com/boleto/123.pdf',
      }
    },
  })
}

/**
 * Hook para exportar parcelas
 */
export function useExportarParcelas() {
  return useMutation({
    mutationFn: async (input: {
      formato: 'csv' | 'excel'
      filtros?: ParcelaFilters
      incluir_totalizadores?: boolean
    }) => {
      // Em produção, chamar API que gera o arquivo
      // Aqui simulamos retornando uma URL

      const fileName = `parcelas_${Date.now()}.${
        input.formato === 'csv' ? 'csv' : 'xlsx'
      }`

      return {
        url: `/downloads/${fileName}`,
        formato: input.formato,
      }
    },
  })
}

/**
 * Função auxiliar para calcular totalizadores
 */
export function calcularTotalizadores(
  parcelas: Parcela[]
): ParcelaTotalizadores {
  const totalizadores: ParcelaTotalizadores = {
    total_principal: 0,
    total_multa: 0,
    total_juros: 0,
    total_geral: 0,
    quantidade: parcelas.length,
    por_status: {
      pendente: 0,
      emitido: 0,
      pago: 0,
      vencido: 0,
      cancelado: 0,
      estornado: 0,
    },
  }

  for (const parcela of parcelas) {
    const p = parcela as any
    totalizadores.total_principal += p.principal || p.valor_base || 0
    totalizadores.total_multa += p.multa || p.valor_multa || 0
    totalizadores.total_juros += p.juros || p.valor_juros || 0
    totalizadores.total_geral += (p.principal || p.valor_base || 0) + (p.multa || p.valor_multa || 0) + (p.juros || p.valor_juros || 0) - (p.desconto || 0)

    totalizadores.por_status[parcela.status] =
      (totalizadores.por_status[parcela.status] || 0) + 1
  }

  // Arredondar valores
  totalizadores.total_principal = Number(
    totalizadores.total_principal.toFixed(2)
  )
  totalizadores.total_multa = Number(totalizadores.total_multa.toFixed(2))
  totalizadores.total_juros = Number(totalizadores.total_juros.toFixed(2))
  totalizadores.total_geral = Number(totalizadores.total_geral.toFixed(2))

  return totalizadores
}
