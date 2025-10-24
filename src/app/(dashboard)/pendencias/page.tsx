'use client'

import { useState } from 'react'
import { Plus, AlertTriangle, DollarSign, FileText, Wrench, Package, FileSignature, HelpCircle, Clock, CheckCircle, XCircle } from 'lucide-react'
import { usePendencias } from '@/hooks/use-operacional'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { PendenciaStatus, PendenciaTipo } from '@/lib/types/operacional'

export default function PendenciasPage() {
  const [statusFilter, setStatusFilter] = useState<PendenciaStatus | 'all'>('all')
  const [tipoFilter, setTipoFilter] = useState<PendenciaTipo | 'all'>('all')
  const [prioridadeFilter, setPrioridadeFilter] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all')

  const filters = {
    status: statusFilter === 'all' ? undefined : [statusFilter],
    tipo: tipoFilter === 'all' ? undefined : tipoFilter,
    prioridade: prioridadeFilter === 'all' ? undefined : [Number(prioridadeFilter)],
  }

  const { data: pendencias, isLoading } = usePendencias(filters)

  const getStatusBadge = (status: PendenciaStatus) => {
    const config = {
      aberta: { label: 'Aberta', variant: 'destructive' as const, icon: AlertTriangle },
      em_andamento: { label: 'Em Andamento', variant: 'warning' as const, icon: Clock },
      resolvida: { label: 'Resolvida', variant: 'success' as const, icon: CheckCircle },
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

  const getTipoConfig = (tipo: PendenciaTipo) => {
    const config = {
      financeira: { label: 'Financeira', icon: DollarSign, color: 'text-green-600' },
      documental: { label: 'Documental', icon: FileText, color: 'text-blue-600' },
      manutencao: { label: 'Manutenção', icon: Wrench, color: 'text-orange-600' },
      entrega: { label: 'Entrega', icon: Package, color: 'text-purple-600' },
      contratual: { label: 'Contratual', icon: FileSignature, color: 'text-indigo-600' },
      outro: { label: 'Outro', icon: HelpCircle, color: 'text-gray-600' },
    }
    return config[tipo]
  }

  const getTipoBadge = (tipo: PendenciaTipo) => {
    const { label, icon: Icon, color } = getTipoConfig(tipo)
    return (
      <Badge variant="outline" className="gap-1">
        <Icon className={`h-3 w-3 ${color}`} />
        {label}
      </Badge>
    )
  }

  const getPrioridadeBadge = (prioridade: number) => {
    const config = {
      1: { label: 'Muito Baixa', variant: 'outline' as const },
      2: { label: 'Baixa', variant: 'secondary' as const },
      3: { label: 'Média', variant: 'default' as const },
      4: { label: 'Alta', variant: 'warning' as const },
      5: { label: 'Crítica', variant: 'destructive' as const },
    }
    const { label, variant } = config[prioridade as keyof typeof config] || config[3]
    return <Badge variant={variant}>{label}</Badge>
  }

  const formatCurrency = (value?: number) => {
    if (!value) return '-'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pendências</h2>
          <p className="text-muted-foreground">Gestão de pendências e problemas</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Pendência
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 flex-wrap">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="aberta">Aberta</SelectItem>
              <SelectItem value="em_andamento">Em Andamento</SelectItem>
              <SelectItem value="resolvida">Resolvida</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tipoFilter} onValueChange={(v) => setTipoFilter(v as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="financeira">Financeira</SelectItem>
              <SelectItem value="documental">Documental</SelectItem>
              <SelectItem value="manutencao">Manutenção</SelectItem>
              <SelectItem value="entrega">Entrega</SelectItem>
              <SelectItem value="contratual">Contratual</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>

          <Select value={prioridadeFilter} onValueChange={(v) => setPrioridadeFilter(v as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Prioridades</SelectItem>
              <SelectItem value="5">Crítica</SelectItem>
              <SelectItem value="4">Alta</SelectItem>
              <SelectItem value="3">Média</SelectItem>
              <SelectItem value="2">Baixa</SelectItem>
              <SelectItem value="1">Muito Baixa</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pendências Registradas</CardTitle>
          <CardDescription>{pendencias?.length || 0} pendência(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : pendencias && pendencias.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Valor Estimado</TableHead>
                  <TableHead>Valor Real</TableHead>
                  <TableHead>Data Limite</TableHead>
                  <TableHead>Criado Em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendencias.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{getPrioridadeBadge(p.prioridade)}</TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <div className="font-medium">{p.titulo}</div>
                        <div className="text-xs text-muted-foreground truncate">{p.descricao}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getTipoBadge(p.tipo)}</TableCell>
                    <TableCell>{getStatusBadge(p.status)}</TableCell>
                    <TableCell>{p.contrato?.numero_contrato || '-'}</TableCell>
                    <TableCell>
                      {p.imovel?.endereco
                        ? `${p.imovel.endereco.logradouro}, ${p.imovel.endereco.numero}`
                        : '-'}
                    </TableCell>
                    <TableCell>{formatCurrency(p.valor_estimado)}</TableCell>
                    <TableCell>{formatCurrency(p.valor_real)}</TableCell>
                    <TableCell>
                      {p.data_limite
                        ? format(new Date(p.data_limite), 'dd/MM/yyyy', { locale: ptBR })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(p.criado_em), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">Nenhuma pendência encontrada</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
