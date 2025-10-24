/**
 * PÁGINA: FINANCEIRO - COBRANÇAS
 *
 * Listagem de boletos/PIX emitidos com ações e detalhes
 * Features:
 * - Filtros por gateway, status, período
 * - Copiar linha digitável / QR Code PIX
 * - Cancelar cobrança
 * - Reenviar boleto
 * - Download de PDF
 * - Detalhes de webhook
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge, getCobrancaStatusBadge } from '@/components/ui/status-badge'
import {
  useCobrancas,
  useCancelarCobranca,
  useReenviarBoleto,
  useCopiarLinhaDigitavel,
  useCopiarQRCode,
  useBaixarBoleto,
  formatarLinhaDigitavel,
} from '@/hooks/use-cobrancas'
import type { CobrancaFilters, GatewayPagamento, CobrancaStatus } from '@/types/financeiro'
import {
  Copy,
  Download,
  Ban,
  Send,
  Eye,
  CheckCircle2,
  RefreshCw,
  Filter,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function CobrancasPage() {
  // Filtros
  const [filters, setFilters] = useState<CobrancaFilters>({
    page: 1,
    limit: 25,
  })

  // Queries e Mutations
  const { data: cobrancas = [], isLoading, refetch } = useCobrancas(filters)
  const cancelarMutation = useCancelarCobranca()
  const reenviarMutation = useReenviarBoleto()
  const copiarLinhaMutation = useCopiarLinhaDigitavel()
  const copiarQRMutation = useCopiarQRCode()
  const baixarMutation = useBaixarBoleto()

  // Handlers
  const handleFilterChange = (key: keyof CobrancaFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }))
  }

  const handleCopiarLinha = (linhaDigitavel: string) => {
    copiarLinhaMutation.mutate(linhaDigitavel)
  }

  const handleCopiarQR = (qrcode: string) => {
    copiarQRMutation.mutate(qrcode)
  }

  const handleBaixarPDF = (url: string) => {
    baixarMutation.mutate(url)
  }

  const handleCancelar = async (cobrancaId: number) => {
    const motivo = prompt('Informe o motivo do cancelamento:')
    if (!motivo) return

    await cancelarMutation.mutateAsync({
      cobranca_id: cobrancaId,
      motivo,
    })
    refetch()
  }

  const handleReenviar = async (cobrancaId: number) => {
    // TODO: Abrir modal para selecionar canal e destinatário
    await reenviarMutation.mutateAsync({
      cobranca_id: cobrancaId,
      canal: 'email',
      destinatario: 'exemplo@email.com',
    })
    refetch()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
    } catch {
      return '-'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cobranças</h1>
        <p className="text-muted-foreground">
          Gestão de boletos e PIX emitidos
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Gateway */}
            <div className="space-y-2">
              <Label>Gateway</Label>
              <Select
                value={filters.gateway?.[0] || 'todos'}
                onValueChange={(value) =>
                  handleFilterChange(
                    'gateway',
                    value === 'todos' ? undefined : [value as GatewayPagamento]
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="asaas">Asaas</SelectItem>
                  <SelectItem value="gerencianet">Gerencianet</SelectItem>
                  <SelectItem value="iugu">Iugu</SelectItem>
                  <SelectItem value="pagarme">Pagar.me</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status?.[0] || 'todos'}
                onValueChange={(value) =>
                  handleFilterChange(
                    'status',
                    value === 'todos' ? undefined : [value as CobrancaStatus]
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="emitida">Aguardando Pagamento</SelectItem>
                  <SelectItem value="paga">Confirmada</SelectItem>
                  <SelectItem value="vencida">Atrasada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data Emissão */}
            <div className="space-y-2">
              <Label>Emissão (De)</Label>
              <Input
                type="date"
                value={filters.data_emissao_inicio || ''}
                onChange={(e) =>
                  handleFilterChange('data_emissao_inicio', e.target.value || undefined)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Emissão (Até)</Label>
              <Input
                type="date"
                value={filters.data_emissao_fim || ''}
                onChange={(e) =>
                  handleFilterChange('data_emissao_fim', e.target.value || undefined)
                }
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Cobranças */}
      <Card>
        <CardHeader>
          <CardTitle>
            Cobranças ({cobrancas.length} {cobrancas.length === 1 ? 'registro' : 'registros'})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : cobrancas.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Nenhuma cobrança encontrada
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Nosso Número</TableHead>
                    <TableHead>Linha Digitável</TableHead>
                    <TableHead>Data Emissão</TableHead>
                    <TableHead>Data Pagamento</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cobrancas.map((cobranca) => {
                    const statusBadge = getCobrancaStatusBadge(cobranca.status)
                    const isConciliada = cobranca.status === 'paga' && cobranca.data_pagamento

                    return (
                      <TableRow key={cobranca.id}>
                        <TableCell className="font-mono text-sm">
                          #{cobranca.id}
                        </TableCell>
                        <TableCell className="capitalize">{cobranca.gateway}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {cobranca.nosso_numero || '-'}
                        </TableCell>
                        <TableCell>
                          {cobranca.linha_digitavel ? (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs">
                                {formatarLinhaDigitavel(cobranca.linha_digitavel).substring(0, 20)}...
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopiarLinha(cobranca.linha_digitavel!)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : cobranca.qrcode_pix ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopiarQR(cobranca.qrcode_pix!)}
                            >
                              <Copy className="mr-2 h-3 w-3" />
                              Copiar PIX
                            </Button>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>{formatDate(cobranca.data_emissao)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {formatDate(cobranca.data_pagamento)}
                            {isConciliada && (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(cobranca.valor)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            variant={statusBadge.variant}
                            label={statusBadge.label}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Baixar PDF */}
                            {cobranca.url_boleto && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleBaixarPDF(cobranca.url_boleto!)}
                                title="Baixar PDF"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}

                            {/* Reenviar */}
                            {(cobranca.status === 'emitida' || cobranca.status === 'vencida') && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleReenviar(cobranca.id)}
                                title="Reenviar"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}

                            {/* Cancelar */}
                            {cobranca.status === 'emitida' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCancelar(cobranca.id)}
                                title="Cancelar"
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            )}

                            {/* Ver detalhes */}
                            <Button size="sm" variant="ghost" title="Ver Detalhes">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
