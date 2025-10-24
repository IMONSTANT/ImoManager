'use client'

import { useState } from 'react'
import { useImoveis, useTiposImovel, useDeleteImovel } from '@/hooks/useImobiliaria'
import { formatCurrency, formatArea } from '@/lib/utils/formatters'
import { ImovelFiltros } from '@/types/imobiliaria'
import { toast } from 'sonner'
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
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Building2,
  MapPin,
  Bed,
  Bath,
  Car,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import Link from 'next/link'

export function ImoveisTable() {
  const [filtros, setFiltros] = useState<ImovelFiltros>({})
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  const { data, isLoading, error } = useImoveis(filtros)
  const { data: tiposImovel } = useTiposImovel()
  const deleteMutation = useDeleteImovel()

  const imoveis = data?.data || []
  const total = data?.count || 0

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este imóvel?')) return

    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Imóvel excluído com sucesso!')
    } catch (error: any) {
      console.error('Erro ao excluir imóvel:', error)
      toast.error(error.message || 'Erro ao excluir imóvel')
    }
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center gap-2 p-6">
          <XCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm text-destructive">
            Erro ao carregar imóveis. Tente novamente.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Imóveis</CardTitle>
              <CardDescription>
                {total} imóvel(is) cadastrado(s)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
              <Button asChild size="sm">
                <Link href="/dashboard/imobiliaria/imoveis/novo">
                  <Building2 className="mr-2 h-4 w-4" />
                  Novo Imóvel
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>

        {mostrarFiltros && (
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Tipo de Imóvel
                </label>
                <Select
                  value={filtros.tipo_imovel_id?.toString() || 'todos'}
                  onValueChange={(value) =>
                    setFiltros({
                      ...filtros,
                      tipo_imovel_id: value === 'todos' ? undefined : parseInt(value)
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os tipos</SelectItem>
                    {!tiposImovel || tiposImovel.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Não cadastrado
                      </SelectItem>
                    ) : (
                      tiposImovel.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.id.toString()}>
                          {tipo.descricao}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Disponibilidade
                </label>
                <Select
                  value={
                    filtros.disponivel === undefined
                      ? 'todos'
                      : filtros.disponivel
                      ? 'disponivel'
                      : 'ocupado'
                  }
                  onValueChange={(value) =>
                    setFiltros({
                      ...filtros,
                      disponivel:
                        value === 'todos'
                          ? undefined
                          : value === 'disponivel'
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="disponivel">Disponíveis</SelectItem>
                    <SelectItem value="ocupado">Ocupados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Valor Mínimo
                </label>
                <Input
                  type="number"
                  placeholder="R$ 0"
                  value={filtros.valor_min || ''}
                  onChange={(e) =>
                    setFiltros({
                      ...filtros,
                      valor_min: e.target.value ? parseFloat(e.target.value) : undefined
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Valor Máximo
                </label>
                <Input
                  type="number"
                  placeholder="R$ 0"
                  value={filtros.valor_max || ''}
                  onChange={(e) =>
                    setFiltros({
                      ...filtros,
                      valor_max: e.target.value ? parseFloat(e.target.value) : undefined
                    })
                  }
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltros({})}
              >
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Características</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : imoveis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Nenhum imóvel encontrado
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                imoveis.map((imovel: any) => (
                  <TableRow key={imovel.id}>
                    <TableCell className="font-mono text-xs">
                      {imovel.codigo_imovel || `IMV${imovel.id}`}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {imovel.tipo_imovel?.descricao || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium">
                            {imovel.endereco?.logradouro}, {imovel.endereco?.numero}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {imovel.endereco?.bairro} - {imovel.endereco?.cidade}/{imovel.endereco?.uf}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        {imovel.quartos && (
                          <div className="flex items-center gap-1">
                            <Bed className="h-3 w-3" />
                            <span>{imovel.quartos}</span>
                          </div>
                        )}
                        {imovel.banheiros && (
                          <div className="flex items-center gap-1">
                            <Bath className="h-3 w-3" />
                            <span>{imovel.banheiros}</span>
                          </div>
                        )}
                        {imovel.vagas_garagem && (
                          <div className="flex items-center gap-1">
                            <Car className="h-3 w-3" />
                            <span>{imovel.vagas_garagem}</span>
                          </div>
                        )}
                      </div>
                      {imovel.area_total && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatArea(imovel.area_total)}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-semibold text-green-600">
                          {formatCurrency(imovel.valor_aluguel)}
                        </p>
                        {imovel.valor_condominio && (
                          <p className="text-xs text-muted-foreground">
                            + {formatCurrency(imovel.valor_condominio)} cond.
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={imovel.disponivel ? 'default' : 'secondary'}
                        className="gap-1"
                      >
                        {imovel.disponivel ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            Disponível
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            Ocupado
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                        >
                          <Link href={`/dashboard/imobiliaria/imoveis/${imovel.id}`} aria-label="Visualizar imóvel">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                        >
                          <Link href={`/dashboard/imobiliaria/imoveis/${imovel.id}/editar`} aria-label="Editar imóvel">
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(imovel.id)}
                          disabled={deleteMutation.isPending}
                          aria-label="Excluir imóvel"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {!isLoading && imoveis.length > 0 && (
              <TableCaption>
                Total: {total} imóvel(is) encontrado(s)
              </TableCaption>
            )}
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
