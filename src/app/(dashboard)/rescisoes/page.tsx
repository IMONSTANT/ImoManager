'use client'

import { useState } from 'react'
import { Plus, FileText, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
import { useRescisoes, useCriarRescisao } from '@/hooks/use-operacional'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { RescisaoStatus, RescisaoTipo } from '@/lib/types/operacional'

export default function RescisoesPage() {
  const [statusFilter, setStatusFilter] = useState<RescisaoStatus | 'all'>('all')
  const filters = { status: statusFilter === 'all' ? undefined : [statusFilter] }
  const { data: rescisoes, isLoading } = useRescisoes(filters)

  const getStatusBadge = (status: RescisaoStatus) => {
    const config = {
      solicitada: { label: 'Solicitada', variant: 'secondary' as const, icon: Clock },
      em_analise: { label: 'Em Análise', variant: 'default' as const, icon: FileText },
      aprovada: { label: 'Aprovada', variant: 'default' as const, icon: CheckCircle },
      concluida: { label: 'Concluída', variant: 'success' as const, icon: CheckCircle },
      cancelada: { label: 'Cancelada', variant: 'destructive' as const, icon: XCircle },
    }
    const { label, variant, icon: Icon } = config[status]
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  const getTipoLabel = (tipo: RescisaoTipo) => {
    const labels = {
      normal: 'Normal',
      antecipada_locador: 'Antecipada (Locador)',
      antecipada_locatario: 'Antecipada (Locatário)',
      judicial: 'Judicial',
    }
    return labels[tipo]
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rescisões</h2>
          <p className="text-muted-foreground">Controle de rescisões contratuais</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Rescisão
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="solicitada">Solicitada</SelectItem>
              <SelectItem value="em_analise">Em Análise</SelectItem>
              <SelectItem value="aprovada">Aprovada</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rescisões Registradas</CardTitle>
          <CardDescription>{rescisoes?.length || 0} rescisão(ões)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : rescisoes && rescisoes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Locatário</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Solicitação</TableHead>
                  <TableHead>Saída Desejada</TableHead>
                  <TableHead>Pendências</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rescisoes.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.contrato?.numero_contrato}</TableCell>
                    <TableCell>{r.contrato?.locatario?.pessoa.nome}</TableCell>
                    <TableCell>{getTipoLabel(r.tipo)}</TableCell>
                    <TableCell>{getStatusBadge(r.status)}</TableCell>
                    <TableCell>{format(new Date(r.data_solicitacao), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                    <TableCell>{format(new Date(r.data_desejada_saida), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                    <TableCell>
                      {r.tem_pendencias && (
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
            <div className="text-center py-12">Nenhuma rescisão encontrada</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
