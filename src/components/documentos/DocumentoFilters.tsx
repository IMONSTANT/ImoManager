/**
 * Componente: DocumentoFilters
 * Filtros reutilizáveis para documentos
 */

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { DocumentoStatus, DocumentoTipo } from '@/lib/types/documento'
import { Search } from 'lucide-react'

interface DocumentoFiltersProps {
  statusFilter: DocumentoStatus | 'all'
  tipoFilter: DocumentoTipo | 'all'
  searchQuery?: string
  onStatusChange: (status: DocumentoStatus | 'all') => void
  onTipoChange: (tipo: DocumentoTipo | 'all') => void
  onSearchChange?: (query: string) => void
  showSearch?: boolean
}

export function DocumentoFilters({
  statusFilter,
  tipoFilter,
  searchQuery = '',
  onStatusChange,
  onTipoChange,
  onSearchChange,
  showSearch = true,
}: DocumentoFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
        <CardDescription>Filtre documentos por status, tipo ou busca</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          {showSearch && onSearchChange && (
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por número ou locatário..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          <div className="w-full md:w-64">
            <Select value={statusFilter} onValueChange={(value) => onStatusChange(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="rascunho">Rascunho</SelectItem>
                <SelectItem value="gerado">Gerado</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
                <SelectItem value="parcialmente_assinado">Parcialmente Assinado</SelectItem>
                <SelectItem value="assinado">Assinado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
                <SelectItem value="expirado">Expirado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-64">
            <Select value={tipoFilter} onValueChange={(value) => onTipoChange(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="D1">D1 - Ficha Cadastro Locatário</SelectItem>
                <SelectItem value="D2">D2 - Ficha Cadastro Fiador</SelectItem>
                <SelectItem value="D3">D3 - Contrato de Locação</SelectItem>
                <SelectItem value="D4">D4 - Vistoria Entrada</SelectItem>
                <SelectItem value="D5">D5 - Vistoria Saída</SelectItem>
                <SelectItem value="D6">D6 - Débito Automático</SelectItem>
                <SelectItem value="D7">D7 - Entrega Chaves</SelectItem>
                <SelectItem value="D8">D8 - Notificação Atraso</SelectItem>
                <SelectItem value="D9">D9 - Notificação Rescisão</SelectItem>
                <SelectItem value="D10">D10 - Recibo Pagamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
