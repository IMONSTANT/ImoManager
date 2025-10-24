/**
 * Página: Dashboard Principal
 *
 * Dashboard com métricas, gráficos e informações principais do sistema
 */

'use client'

import { useDashboardMetrics } from '@/hooks/use-dashboard-metrics'
import { FinancialMetrics } from '@/components/dashboard/FinancialMetrics'
import { ContractsTable } from '@/components/dashboard/ContractsTable'
import { UpcomingPayments } from '@/components/dashboard/UpcomingPayments'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { RefreshCcw, Filter, Download } from 'lucide-react'
import { useState } from 'react'

export default function DashboardPage() {
  const [filtros, setFiltros] = useState({})

  const {
    data: metrics,
    isLoading,
    isError,
    error,
    refetch
  } = useDashboardMetrics(filtros)

  const handleRefresh = () => {
    refetch()
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Erro ao carregar dashboard</CardTitle>
            <CardDescription>
              {error?.message || 'Ocorreu um erro desconhecido'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRefresh} variant="outline" className="w-full">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Visão geral do sistema imobiliário
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Financeiras */}
      <FinancialMetrics
        metrics={metrics || {
          receitaMensal: 0,
          inadimplencia: 0,
          taxaOcupacao: 0,
          mrr: 0,
          contratosAtivos: 0,
          boletosVencer: 0
        }}
        isLoading={isLoading}
      />

      {/* Tabs */}
      <Tabs defaultValue="visao-geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="contratos">Contratos</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="imoveis">Imóveis</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Contratos Ativos */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Contratos Ativos</CardTitle>
                <CardDescription>
                  Últimos contratos vigentes no sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ContractsTable limit={5} />
              </CardContent>
            </Card>

            {/* Boletos a Vencer */}
            <div className="col-span-3">
              <UpcomingPayments />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contratos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todos os Contratos</CardTitle>
              <CardDescription>
                Lista completa de contratos cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContractsTable limit={20} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestão Financeira</CardTitle>
              <CardDescription>
                Parcelas, cobranças e repasses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Módulo financeiro em desenvolvimento
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="imoveis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Imóveis</CardTitle>
              <CardDescription>
                Cadastro e ocupação de imóveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Módulo de imóveis em desenvolvimento
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
