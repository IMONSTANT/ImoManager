"use client"

import { useEffect, useState } from 'react'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Edit, Trash2, FileText, Mail, Phone, Wallet } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function FiadoresTable() {
  const [fiadores, setFiadores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchFiadores()
  }, [])

  async function fetchFiadores() {
    try {
      const { data, error } = await supabase
        .from('fiador')
        .select(`
          *,
          pessoa:pessoa_id (
            *,
            endereco:endereco_id (*)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setFiadores(data || [])
    } catch (error) {
      console.error('Erro ao carregar fiadores:', error)
      toast.error('Erro ao carregar fiadores')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir este fiador?')) return

    try {
      const { error } = await supabase
        .from('fiador')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Fiador excluído com sucesso')
      fetchFiadores()
    } catch (error) {
      console.error('Erro ao excluir fiador:', error)
      toast.error('Erro ao excluir fiador')
    }
  }

  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Patrimônio Estimado</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Contratos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-8 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-8 w-20" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
            <TableHead>Patrimônio Estimado</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Contratos</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fiadores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum fiador cadastrado
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            fiadores.map((fiador) => (
            <TableRow key={fiador.id}>
              <TableCell className="font-medium">
                {fiador.pessoa?.nome}
              </TableCell>
              <TableCell>
                {fiador.pessoa?.cpf_cnpj ? (
                  <Badge variant="outline">{fiador.pessoa.cpf_cnpj}</Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </TableCell>
              <TableCell>
                {fiador.patrimonio_estimado ? (
                  <div className="flex items-center gap-1">
                    <Wallet className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{formatCurrency(fiador.patrimonio_estimado)}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {fiador.pessoa?.telefone && (
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {fiador.pessoa.telefone}
                    </div>
                  )}
                  {fiador.pessoa?.email && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {fiador.pessoa.email}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">0</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" aria-label="Editar fiador">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(fiador.id)}
                    aria-label="Excluir fiador"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
