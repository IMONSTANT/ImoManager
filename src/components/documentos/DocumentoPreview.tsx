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

/**
 * Extrai apenas o conteúdo dentro da tag <body> do HTML completo
 * Isso é necessário porque dangerouslySetInnerHTML não aceita documentos HTML completos
 */
function extractBodyContent(html: string): string {
  // Tenta extrair conteúdo entre <body> e </body>
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  if (bodyMatch && bodyMatch[1]) {
    return bodyMatch[1]
  }

  // Se não encontrar body, retorna o HTML original (pode ser já um fragmento)
  return html
}

/**
 * Extrai os estilos do <head> para aplicar no preview
 */
function extractStyles(html: string): string {
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi)
  if (styleMatch) {
    return styleMatch.join('\n')
  }
  return ''
}

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
  // Extrai apenas o conteúdo do body e os estilos
  const bodyContent = extractBodyContent(htmlContent)
  const styles = extractStyles(htmlContent)

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
          <div className="bg-white">
            {/* Injeta os estilos do documento */}
            {styles && <div dangerouslySetInnerHTML={{ __html: styles }} />}
            {/* Renderiza apenas o conteúdo do body */}
            <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
