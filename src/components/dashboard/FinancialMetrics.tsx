/**
 * Componente: FinancialMetrics
 *
 * Exibe cards com métricas financeiras principais do dashboard
 * - Receita Mensal
 * - Inadimplência
 * - Taxa de Ocupação
 * - MRR (Monthly Recurring Revenue)
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, TrendingDown, DollarSign, Home, AlertCircle, Activity } from 'lucide-react'
import type { DashboardMetrics } from '@/hooks/use-dashboard-metrics'

interface FinancialMetricsProps {
  metrics: DashboardMetrics
  isLoading?: boolean
}

/**
 * Formata valor monetário (BRL)
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

/**
 * Formata percentual
 */
function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

/**
 * Retorna cor baseada no valor de inadimplência
 */
function getInadimplenciaColor(value: number): string {
  if (value >= 10) return 'text-red-600 dark:text-red-400'
  if (value >= 5) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-green-600 dark:text-green-400'
}

/**
 * Retorna cor baseada na taxa de ocupação
 */
function getOcupacaoColor(value: number): string {
  if (value >= 90) return 'text-green-600 dark:text-green-400'
  if (value >= 70) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

/**
 * Skeleton para loading
 */
function MetricSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[140px]" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[100px] mb-2" />
        <Skeleton className="h-3 w-[160px]" />
      </CardContent>
    </Card>
  )
}

export function FinancialMetrics({ metrics, isLoading = false }: FinancialMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-testid="financial-metrics">
      {/* Card: Receita Mensal */}
      <Card data-testid="receita-mensal">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Receita Mensal
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(metrics.receitaMensal)}
          </div>
          <p className="text-xs text-muted-foreground">
            Pagamentos recebidos no mês
          </p>
        </CardContent>
      </Card>

      {/* Card: Inadimplência */}
      <Card data-testid="inadimplencia">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Inadimplência
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getInadimplenciaColor(metrics.inadimplencia)}`}>
            {formatPercentage(metrics.inadimplencia)}
          </div>
          <p className="text-xs text-muted-foreground">
            Parcelas em atraso
          </p>
        </CardContent>
      </Card>

      {/* Card: Taxa de Ocupação */}
      <Card data-testid="taxa-ocupacao">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Taxa de Ocupação
          </CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getOcupacaoColor(metrics.taxaOcupacao)}`}>
            {formatPercentage(metrics.taxaOcupacao)}
          </div>
          <p className="text-xs text-muted-foreground">
            Imóveis com contrato ativo
          </p>
        </CardContent>
      </Card>

      {/* Card: MRR */}
      <Card data-testid="mrr">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            MRR
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(metrics.mrr)}
          </div>
          <p className="text-xs text-muted-foreground">
            Receita recorrente mensal
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
