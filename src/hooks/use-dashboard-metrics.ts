/**
 * Hook: useDashboardMetrics
 *
 * Busca métricas do dashboard utilizando React Query
 * - Métricas financeiras (receita, inadimplência, MRR)
 * - Taxa de ocupação de imóveis
 * - Contadores (contratos ativos, boletos a vencer)
 */

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface DashboardMetrics {
  receitaMensal: number
  inadimplencia: number
  taxaOcupacao: number
  mrr: number
  contratosAtivos: number
  boletosVencer: number
}

export interface DashboardFilters {
  dataInicio?: Date
  dataFim?: Date
  carteiraId?: string
}

/**
 * Calcula métricas do dashboard a partir dos dados do Supabase
 */
async function fetchDashboardMetrics(filtros?: DashboardFilters): Promise<DashboardMetrics> {
  const supabase = createClient()

  // Data atual para cálculos
  const hoje = new Date()
  const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  const dataInicio = filtros?.dataInicio || primeiroDiaMes
  const dataFim = filtros?.dataFim || hoje

  // 1. CONTRATOS ATIVOS
  let contratosQuery = supabase
    .from('contrato_locacao')
    .select('id, valor', { count: 'exact' })
    .eq('status', 'ativo')

  if (filtros?.carteiraId) {
    contratosQuery = contratosQuery.eq('empresa_id', filtros.carteiraId)
  }

  const { data: contratos, error: contratosError, count: contratosAtivos } = await contratosQuery

  if (contratosError) {
    console.error('Erro ao buscar contratos:', contratosError)
    throw contratosError
  }

  // 2. PARCELAS (RECEITA E INADIMPLÊNCIA)
  let parcelasQuery = supabase
    .from('parcela')
    .select('principal, status, vencimento')
    .gte('competencia', dataInicio.toISOString())
    .lte('competencia', dataFim.toISOString())

  const { data: parcelas, error: parcelasError } = await parcelasQuery

  if (parcelasError) {
    console.error('Erro ao buscar parcelas:', parcelasError)
    throw parcelasError
  }

  // Calcular receita mensal (parcelas pagas)
  const receitaMensal = (parcelas || [])
    .filter(p => p.status === 'pago')
    .reduce((sum, p) => sum + (p.principal || 0), 0)

  // Calcular inadimplência (parcelas vencidas)
  const parcelasVencidas = (parcelas || [])
    .filter(p => p.status === 'vencido')
    .length

  const totalParcelas = (parcelas || []).length
  const inadimplencia = totalParcelas > 0
    ? (parcelasVencidas / totalParcelas) * 100
    : 0

  // 3. BOLETOS A VENCER (próximos 7 dias)
  const proximosDias = new Date()
  proximosDias.setDate(proximosDias.getDate() + 7)

  const { data: boletosVencer, error: boletosError } = await supabase
    .from('parcela')
    .select('id', { count: 'exact' })
    .eq('status', 'pendente')
    .gte('vencimento', hoje.toISOString())
    .lte('vencimento', proximosDias.toISOString())

  const boletosVencerCount = boletosVencer?.length || 0

  // 4. TAXA DE OCUPAÇÃO
  const { data: imoveisTotal, error: imoveisTotalError } = await supabase
    .from('imovel')
    .select('id', { count: 'exact' })

  const { data: imoveisOcupados, error: imoveisOcupadosError } = await supabase
    .from('contrato_locacao')
    .select('imovel_id', { count: 'exact' })
    .eq('status', 'ativo')

  const totalImoveis = imoveisTotal?.length || 1 // Evitar divisão por zero
  const ocupados = imoveisOcupados?.length || 0
  const taxaOcupacao = (ocupados / totalImoveis) * 100

  // 5. MRR (Monthly Recurring Revenue)
  const mrr = (contratos || [])
    .reduce((sum, c) => sum + (c.valor || 0), 0)

  return {
    receitaMensal: Number(receitaMensal.toFixed(2)),
    inadimplencia: Number(inadimplencia.toFixed(1)),
    taxaOcupacao: Number(taxaOcupacao.toFixed(1)),
    mrr: Number(mrr.toFixed(2)),
    contratosAtivos: contratosAtivos || 0,
    boletosVencer: boletosVencerCount
  }
}

/**
 * Hook para buscar métricas do dashboard
 *
 * @param filtros - Filtros opcionais (período, carteira)
 * @returns Métricas do dashboard e estados de loading/erro
 */
export function useDashboardMetrics(filtros?: DashboardFilters) {
  return useQuery({
    queryKey: ['dashboard-metrics', filtros],
    queryFn: () => fetchDashboardMetrics(filtros),
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true,
    retry: 2
  })
}
