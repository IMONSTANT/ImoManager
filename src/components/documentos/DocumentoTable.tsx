/**
 * Componente: DocumentoTable
 * Tabela reutilizável de documentos
 */

'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StatusBadge } from './StatusBadge'
import { Download, Eye, Send, X, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { DocumentoInstanciaComRelacoes, DocumentoTipo } from '@/lib/types/documento'
import { Skeleton } from '@/components/ui/skeleton'

interface DocumentoTableProps {
  documentos: DocumentoInstanciaComRelacoes[]
  isLoading?: boolean
  onDownload?: (documento: DocumentoInstanciaComRelacoes) => void
  onPreview?: (documento: DocumentoInstanciaComRelacoes) => void
  onEnviar?: (documento: DocumentoInstanciaComRelacoes) => void
  onCancelar?: (documento: DocumentoInstanciaComRelacoes) => void
  showActions?: boolean
}

const TIPO_LABELS: Record<DocumentoTipo, string> = {
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

export function DocumentoTable({
  documentos,
  isLoading = false,
  onDownload,
  onPreview,
  onEnviar,
  onCancelar,
  showActions = true,
}: DocumentoTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (!documentos || documentos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">Nenhum documento encontrado</p>
        <p className="text-sm">Gere um novo documento para começar</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Contrato</TableHead>
          <TableHead>Locatário</TableHead>
          <TableHead>Gerado em</TableHead>
          <TableHead>Assinaturas</TableHead>
          {showActions && <TableHead className="text-right">Ações</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {documentos.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell className="font-mono text-sm font-medium">
              {doc.numero_documento}
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{doc.tipo}</span>
                <span className="text-xs text-muted-foreground">
                  {TIPO_LABELS[doc.tipo]}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={doc.status} />
            </TableCell>
            <TableCell>
              {doc.contrato?.numero_contrato || '-'}
            </TableCell>
            <TableCell>
              {doc.locatario?.pessoa?.nome || '-'}
            </TableCell>
            <TableCell>
              {doc.gerado_em
                ? format(new Date(doc.gerado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                : '-'}
            </TableCell>
            <TableCell>
              {doc.assinaturas && doc.assinaturas.length > 0 ? (
                <div className="text-sm">
                  <span className="font-medium">
                    {doc.assinaturas.filter((a) => a.status === 'assinado').length}
                  </span>
                  <span className="text-muted-foreground"> / {doc.assinaturas.length}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            {showActions && (
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  {onPreview && doc.conteudo_html && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPreview(doc)}
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onDownload && doc.pdf_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownload(doc)}
                      title="Baixar PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  {onEnviar && doc.status === 'gerado' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEnviar(doc)}
                      title="Enviar para assinatura"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                  {onCancelar && doc.status !== 'cancelado' && doc.status !== 'assinado' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCancelar(doc)}
                      title="Cancelar documento"
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
