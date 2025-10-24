'use client'

import { useState } from 'react'
import { Plus, Key, ArrowUpCircle, ArrowDownCircle, Copy, AlertCircle, RefreshCw } from 'lucide-react'
import { useMovimentacoesChaves } from '@/hooks/use-operacional'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { ChaveMovimentacaoTipo } from '@/lib/types/operacional'

export default function ChavesPage() {
  const [tipoFilter, setTipoFilter] = useState<ChaveMovimentacaoTipo | 'all'>('all')

  const filters = {
    tipo: tipoFilter === 'all' ? undefined : [tipoFilter],
  }

  const { data: movimentacoes, isLoading } = useMovimentacoesChaves(filters)

  const getTipoConfig = (tipo: ChaveMovimentacaoTipo) => {
    const config = {
      entrega: {
        label: 'Entrega',
        variant: 'success' as const,
        icon: ArrowDownCircle,
      },
      devolucao: {
        label: 'Devolução',
        variant: 'default' as const,
        icon: ArrowUpCircle,
      },
      copia: {
        label: 'Cópia',
        variant: 'secondary' as const,
        icon: Copy,
      },
      perda: {
        label: 'Perda',
        variant: 'destructive' as const,
        icon: AlertCircle,
      },
      reposicao: {
        label: 'Reposição',
        variant: 'warning' as const,
        icon: RefreshCw,
      },
    }
    return config[tipo]
  }

  const getTipoBadge = (tipo: ChaveMovimentacaoTipo) => {
    const { label, variant, icon: Icon } = getTipoConfig(tipo)
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Controle de Chaves</h2>
          <p className="text-muted-foreground">Movimentação e rastreamento de chaves</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Movimentação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={tipoFilter} onValueChange={(v) => setTipoFilter(v as any)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tipo de Movimentação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Movimentações</SelectItem>
              <SelectItem value="entrega">Entrega</SelectItem>
              <SelectItem value="devolucao">Devolução</SelectItem>
              <SelectItem value="copia">Cópia</SelectItem>
              <SelectItem value="perda">Perda</SelectItem>
              <SelectItem value="reposicao">Reposição</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Movimentações Registradas</CardTitle>
          <CardDescription>{movimentacoes?.length || 0} movimentação(ões)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : movimentacoes && movimentacoes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Pessoa</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Tipo Pessoa</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Condição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movimentacoes.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      {format(new Date(m.data_movimentacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </TableCell>
                    <TableCell>{getTipoBadge(m.tipo)}</TableCell>
                    <TableCell>
                      {m.imovel?.endereco?.logradouro}, {m.imovel?.endereco?.numero}
                    </TableCell>
                    <TableCell>{m.contrato?.numero_contrato}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Key className="h-3 w-3" />
                        {m.quantidade_chaves}
                      </div>
                    </TableCell>
                    <TableCell>{m.pessoa_nome}</TableCell>
                    <TableCell>{m.pessoa_cpf || '-'}</TableCell>
                    <TableCell>
                      {m.pessoa_tipo ? (
                        <Badge variant="outline" className="text-xs">
                          {m.pessoa_tipo}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {m.descricao_chaves || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {m.condicao_chaves || '-'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">Nenhuma movimentação encontrada</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
