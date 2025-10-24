"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, FileText, Calendar, DollarSign, Loader2 } from 'lucide-react'
import { useContratos, useDeleteContrato } from '@/hooks/useImobiliaria'
import { toast } from 'sonner'
import { StatusContrato } from '@/types/imobiliaria'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils/formatters'

export function ContratosTable() {
  // Usa React Query para buscar dados (com cache automático!)
  const { data, isLoading, isError, error } = useContratos()
  const deleteMutation = useDeleteContrato()

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir este contrato?')) return

    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Contrato excluído com sucesso')
      // React Query invalida o cache automaticamente!
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir contrato')
    }
  }

  const getStatusColor = (status: StatusContrato) => {
    const colors = {
      ativo: 'bg-green-500',
      pendente: 'bg-yellow-500',
      encerrado: 'bg-gray-500',
      cancelado: 'bg-red-500',
      renovado: 'bg-blue-500',
    }
    return colors[status] || 'bg-gray-500'
  }

  const getStatusLabel = (status: StatusContrato) => {
    const labels = {
      ativo: 'Ativo',
      pendente: 'Pendente',
      encerrado: 'Encerrado',
      cancelado: 'Cancelado',
      renovado: 'Renovado',
    }
    return labels[status] || status
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-destructive">
        Erro ao carregar contratos: {error?.message}
      </div>
    )
  }

  const contratos = data?.data || []

  if (contratos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum contrato cadastrado
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nº Contrato</TableHead>
            <TableHead>Imóvel</TableHead>
            <TableHead>Locatário</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contratos.map((contrato: any) => (
            <TableRow key={contrato.id}>
              <TableCell className="font-medium">
                {contrato.numero_contrato ? (
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {contrato.numero_contrato}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">S/N</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {contrato.imovel?.codigo_imovel || 'N/A'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {contrato.imovel?.endereco?.logradouro}, {contrato.imovel?.endereco?.numero}
                  </span>
                </div>
              </TableCell>
              <TableCell>{contrato.locatario?.pessoa?.nome || 'N/A'}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {formatCurrency(contrato.valor)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {new Date(contrato.data_inicio_contrato).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    até {new Date(contrato.data_fim_contrato).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(contrato.status)}>
                  {getStatusLabel(contrato.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/imobiliaria/contratos/${contrato.id}/editar`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(contrato.id)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
