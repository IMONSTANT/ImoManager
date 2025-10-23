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
import { Edit, Trash2, Mail, Phone, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'

export function EmpresasTable() {
  const [empresas, setEmpresas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchEmpresas()
  }, [])

  async function fetchEmpresas() {
    try {
      const { data, error } = await supabase
        .from('empresa_cliente')
        .select(`
          *,
          endereco:endereco(*),
          imovel:imovel(codigo_imovel)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setEmpresas(data || [])
    } catch (error) {
      console.error('Erro ao carregar empresas:', error)
      toast.error('Erro ao carregar empresas')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) return

    try {
      const { error } = await supabase
        .from('empresa_cliente')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Empresa excluída com sucesso')
      fetchEmpresas()
    } catch (error) {
      console.error('Erro ao excluir empresa:', error)
      toast.error('Erro ao excluir empresa')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>
  }

  if (empresas.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma empresa cadastrada
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Razão Social</TableHead>
            <TableHead>Nome Fantasia</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Imóvel</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {empresas.map((empresa) => (
            <TableRow key={empresa.id}>
              <TableCell className="font-medium">
                {empresa.razao_social || empresa.descricao}
              </TableCell>
              <TableCell>
                {empresa.nome_fantasia || (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </TableCell>
              <TableCell>
                {empresa.cnpj ? (
                  <Badge variant="outline">{empresa.cnpj}</Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {empresa.telefone && (
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {empresa.telefone}
                    </div>
                  )}
                  {empresa.email && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {empresa.email}
                    </div>
                  )}
                  {empresa.contato_principal && (
                    <div className="text-xs text-muted-foreground">
                      Contato: {empresa.contato_principal}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {empresa.imovel?.codigo_imovel ? (
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{empresa.imovel.codigo_imovel}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/imobiliaria/empresas/${empresa.id}/editar`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(empresa.id)}
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
