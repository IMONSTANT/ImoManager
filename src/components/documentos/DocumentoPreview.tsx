/**
 * Componente: DocumentoPreview
 * Dialog para preview do HTML do documento
 */

'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Download, Eye, X } from 'lucide-react'

interface DocumentoPreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  htmlContent: string
  documentoNumero?: string
  onDownloadPdf?: () => void
  onVisualizarPdf?: () => void
}

export function DocumentoPreview({
  open,
  onOpenChange,
  htmlContent,
  documentoNumero,
  onDownloadPdf,
  onVisualizarPdf,
}: DocumentoPreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Preview do Documento</DialogTitle>
          <DialogDescription>
            {documentoNumero ? `Documento: ${documentoNumero}` : 'Visualização do conteúdo HTML'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          {onVisualizarPdf && (
            <Button onClick={onVisualizarPdf} size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Visualizar PDF
            </Button>
          )}
          {onDownloadPdf && (
            <Button onClick={onDownloadPdf} variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          )}
        </div>

        <ScrollArea className="h-[60vh] border rounded-lg">
          <div className="p-6 bg-white">
            <div
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              className="prose max-w-none"
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
