'use client'

import { useState } from 'react'
import { Plus, Calendar, CheckCircle, XCircle, Clock, FileText, AlertTriangle } from 'lucide-react'
import { useVistorias } from '@/hooks/use-operacional'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { VistoriaStatus, VistoriaTipo } from '@/lib/types/operacional'

export default function VistoriasPage() {
  const [statusFilter, setStatusFilter] = useState<VistoriaStatus | 'all'>('all')
  const [tipoFilter, setTipoFilter] = useState<VistoriaTipo | 'all'>('all')

  const filters = {
    status: statusFilter === 'all' ? undefined : [statusFilter],
    tipo: tipoFilter === 'all' ? undefined : tipoFilter,
  }

  const { data: vistorias, isLoading } = useVistorias(filters)

  const getStatusBadge = (status: VistoriaStatus) => {
    const config = {
      agendada: { label: 'Agendada', variant: 'secondary' as const, icon: Calendar },
      realizada: { label: 'Realizada', variant: 'default' as const, icon: FileText },
      aprovada: { label: 'Aprovada', variant: 'success' as const, icon: CheckCircle },
      reprovada: { label: 'Reprovada', variant: 'destructive' as const, icon: XCircle },
      cancelada: { label: 'Cancelada', variant: 'outline' as const, icon: XCircle },
    }
    const { label, variant, icon: Icon } = config[status]
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  const getTipoLabel = (tipo: VistoriaTipo) => {
    const labels = {
      entrada: 'Entrada',
      saida: 'Saída',
      periodica: 'Periódica',
      manutencao: 'Manutenção',
    }
    return labels[tipo]
  }

  const getTipoBadgeVariant = (tipo: VistoriaTipo) => {
    const variants = {
      entrada: 'default' as const,
      saida: 'secondary' as const,
      periodica: 'outline' as const,
      manutencao: 'warning' as const,
    }
    return variants[tipo]
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vistorias</h2>
          <p className="text-muted-foreground">Gestão de vistorias de imóveis</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agendar Vistoria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Select value={tipoFilter} onValueChange={(v) => setTipoFilter(v as any)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="entrada">Entrada</SelectItem>
              <SelectItem value="saida">Saída</SelectItem>
              <SelectItem value="periodica">Periódica</SelectItem>
              <SelectItem value="manutencao">Manutenção</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="agendada">Agendada</SelectItem>
              <SelectItem value="realizada">Realizada</SelectItem>
              <SelectItem value="aprovada">Aprovada</SelectItem>
              <SelectItem value="reprovada">Reprovada</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vistorias Registradas</CardTitle>
          <CardDescription>{vistorias?.length || 0} vistoria(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : vistorias && vistorias.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Locatário</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Agendada</TableHead>
                  <TableHead>Data Realizada</TableHead>
                  <TableHead>Vistoriador</TableHead>
                  <TableHead>Pendências</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vistorias.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>
                      {v.imovel?.endereco?.logradouro}, {v.imovel?.endereco?.numero}
                    </TableCell>
                    <TableCell>{v.contrato?.numero_contrato}</TableCell>
                    <TableCell>{v.contrato?.locatario?.pessoa.nome}</TableCell>
                    <TableCell>
                      <Badge variant={getTipoBadgeVariant(v.tipo)}>
                        {getTipoLabel(v.tipo)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(v.status)}</TableCell>
                    <TableCell>
                      {format(new Date(v.data_agendada), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {v.data_realizada
                        ? format(new Date(v.data_realizada), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                        : '-'}
                    </TableCell>
                    <TableCell>{v.vistoriador_nome || '-'}</TableCell>
                    <TableCell>
                      {v.tem_pendencias && (
                        <Badge variant="warning">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Pendências
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">Nenhuma vistoria encontrada</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
