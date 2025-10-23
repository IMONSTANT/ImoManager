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
import { Edit, Trash2, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { PessoaCompleta } from '@/types/imobiliaria'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function PessoasTable() {
  const [pessoas, setPessoas] = useState<PessoaCompleta[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchPessoas()
  }, [])

  async function fetchPessoas() {
    try {
      const { data, error } = await supabase
        .from('pessoa')
        .select(`
          *,
          profissao:profissao(descricao),
          endereco:endereco(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setPessoas(data || [])
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error)
      toast.error('Erro ao carregar pessoas')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir esta pessoa?')) return

    try {
      const { error } = await supabase
        .from('pessoa')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Pessoa excluída com sucesso')
      fetchPessoas()
    } catch (error) {
      console.error('Erro ao excluir pessoa:', error)
      toast.error('Erro ao excluir pessoa')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>
  }

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
                  <Badge variant="outline">{pessoa.cpf}</Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </TableCell>
              <TableCell>
                {pessoa.profissao?.descricao || (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {pessoa.telefone && (
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {pessoa.telefone}
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
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
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
