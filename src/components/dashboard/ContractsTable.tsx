/**
 * Componente: ContractsTable
 *
 * Tabela de contratos ativos com informações principais
 */

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FileText, Eye, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Contrato {
  id: string
  codigo_contrato: string
  imovel: {
    endereco_completo: string
    tipo: string
  }
  locatario: {
    nome: string
  }
  valor_aluguel: number
  data_inicio: string
  data_fim: string
  status: string
}

/**
 * Busca contratos ativos
 */
async function fetchContratos(limit = 10): Promise<Contrato[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('contrato_locacao')
    .select(`
      id,
      codigo_contrato,
      valor_aluguel,
      data_inicio,
      data_fim,
      status,
      imovel:imovel_id (
        endereco_completo,
        tipo:tipo_imovel_id (nome)
      ),
      locatario:locatario_id (
        pessoa:pessoa_id (nome)
      )
    `)
    .eq('status', 'ativo')
    .order('data_inicio', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Erro ao buscar contratos:', error)
    throw error
  }

  return data as any
}

/**
 * Formata data DD/MM/YYYY
 */
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR')
}

/**
 * Formata moeda BRL
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

/**
 * Retorna badge colorido baseado no status
 */
function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    ativo: 'default',
    pendente: 'secondary',
    encerrado: 'outline',
    cancelado: 'destructive',
    renovado: 'outline'
  }

  return (
    <Badge variant={variants[status] || 'outline'}>
      {status}
    </Badge>
  )
}

/**
 * Skeleton de linha
 */
function RowSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[90px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
    </TableRow>
  )
}

export function ContractsTable({ limit = 10 }: { limit?: number }) {
  const { data: contratos, isLoading, isError, error } = useQuery({
    queryKey: ['contratos-ativos', limit],
    queryFn: () => fetchContratos(limit),
    staleTime: 1000 * 60 * 5 // 5 minutos
  })

  if (isError) {
    return (
      <div className="rounded-md border border-destructive/50 p-4">
        <p className="text-sm text-destructive">
          Erro ao carregar contratos: {error?.message || 'Erro desconhecido'}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>
          {contratos && contratos.length > 0
            ? `${contratos.length} contratos ativos`
            : 'Nenhum contrato encontrado'}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Imóvel</TableHead>
            <TableHead>Locatário</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vigência</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <>
              {[...Array(5)].map((_, i) => (
                <RowSkeleton key={i} />
              ))}
            </>
          )}

          {contratos && contratos.map((contrato: any) => (
            <TableRow key={contrato.id}>
              <TableCell className="font-medium">
                {contrato.codigo_contrato}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">{contrato.imovel?.endereco_completo || 'N/A'}</span>
                  <span className="text-xs text-muted-foreground">
                    {contrato.imovel?.tipo?.nome || 'N/A'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {contrato.locatario?.pessoa?.nome || 'N/A'}
              </TableCell>
              <TableCell>
                {formatCurrency(contrato.valor_aluguel)}
              </TableCell>
              <TableCell>
                <div className="flex flex-col text-xs">
                  <span>{formatDate(contrato.data_inicio)}</span>
                  <span className="text-muted-foreground">
                    até {formatDate(contrato.data_fim)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={contrato.status} />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      Ver contrato
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      Emitir 2ª via
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
