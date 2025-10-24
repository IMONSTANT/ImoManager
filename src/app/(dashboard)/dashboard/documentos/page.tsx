/**
 * =====================================================
 * PÁGINA: Listagem Completa de Documentos
 * =====================================================
 * Rota: /dashboard/documentos
 *
 * Funcionalidades:
 * - Tabela com TODOS os documentos gerados
 * - Filtros por tipo, status e busca
 * - Ações: Visualizar, Baixar, Enviar, Cancelar
 * - Paginação
 * =====================================================
 */

'use client'

import { useState, useMemo } from 'react'
import { Plus, Download, Eye, Send, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DocumentoFilters } from '@/components/documentos/DocumentoFilters'
import { DocumentoTable } from '@/components/documentos/DocumentoTable'
import { DocumentoPreview } from '@/components/documentos/DocumentoPreview'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import type { DocumentoInstanciaComRelacoes, DocumentoStatus, DocumentoTipo } from '@/lib/types/documento'

export default function DocumentosPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  // Estados
  const [documentos, setDocumentos] = useState<DocumentoInstanciaComRelacoes[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<DocumentoStatus | 'all'>('all')
  const [tipoFilter, setTipoFilter] = useState<DocumentoTipo | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Preview
  const [previewOpen, setPreviewOpen] = useState(false)
  const [documentoPreview, setDocumentoPreview] = useState<DocumentoInstanciaComRelacoes | null>(null)

  // Carregar documentos
  useState(() => {
    carregarDocumentos()
  })

  async function carregarDocumentos() {
    try {
      setIsLoading(true)

      let query = supabase
        .from('documento_instancia')
        .select(`
          *,
          modelo:documento_modelo(
            id,
            tipo,
            nome,
            descricao
          ),
          assinaturas:assinatura(
            id,
            status,
            nome_signatario,
            assinado_em
          ),
          contrato:contrato_locacao(
            numero_contrato,
            valor
          ),
          locatario(
            pessoa:pessoa_id(
              nome,
              cpf_cnpj,
              email
            )
          )
        `)
        .order('criado_em', { ascending: false })

      const { data, error } = await query

      if (error) {
        throw error
      }

      setDocumentos((data as any) || [])
    } catch (error) {
      console.error('Erro ao carregar documentos:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os documentos',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrar documentos
  const documentosFiltrados = useMemo(() => {
    let filtered = [...documentos]

    // Filtro de status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((doc) => doc.status === statusFilter)
    }

    // Filtro de tipo
    if (tipoFilter !== 'all') {
      filtered = filtered.filter((doc) => doc.tipo === tipoFilter)
    }

    // Busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((doc) => {
        return (
          doc.numero_documento.toLowerCase().includes(query) ||
          doc.locatario?.pessoa?.nome?.toLowerCase().includes(query) ||
          doc.contrato?.numero_contrato?.toLowerCase().includes(query)
        )
      })
    }

    return filtered
  }, [documentos, statusFilter, tipoFilter, searchQuery])

  // Handlers
  async function handleDownload(documento: DocumentoInstanciaComRelacoes) {
    try {
      if (!documento.pdf_url) {
        toast({
          title: 'Aviso',
          description: 'PDF ainda não foi gerado para este documento',
          variant: 'default',
        })
        return
      }

      // Download via fetch
      const response = await fetch(documento.pdf_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${documento.numero_documento}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Sucesso',
        description: 'PDF baixado com sucesso',
      })
    } catch (error) {
      console.error('Erro ao baixar PDF:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível baixar o PDF',
        variant: 'destructive',
      })
    }
  }

  function handlePreview(documento: DocumentoInstanciaComRelacoes) {
    setDocumentoPreview(documento)
    setPreviewOpen(true)
  }

  async function handleEnviar(documento: DocumentoInstanciaComRelacoes) {
    try {
      // TODO: Implementar integração com serviço de assinatura
      toast({
        title: 'Em desenvolvimento',
        description: 'Funcionalidade de envio para assinatura em desenvolvimento',
      })
    } catch (error) {
      console.error('Erro ao enviar documento:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar o documento',
        variant: 'destructive',
      })
    }
  }

  async function handleCancelar(documento: DocumentoInstanciaComRelacoes) {
    try {
      if (!confirm(`Deseja realmente cancelar o documento ${documento.numero_documento}?`)) {
        return
      }

      const { error } = await supabase
        .from('documento_instancia')
        .update({
          status: 'cancelado',
          cancelado_em: new Date().toISOString(),
          motivo_cancelamento: 'Cancelado pelo usuário',
        })
        .eq('id', documento.id)

      if (error) throw error

      toast({
        title: 'Sucesso',
        description: 'Documento cancelado com sucesso',
      })

      carregarDocumentos()
    } catch (error) {
      console.error('Erro ao cancelar documento:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível cancelar o documento',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documentos</h2>
          <p className="text-muted-foreground">
            Gerencie todos os documentos do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/documentos/pendentes">
              Pendentes
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/documentos/assinados">
              Assinados
            </Link>
          </Button>
          <Button asChild>
            <Link href="/documentos/gerar">
              <Plus className="mr-2 h-4 w-4" />
              Gerar Novo
            </Link>
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <DocumentoFilters
        statusFilter={statusFilter}
        tipoFilter={tipoFilter}
        searchQuery={searchQuery}
        onStatusChange={setStatusFilter}
        onTipoChange={setTipoFilter}
        onSearchChange={setSearchQuery}
        showSearch
      />

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos Gerados</CardTitle>
          <CardDescription>
            {documentosFiltrados.length} documento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentoTable
            documentos={documentosFiltrados}
            isLoading={isLoading}
            onDownload={handleDownload}
            onPreview={handlePreview}
            onEnviar={handleEnviar}
            onCancelar={handleCancelar}
            showActions
          />
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      {documentoPreview && (
        <DocumentoPreview
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          htmlContent={documentoPreview.conteudo_html || '<p>Conteúdo não disponível</p>'}
          documentoNumero={documentoPreview.numero_documento}
          onDownloadPdf={() => handleDownload(documentoPreview)}
          onVisualizarPdf={() => {
            if (documentoPreview.pdf_url) {
              window.open(documentoPreview.pdf_url, '_blank')
            }
          }}
        />
      )}
    </div>
  )
}
