'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboardStats } from '@/hooks/useImobiliaria'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils/formatters'
import {
  Building2,
  Home,
  FileText,
  TrendingUp,
  AlertCircle,
  DollarSign,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardStats() {
  const { data: stats, isLoading, error } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center gap-2 p-6">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm text-destructive">
            Erro ao carregar estatísticas. Tente novamente.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!stats) return null

  const statsConfig = [
    {
      title: 'Total de Imóveis',
      value: formatNumber(stats.total_imoveis),
      description: 'Imóveis cadastrados',
      icon: Building2,
      color: 'text-blue-600'
    },
    {
      title: 'Imóveis Disponíveis',
      value: formatNumber(stats.imoveis_disponiveis),
      description: `${formatPercentage(stats.imoveis_disponiveis > 0 ? (stats.imoveis_disponiveis / stats.total_imoveis) * 100 : 0, 0)} do total`,
      icon: Home,
      color: 'text-green-600'
    },
    {
      title: 'Imóveis Ocupados',
      value: formatNumber(stats.imoveis_ocupados),
      description: `Taxa de ocupação: ${formatPercentage(stats.taxa_ocupacao, 1)}`,
      icon: CheckCircle2,
      color: 'text-emerald-600'
    },
    {
      title: 'Contratos Ativos',
      value: formatNumber(stats.total_contratos_ativos),
      description: 'Em vigência',
      icon: FileText,
      color: 'text-indigo-600'
    },
    {
      title: 'Contratos Vencendo',
      value: formatNumber(stats.contratos_vencendo_60_dias),
      description: 'Próximos 60 dias',
      icon: AlertCircle,
      color: stats.contratos_vencendo_60_dias > 0 ? 'text-amber-600' : 'text-gray-600'
    },
    {
      title: 'Receita Mensal',
      value: formatCurrency(stats.receita_mensal_total),
      description: 'Total dos contratos ativos',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Valor Médio Aluguel',
      value: formatCurrency(stats.valor_medio_aluguel),
      description: 'Média dos contratos',
      icon: TrendingUp,
      color: 'text-cyan-600'
    },
    {
      title: 'Taxa de Ocupação',
      value: formatPercentage(stats.taxa_ocupacao, 1),
      description: `${stats.imoveis_ocupados} de ${stats.total_imoveis} imóveis`,
      icon: stats.taxa_ocupacao >= 80 ? CheckCircle2 : XCircle,
      color: stats.taxa_ocupacao >= 80 ? 'text-green-600' : 'text-red-600'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
