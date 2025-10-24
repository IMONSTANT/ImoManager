'use client'

import { useState } from 'react'
import { useEnderecos, useDeleteEndereco } from '@/hooks/useImobiliaria'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Search, Pencil, Trash2, MapPin, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function EnderecosPage() {
  const router = useRouter()
  const { data: enderecos, isLoading } = useEnderecos()
  const deleteMutation = useDeleteEndereco()

  const [searchTerm, setSearchTerm] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const filteredEnderecos = enderecos?.filter((endereco) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      endereco.logradouro?.toLowerCase().includes(searchLower) ||
      endereco.bairro?.toLowerCase().includes(searchLower) ||
      endereco.cidade?.toLowerCase().includes(searchLower) ||
      endereco.cep?.includes(searchLower)
    )
  })

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await deleteMutation.mutateAsync(deleteId)
      toast.success('Endereço excluído com sucesso!')
      setDeleteId(null)
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir endereço')
    }
  }

  return (
    <div className="flex flex-col gap-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Endereços</h1>
          <p className="text-muted-foreground">
            Gerencie os endereços cadastrados no sistema
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/imobiliaria/enderecos/novo')}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Endereço
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Endereços</CardTitle>
          <CardDescription>
            Endereços disponíveis para vincular a pessoas, imóveis e empresas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por CEP, logradouro, bairro ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !filteredEnderecos || filteredEnderecos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum endereço encontrado</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm
                  ? 'Tente ajustar sua busca'
                  : 'Comece cadastrando um novo endereço'}
              </p>
              {!searchTerm && (
                <Button onClick={() => router.push('/dashboard/imobiliaria/enderecos/novo')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Primeiro Endereço
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CEP</TableHead>
                    <TableHead>Logradouro</TableHead>
                    <TableHead>Número</TableHead>
                    <TableHead>Bairro</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>UF</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnderecos.map((endereco) => (
                    <TableRow key={endereco.id}>
                      <TableCell className="font-medium">{endereco.cep}</TableCell>
                      <TableCell>{endereco.logradouro}</TableCell>
                      <TableCell>{endereco.numero}</TableCell>
                      <TableCell>{endereco.bairro}</TableCell>
                      <TableCell>{endereco.cidade}</TableCell>
                      <TableCell>{endereco.uf}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              router.push(`/dashboard/imobiliaria/enderecos/${endereco.id}/editar`)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(endereco.id)}
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
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este endereço? Esta ação não pode ser desfeita.
              Endereços vinculados a pessoas, imóveis ou empresas não podem ser excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
