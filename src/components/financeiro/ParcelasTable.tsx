/**
 * PARCELAS TABLE COMPONENT
 *
 * Tabela de listagem de parcelas com ações
 * Exibe: Contrato, Locatário, Competência, Vencimento, Valores, Status, Ações
 */

'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge, getParcelaStatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Download,
  DollarSign,
  Eye,
  RefreshCw,
} from 'lucide-react'
import type { Parcela, ParcelaTotalizadores } from '@/types/financeiro'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { calcularTotalizadores } from '@/hooks/use-parcelas'

interface ParcelasTableProps {
  parcelas: Parcela[]
  onEmitirBoleto?: (parcelaId: number) => void
  onGerar2Via?: (parcelaId: number) => void
  onBaixaManual?: (parcelaId: number) => void
  onVerDetalhes?: (parcelaId: number) => void
  isLoading?: boolean
  showTotalizadores?: boolean
}

export function ParcelasTable({
  parcelas,
  onEmitirBoleto,
  onGerar2Via,
  onBaixaManual,
  onVerDetalhes,
  isLoading = false,
  showTotalizadores = true,
}: ParcelasTableProps) {
  const [selectedParcela, setSelectedParcela] = useState<number | null>(null)

  // Calcular totalizadores
  const totalizadores = showTotalizadores
    ? calcularTotalizadores(parcelas)
    : null

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
    } catch {
      return '-'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">
          Carregando parcelas...
        </span>
      </div>
    )
  }

  if (parcelas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Nenhuma parcela encontrada</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Não há parcelas para exibir com os filtros selecionados.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contrato</TableHead>
              <TableHead>Locatário</TableHead>
              <TableHead>Competência</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead className="text-right">Valor Base</TableHead>
              <TableHead className="text-right">Multa</TableHead>
              <TableHead className="text-right">Juros</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parcelas.map((parcela) => {
              const statusBadge = getParcelaStatusBadge(parcela.status)

              return (
                <TableRow
                  key={parcela.id}
                  className={
                    selectedParcela === parcela.id ? 'bg-muted/50' : ''
                  }
                >
                  <TableCell className="font-medium">
                    {parcela.contrato?.numero_contrato || '-'}
                  </TableCell>
                  <TableCell>
                    {parcela.contrato?.locatario?.pessoa?.nome || '-'}
                  </TableCell>
                  <TableCell>{parcela.competencia}</TableCell>
                  <TableCell>{formatDate(parcela.vencimento)}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(parcela.valor_base)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(parcela.valor_multa)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(parcela.valor_juros)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(parcela.valor_total)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      variant={statusBadge.variant}
                      label={statusBadge.label}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Emitir boleto (apenas pendente) */}
                      {parcela.status === 'pendente' && onEmitirBoleto && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEmitirBoleto(parcela.id)}
                          title="Emitir Boleto"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}

                      {/* Gerar 2ª via (emitido ou vencido) */}
                      {(parcela.status === 'emitido' ||
                        parcela.status === 'vencido') &&
                        onGerar2Via && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onGerar2Via(parcela.id)}
                            title="Gerar 2ª Via"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}

                      {/* Baixa manual */}
                      {parcela.status !== 'pago' &&
                        parcela.status !== 'cancelado' &&
                        onBaixaManual && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onBaixaManual(parcela.id)}
                            title="Baixa Manual"
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        )}

                      {/* Ver detalhes */}
                      {onVerDetalhes && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onVerDetalhes(parcela.id)}
                          title="Ver Detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Totalizadores */}
      {showTotalizadores && totalizadores && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <h3 className="mb-3 text-sm font-semibold">Totalizadores</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div>
              <p className="text-xs text-muted-foreground">Quantidade</p>
              <p className="text-lg font-semibold">
                {totalizadores.quantidade}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Principal</p>
              <p className="text-lg font-semibold">
                {formatCurrency(totalizadores.total_principal)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Multa</p>
              <p className="text-lg font-semibold text-orange-600">
                {formatCurrency(totalizadores.total_multa)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Juros</p>
              <p className="text-lg font-semibold text-orange-600">
                {formatCurrency(totalizadores.total_juros)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Geral</p>
              <p className="text-xl font-bold">
                {formatCurrency(totalizadores.total_geral)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
