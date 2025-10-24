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
import { Edit, Trash2, Mail, Phone, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { usePessoas, useDeletePessoa } from '@/hooks/useImobiliaria'
import { toast } from 'sonner'
import { maskCPF, maskPhone } from '@/lib/utils/formatters'

export function PessoasTable() {
  // Usa React Query para buscar dados (com cache automático!)
  const { data, isLoading, isError, error } = usePessoas()
  const deleteMutation = useDeletePessoa()

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir esta pessoa?')) return

    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Pessoa excluída com sucesso')
      // React Query invalida o cache automaticamente!
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir pessoa')
    }
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
        Erro ao carregar pessoas: {error?.message}
      </div>
    )
  }

  const pessoas = data?.data || []

  if (pessoas.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma pessoa cadastrada
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Profissão</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Data Nascimento</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pessoas.map((pessoa) => (
            <TableRow key={pessoa.id}>
              <TableCell className="font-medium">{pessoa.nome}</TableCell>
              <TableCell>
                {pessoa.cpf ? (
                  <Badge variant="outline">{maskCPF(pessoa.cpf)}</Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </TableCell>
              <TableCell>
                {(Array.isArray(pessoa.profissao)
                  ? (pessoa.profissao[0] as any)?.descricao
                  : (pessoa.profissao as any)?.descricao) || (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {pessoa.telefone && (
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {maskPhone(pessoa.telefone)}
                    </div>
                  )}
                  {pessoa.email && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {pessoa.email}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {pessoa.data_nascimento
                  ? new Date(pessoa.data_nascimento).toLocaleDateString('pt-BR')
                  : <span className="text-muted-foreground text-sm">N/A</span>
                }
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/imobiliaria/pessoas/${pessoa.id}/editar`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(pessoa.id)}
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
