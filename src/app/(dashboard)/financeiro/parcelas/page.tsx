/**
 * PÁGINA: FINANCEIRO - PARCELAS
 *
 * Listagem completa de parcelas com filtros, ações e totalizadores
 * Features:
 * - Filtros por status, contrato, período
 * - Emissão de boleto
 * - Baixa manual
 * - Geração de 2ª via
 * - Exportação CSV/Excel
 * - Totalizadores
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ParcelasTable } from '@/components/financeiro/ParcelasTable'
import { BaixaManualDialog } from '@/components/financeiro/BaixaManualDialog'
import { useParcelas, useEmitirBoleto, useGerar2Via, useExportarParcelas } from '@/hooks/use-parcelas'
import type { ParcelaFilters, ParcelaStatus } from '@/types/financeiro'
import { Download, Filter, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export default function ParcelasPage() {
  // Filtros
  const [filters, setFilters] = useState<ParcelaFilters>({
    page: 1,
    limit: 25,
  })

  // Estados do modal
  const [baixaModalOpen, setBaixaModalOpen] = useState(false)
  const [selectedParcelaId, setSelectedParcelaId] = useState<number | null>(null)

  // Queries e Mutations
  const { data: parcelas = [], isLoading, refetch } = useParcelas(filters)
  const emitirBoletoMutation = useEmitirBoleto()
  const gerar2ViaMutation = useGerar2Via()
  const exportarMutation = useExportarParcelas()

  // Parcela selecionada para baixa
  const parcelaSelecionada = selectedParcelaId
    ? parcelas.find((p) => p.id === selectedParcelaId)
    : null

  // Handlers
  const handleFilterChange = (key: keyof ParcelaFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset para primeira página ao filtrar
    }))
  }

  const handleEmitirBoleto = async (parcelaId: number) => {
    try {
      await emitirBoletoMutation.mutateAsync({
        parcela_id: parcelaId,
        gateway: 'asaas', // TODO: permitir seleção de gateway
        enviar_notificacao: true,
        canais_notificacao: ['email'],
      })
      toast.success('Boleto emitido com sucesso')
      refetch()
    } catch (error) {
      toast.error('Erro ao emitir boleto')
    }
  }

  const handleGerar2Via = async (parcelaId: number) => {
    try {
      const result = await gerar2ViaMutation.mutateAsync(parcelaId)
      // Abrir URL do boleto
      if (result.url_boleto) {
        window.open(result.url_boleto, '_blank')
      }
      toast.success('2ª via gerada com sucesso')
    } catch (error) {
      toast.error('Erro ao gerar 2ª via')
    }
  }

  const handleBaixaManual = (parcelaId: number) => {
    setSelectedParcelaId(parcelaId)
    setBaixaModalOpen(true)
  }

  const handleExportar = async (formato: 'csv' | 'excel') => {
    try {
      const result = await exportarMutation.mutateAsync({
        formato,
        filtros: filters,
        incluir_totalizadores: true,
      })
      toast.success(`Exportação ${formato.toUpperCase()} iniciada`)
      // TODO: Fazer download do arquivo
    } catch (error) {
      toast.error('Erro ao exportar')
    }
  }

  const handleLimparFiltros = () => {
    setFilters({
      page: 1,
      limit: 25,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Parcelas</h1>
        <p className="text-muted-foreground">
          Gestão completa de parcelas de contratos de locação
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          <CardDescription>
            Utilize os filtros abaixo para refinar a busca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Filtro por Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status?.[0] || 'todos'}
                onValueChange={(value) =>
                  handleFilterChange(
                    'status',
                    value === 'todos' ? undefined : [value as ParcelaStatus]
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="emitido">Emitido</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por Data Início */}
            <div className="space-y-2">
              <Label>Vencimento (De)</Label>
              <Input
                type="date"
                value={filters.data_inicio || ''}
                onChange={(e) =>
                  handleFilterChange('data_inicio', e.target.value || undefined)
                }
              />
            </div>

            {/* Filtro por Data Fim */}
            <div className="space-y-2">
              <Label>Vencimento (Até)</Label>
              <Input
                type="date"
                value={filters.data_fim || ''}
                onChange={(e) =>
                  handleFilterChange('data_fim', e.target.value || undefined)
                }
              />
            </div>

            {/* Busca por Locatário */}
            <div className="space-y-2">
              <Label>Locatário</Label>
              <Input
                placeholder="Buscar por nome..."
                value={filters.locatario || ''}
                onChange={(e) =>
                  handleFilterChange('locatario', e.target.value || undefined)
                }
              />
            </div>
          </div>

          {/* Ações de Filtro */}
          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLimparFiltros}
            >
              Limpar Filtros
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                />
                Atualizar
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportar('csv')}
                disabled={exportarMutation.isPending}
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportar('excel')}
                disabled={exportarMutation.isPending}
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Parcelas */}
      <Card>
        <CardHeader>
          <CardTitle>
            Parcelas ({parcelas.length} {parcelas.length === 1 ? 'registro' : 'registros'})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ParcelasTable
            parcelas={parcelas}
            onEmitirBoleto={handleEmitirBoleto}
            onGerar2Via={handleGerar2Via}
            onBaixaManual={handleBaixaManual}
            isLoading={isLoading}
            showTotalizadores={true}
          />
        </CardContent>
      </Card>

      {/* Modal de Baixa Manual */}
      <BaixaManualDialog
        open={baixaModalOpen}
        onOpenChange={(open) => {
          setBaixaModalOpen(open)
          if (!open) {
            setSelectedParcelaId(null)
            refetch()
          }
        }}
        parcela={
          parcelaSelecionada
            ? {
                id: parcelaSelecionada.id,
                numero_parcela: parcelaSelecionada.numero_parcela,
                competencia: parcelaSelecionada.competencia,
                valor_total: parcelaSelecionada.valor_total,
                valor_base: parcelaSelecionada.valor_base,
                valor_multa: parcelaSelecionada.valor_multa,
                valor_juros: parcelaSelecionada.valor_juros,
              }
            : null
        }
      />
    </div>
  )
}
