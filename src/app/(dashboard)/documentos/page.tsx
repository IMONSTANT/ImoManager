'use client'

/**
 * =====================================================
 * PÁGINA: Documentos
 * =====================================================
 * Gerenciamento completo de documentos do sistema
 * - Listagem de documentos
 * - Geração de novos documentos
 * - Controle de status e assinaturas
 * =====================================================
 */

import { useState } from 'react'
import { Plus, FileText, Download, Send, X, CheckCircle, Clock } from 'lucide-react'
import { useDocumentos, useGerarDocumento, useEnviarParaAssinatura, useCancelarDocumento } from '@/hooks/use-documentos'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { DocumentoStatus, DocumentoTipo } from '@/lib/types/documento'

export default function DocumentosPage() {
  const [statusFilter, setStatusFilter] = useState<DocumentoStatus | 'all'>('all')
  const [tipoFilter, setTipoFilter] = useState<DocumentoTipo | 'all'>('all')

  const filters = {
    status: statusFilter === 'all' ? undefined : [statusFilter],
    tipo: tipoFilter === 'all' ? undefined : tipoFilter,
  }

  const { data: documentos, isLoading } = useDocumentos(filters)
  const gerarMutation = useGerarDocumento()
  const enviarMutation = useEnviarParaAssinatura()
  const cancelarMutation = useCancelarDocumento()

  const getStatusBadge = (status: DocumentoStatus) => {
    const config = {
      rascunho: { label: 'Rascunho', variant: 'secondary' as const, icon: FileText },
      gerado: { label: 'Gerado', variant: 'default' as const, icon: FileText },
      enviado: { label: 'Enviado', variant: 'default' as const, icon: Send },
      parcialmente_assinado: { label: 'Parcialmente Assinado', variant: 'warning' as const, icon: Clock },
      assinado: { label: 'Assinado', variant: 'success' as const, icon: CheckCircle },
      cancelado: { label: 'Cancelado', variant: 'destructive' as const, icon: X },
      expirado: { label: 'Expirado', variant: 'destructive' as const, icon: X },
    }

    const { label, variant, icon: Icon } = config[status]

    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  const getTipoLabel = (tipo: DocumentoTipo) => {
    const labels: Record<DocumentoTipo, string> = {
      D1: 'Ficha Cadastro Locatário',
      D2: 'Ficha Cadastro Fiador',
      D3: 'Contrato de Locação',
      D4: 'Termo Vistoria Entrada',
      D5: 'Termo Vistoria Saída',
      D6: 'Autorização Débito Automático',
      D7: 'Termo Entrega Chaves',
      D8: 'Notificação de Atraso',
      D9: 'Notificação de Rescisão',
      D10: 'Recibo de Pagamento',
    }
    return labels[tipo]
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documentos</h2>
          <p className="text-muted-foreground">
            Gerencie todos os documentos do sistema
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Gerar Novo Documento
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre documentos por status e tipo</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="w-full max-w-xs">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
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

          <div className="w-full max-w-xs">
            <Select value={tipoFilter} onValueChange={(value) => setTipoFilter(value as any)}>
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
        </CardContent>
      </Card>

      {/* Tabela de Documentos */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos Gerados</CardTitle>
          <CardDescription>
            {documentos?.length || 0} documento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando documentos...
            </div>
          ) : documentos && documentos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Gerado em</TableHead>
                  <TableHead>Assinaturas</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentos.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      {doc.numero_documento}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{doc.tipo}</span>
                        <span className="text-sm text-muted-foreground">
                          {getTipoLabel(doc.tipo)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell>
                      {doc.contrato?.numero_contrato || '-'}
                    </TableCell>
                    <TableCell>
                      {doc.gerado_em
                        ? format(new Date(doc.gerado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {doc.assinaturas && doc.assinaturas.length > 0 ? (
                        <div className="text-sm">
                          {doc.assinaturas.filter((a) => a.status === 'assinado').length} /{' '}
                          {doc.assinaturas.length}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {doc.pdf_url && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {doc.status === 'gerado' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // TODO: Abrir modal de envio para assinatura
                              console.log('Enviar para assinatura:', doc.id)
                            }}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhum documento encontrado</p>
              <p className="text-sm">Gere um novo documento para começar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
