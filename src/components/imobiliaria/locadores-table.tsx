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
import { Edit, Trash2, Building2, Mail, Phone } from 'lucide-react'
import { LocadorCompleto } from '@/types/imobiliaria'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function LocadoresTable() {
  const [locadores, setLocadores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchLocadores()
  }, [])

  async function fetchLocadores() {
    try {
      const { data, error } = await supabase
        .from('locador')
        .select(`
          *,
          pessoa:pessoa(
            *,
            endereco:endereco(*)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setLocadores(data || [])
    } catch (error) {
      console.error('Erro ao carregar locadores:', error)
      toast.error('Erro ao carregar locadores')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir este locador?')) return

    try {
      const { error } = await supabase
        .from('locador')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Locador excluído com sucesso')
      fetchLocadores()
    } catch (error) {
      console.error('Erro ao excluir locador:', error)
      toast.error('Erro ao excluir locador')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>
  }

  if (locadores.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum locador cadastrado
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>CPF/CNPJ</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Imóveis</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locadores.map((locador) => (
            <TableRow key={locador.id}>
              <TableCell className="font-medium">
                {locador.tipo_pessoa === 'juridica'
                  ? locador.razao_social || locador.pessoa?.nome
                  : locador.pessoa?.nome
                }
              </TableCell>
              <TableCell>
                <Badge variant={locador.tipo_pessoa === 'juridica' ? 'default' : 'secondary'}>
                  {locador.tipo_pessoa === 'juridica' ? 'Jurídica' : 'Física'}
                </Badge>
              </TableCell>
              <TableCell>
                {locador.tipo_pessoa === 'juridica'
                  ? locador.cnpj || 'N/A'
                  : locador.pessoa?.cpf || 'N/A'
                }
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {locador.pessoa?.telefone && (
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {locador.pessoa.telefone}
                    </div>
                  )}
                  {locador.pessoa?.email && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {locador.pessoa.email}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
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
                    onClick={() => handleDelete(locador.id)}
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
