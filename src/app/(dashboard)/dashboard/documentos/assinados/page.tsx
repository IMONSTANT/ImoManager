/**
 * =====================================================
 * PÁGINA: Documentos Assinados
 * =====================================================
 * Rota: /dashboard/documentos/assinados
 *
 * Funcionalidades:
 * - Lista documentos com status: assinado
 * - Tabela com assinaturas (quem assinou, quando)
 * - Certificado digital (se houver)
 * - Download de PDF assinado
 * =====================================================
 */

'use client'

import { useState, useMemo } from 'react'
import { ArrowLeft, Download, Eye, CheckCircle, Shield, User } from 'lucide-react'
import Link from 'next/link'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DocumentoFilters } from '@/components/documentos/DocumentoFilters'
import { DocumentoPreview } from '@/components/documentos/DocumentoPreview'
import { StatusBadge } from '@/components/documentos/StatusBadge'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import type { DocumentoInstanciaComRelacoes, DocumentoTipo, AssinaturaComPessoa } from '@/lib/types/documento'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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

export default function DocumentosAssinadosPage() {
  const { toast } = useToast()
  const supabase = createClient()

  // Estados
  const [documentos, setDocumentos] = useState<DocumentoInstanciaComRelacoes[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tipoFilter, setTipoFilter] = useState<DocumentoTipo | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Preview e Assinaturas
  const [previewOpen, setPreviewOpen] = useState(false)
  const [assinaturasOpen, setAssinaturasOpen] = useState(false)
  const [documentoSelecionado, setDocumentoSelecionado] = useState<DocumentoInstanciaComRelacoes | null>(null)

  // Carregar documentos
  useState(() => {
    carregarDocumentos()
  })

  async function carregarDocumentos() {
    try {
      setIsLoading(true)

      const { data, error } = await supabase
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
            nome_signatario,
            email_signatario,
            cpf_signatario,
            tipo_signatario,
            status,
            assinado_em,
            ip_assinatura,
            certificado_digital
          ),
          contrato:contrato_locacao(
            numero_contrato,
            valor
          ),
          locatario(
            pessoa(
              nome,
              cpf_cnpj,
              email
            )
          )
        `)
        .eq('status', 'assinado')
        .order('assinado_em', { ascending: false })

      if (error) throw error

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
  }, [documentos, tipoFilter, searchQuery])

  // Estatísticas
  const estatisticas = useMemo(() => {
    const total = documentos.length
    const porTipo: Record<string, number> = {}
    const comCertificado = documentos.filter((d) =>
      d.assinaturas?.some((a) => a.certificado_digital)
    ).length

    documentos.forEach((doc) => {
      porTipo[doc.tipo] = (porTipo[doc.tipo] || 0) + 1
    })

    return { total, porTipo, comCertificado }
  }, [documentos])

  // Handlers
  async function handleDownload(documento: DocumentoInstanciaComRelacoes) {
    try {
      if (!documento.pdf_url) {
        toast({
          title: 'Aviso',
          description: 'PDF não disponível para este documento',
          variant: 'default',
        })
        return
      }

      const response = await fetch(documento.pdf_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${documento.numero_documento}_assinado.pdf`
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
    setDocumentoSelecionado(documento)
    setPreviewOpen(true)
  }

  function handleVerAssinaturas(documento: DocumentoInstanciaComRelacoes) {
    setDocumentoSelecionado(documento)
    setAssinaturasOpen(true)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/documentos"
            className="flex items-center gap-2 text-blue-600 hover:underline mb-2"
          >
            <ArrowLeft size={16} />
            Voltar para Documentos
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Documentos Assinados</h2>
          <p className="text-muted-foreground">
            Visualize todos os documentos que foram completamente assinados
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assinados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total}</div>
            <p className="text-xs text-muted-foreground">documentos concluídos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Certificado Digital</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.comCertificado}</div>
            <p className="text-xs text-muted-foreground">assinados digitalmente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tipos Diferentes</CardTitle>
            <User className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(estatisticas.porTipo).length}</div>
            <p className="text-xs text-muted-foreground">tipos de documentos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <DocumentoFilters
        statusFilter="assinado"
        tipoFilter={tipoFilter}
        searchQuery={searchQuery}
        onStatusChange={() => {}}
        onTipoChange={setTipoFilter}
        onSearchChange={setSearchQuery}
        showSearch
      />

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos Assinados</CardTitle>
          <CardDescription>
            {documentosFiltrados.length} documento(s) assinado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando documentos...
            </div>
          ) : documentosFiltrados.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Locatário</TableHead>
                  <TableHead>Assinado em</TableHead>
                  <TableHead>Assinaturas</TableHead>
                  <TableHead>Certificado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentosFiltrados.map((doc) => {
                  const assinaturasCompletas = doc.assinaturas?.filter(
                    (a) => a.status === 'assinado'
                  ).length || 0
                  const totalAssinaturas = doc.assinaturas?.length || 0
                  const temCertificado = doc.assinaturas?.some((a) => a.certificado_digital)

                  return (
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
                      <TableCell>{doc.contrato?.numero_contrato || '-'}</TableCell>
                      <TableCell>{doc.locatario?.pessoa?.nome || '-'}</TableCell>
                      <TableCell>
                        {doc.assinado_em
                          ? format(new Date(doc.assinado_em), 'dd/MM/yyyy HH:mm', {
                              locale: ptBR,
                            })
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleVerAssinaturas(doc)}
                          className="p-0 h-auto"
                        >
                          {assinaturasCompletas} / {totalAssinaturas}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {temCertificado ? (
                          <Badge variant="default" className="gap-1">
                            <Shield className="h-3 w-3" />
                            Sim
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {doc.conteudo_html && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview(doc)}
                              title="Visualizar"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {doc.pdf_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(doc)}
                              title="Baixar PDF"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhum documento assinado</p>
              <p className="text-sm">Os documentos assinados aparecerão aqui</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      {documentoSelecionado && (
        <DocumentoPreview
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          htmlContent={documentoSelecionado.conteudo_html || '<p>Conteúdo não disponível</p>'}
          documentoNumero={documentoSelecionado.numero_documento}
          onDownloadPdf={() => handleDownload(documentoSelecionado)}
          onVisualizarPdf={() => {
            if (documentoSelecionado.pdf_url) {
              window.open(documentoSelecionado.pdf_url, '_blank')
            }
          }}
        />
      )}

      {/* Dialog de Assinaturas */}
      <Dialog open={assinaturasOpen} onOpenChange={setAssinaturasOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Assinaturas do Documento</DialogTitle>
            <DialogDescription>
              {documentoSelecionado?.numero_documento}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {documentoSelecionado?.assinaturas && documentoSelecionado.assinaturas.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Signatário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Assinado em</TableHead>
                    <TableHead>Certificado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentoSelecionado.assinaturas.map((assinatura: any) => (
                    <TableRow key={assinatura.id}>
                      <TableCell className="font-medium">
                        {assinatura.nome_signatario}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{assinatura.tipo_signatario}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {assinatura.cpf_signatario || '-'}
                      </TableCell>
                      <TableCell className="text-sm">{assinatura.email_signatario}</TableCell>
                      <TableCell>
                        {assinatura.assinado_em
                          ? format(new Date(assinatura.assinado_em), 'dd/MM/yyyy HH:mm', {
                              locale: ptBR,
                            })
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {assinatura.certificado_digital ? (
                          <Badge variant="default" className="gap-1">
                            <Shield className="h-3 w-3" />
                            Sim
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma assinatura registrada
              </div>
            )}

            {documentoSelecionado?.assinado_em && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Documento totalmente assinado</p>
                    <p className="text-sm">
                      Concluído em{' '}
                      {format(new Date(documentoSelecionado.assinado_em), 'dd/MM/yyyy HH:mm', {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
