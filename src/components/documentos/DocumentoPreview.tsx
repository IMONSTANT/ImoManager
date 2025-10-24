/**
 * Componente: DocumentoPreview
 * Dialog para preview do HTML do documento
 */

'use client'

import { useEffect, useRef } from 'react'
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
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Injeta o HTML completo no iframe quando o conteúdo muda
  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

      if (iframeDoc) {
        iframeDoc.open()
        iframeDoc.write(htmlContent)
        iframeDoc.close()
      }
    }
  }, [htmlContent, open])

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

        <div className="border rounded-lg overflow-hidden bg-white">
          <iframe
            ref={iframeRef}
            className="w-full h-[60vh] border-0"
            title="Preview do Documento"
            sandbox="allow-same-origin"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
