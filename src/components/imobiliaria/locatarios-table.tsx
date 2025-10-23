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
import { Edit, Trash2, FileText, Mail, Phone, DollarSign } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function LocatariosTable() {
  const [locatarios, setLocatarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchLocatarios()
  }, [])

  async function fetchLocatarios() {
    try {
      const { data, error } = await supabase
        .from('locatario')
        .select(`
          *,
          pessoa:pessoa(
            *,
            endereco:endereco(*)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setLocatarios(data || [])
    } catch (error) {
      console.error('Erro ao carregar locatários:', error)
      toast.error('Erro ao carregar locatários')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir este locatário?')) return

    try {
      const { error } = await supabase
        .from('locatario')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Locatário excluído com sucesso')
      fetchLocatarios()
    } catch (error) {
      console.error('Erro ao excluir locatário:', error)
      toast.error('Erro ao excluir locatário')
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
    return <div className="text-center py-8">Carregando...</div>
  }

  if (locatarios.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum locatário cadastrado
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
            <TableHead>Renda Mensal</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Contratos Ativos</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locatarios.map((locatario) => (
            <TableRow key={locatario.id}>
              <TableCell className="font-medium">
                {locatario.pessoa?.nome}
              </TableCell>
              <TableCell>
                {locatario.pessoa?.cpf ? (
                  <Badge variant="outline">{locatario.pessoa.cpf}</Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </TableCell>
              <TableCell>
                {locatario.renda_mensal ? (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{formatCurrency(locatario.renda_mensal)}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {locatario.pessoa?.telefone && (
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {locatario.pessoa.telefone}
                    </div>
                  )}
                  {locatario.pessoa?.email && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {locatario.pessoa.email}
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
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(locatario.id)}
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
