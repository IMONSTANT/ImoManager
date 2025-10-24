/**
 * =====================================================
 * PÁGINA: Documentos Pendentes
 * =====================================================
 * Rota: /dashboard/documentos/pendentes
 *
 * Funcionalidades:
 * - Lista documentos com status: rascunho, gerado, enviado
 * - Agrupado por tipo
 * - Ações rápidas: Finalizar, Enviar para assinatura
 * - Contador de dias pendentes
 * =====================================================
 */

'use client'

import { useState, useMemo } from 'react'
import { ArrowLeft, Send, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DocumentoFilters } from '@/components/documentos/DocumentoFilters'
import { DocumentoTable } from '@/components/documentos/DocumentoTable'
import { DocumentoPreview } from '@/components/documentos/DocumentoPreview'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import type { DocumentoInstanciaComRelacoes, DocumentoStatus, DocumentoTipo } from '@/lib/types/documento'
import { differenceInDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function DocumentosPendentesPage() {
  const { toast } = useToast()
  const supabase = createClient()

  // Estados
  const [documentos, setDocumentos] = useState<DocumentoInstanciaComRelacoes[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tipoFilter, setTipoFilter] = useState<DocumentoTipo | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [tabAtiva, setTabAtiva] = useState('todos')

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
            status,
            nome_signatario,
            assinado_em
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
        .in('status', ['rascunho', 'gerado', 'enviado', 'parcialmente_assinado'])
        .order('criado_em', { ascending: false })

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

    // Filtro de tab
    if (tabAtiva !== 'todos') {
      filtered = filtered.filter((doc) => doc.status === tabAtiva)
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
  }, [documentos, tabAtiva, tipoFilter, searchQuery])

  // Agrupar por tipo
  const documentosPorTipo = useMemo(() => {
    const grupos: Record<string, DocumentoInstanciaComRelacoes[]> = {}

    documentosFiltrados.forEach((doc) => {
      if (!grupos[doc.tipo]) {
        grupos[doc.tipo] = []
      }
      grupos[doc.tipo].push(doc)
    })

    return grupos
  }, [documentosFiltrados])

  // Contadores
  const contadores = useMemo(() => {
    return {
      rascunho: documentos.filter((d) => d.status === 'rascunho').length,
      gerado: documentos.filter((d) => d.status === 'gerado').length,
      enviado: documentos.filter((d) => d.status === 'enviado').length,
      parcialmente_assinado: documentos.filter((d) => d.status === 'parcialmente_assinado').length,
      total: documentos.length,
    }
  }, [documentos])

  // Calcular dias pendentes
  function calcularDiasPendentes(documento: DocumentoInstanciaComRelacoes): number {
    const dataBase = documento.enviado_em || documento.gerado_em || documento.criado_em
    if (!dataBase) return 0
    return differenceInDays(new Date(), new Date(dataBase))
  }

  // Handlers
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

  async function handleFinalizar(documento: DocumentoInstanciaComRelacoes) {
    try {
      const { error } = await supabase
        .from('documento_instancia')
        .update({
          status: 'gerado',
        })
        .eq('id', documento.id)

      if (error) throw error

      toast({
        title: 'Sucesso',
        description: 'Documento finalizado com sucesso',
      })

      carregarDocumentos()
    } catch (error) {
      console.error('Erro ao finalizar documento:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível finalizar o documento',
        variant: 'destructive',
      })
    }
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
          <h2 className="text-3xl font-bold tracking-tight">Documentos Pendentes</h2>
          <p className="text-muted-foreground">
            Gerencie documentos que aguardam finalização ou assinatura
          </p>
        </div>
      </div>

      {/* Contadores */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contadores.total}</div>
            <p className="text-xs text-muted-foreground">documentos aguardando ação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contadores.rascunho}</div>
            <p className="text-xs text-muted-foreground">não finalizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando Envio</CardTitle>
            <Send className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contadores.gerado}</div>
            <p className="text-xs text-muted-foreground">prontos para enviar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parc. Assinados</CardTitle>
            <CheckCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contadores.parcialmente_assinado}</div>
            <p className="text-xs text-muted-foreground">faltam assinaturas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <DocumentoFilters
        statusFilter="all"
        tipoFilter={tipoFilter}
        searchQuery={searchQuery}
        onStatusChange={() => {}}
        onTipoChange={setTipoFilter}
        onSearchChange={setSearchQuery}
        showSearch
      />

      {/* Tabs por Status */}
      <Card>
        <CardHeader>
          <Tabs value={tabAtiva} onValueChange={setTabAtiva}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="todos">
                Todos
                <Badge variant="secondary" className="ml-2">
                  {contadores.total}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="rascunho">
                Rascunho
                <Badge variant="secondary" className="ml-2">
                  {contadores.rascunho}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="gerado">
                Gerado
                <Badge variant="secondary" className="ml-2">
                  {contadores.gerado}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="enviado">
                Enviado
                <Badge variant="secondary" className="ml-2">
                  {contadores.enviado}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="parcialmente_assinado">
                Parc. Assinado
                <Badge variant="secondary" className="ml-2">
                  {contadores.parcialmente_assinado}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {/* Agrupado por Tipo */}
          {Object.keys(documentosPorTipo).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(documentosPorTipo).map(([tipo, docs]) => (
                <div key={tipo}>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold">{tipo}</h3>
                    <Badge variant="outline">{docs.length}</Badge>
                  </div>

                  <div className="space-y-2">
                    {docs.map((doc) => {
                      const diasPendentes = calcularDiasPendentes(doc)
                      return (
                        <Card key={doc.id} className="hover:bg-gray-50 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="font-mono text-sm font-medium">
                                    {doc.numero_documento}
                                  </span>
                                  <Badge
                                    variant={
                                      doc.status === 'rascunho'
                                        ? 'secondary'
                                        : doc.status === 'gerado'
                                        ? 'default'
                                        : 'outline'
                                    }
                                  >
                                    {doc.status}
                                  </Badge>
                                  {diasPendentes > 3 && (
                                    <Badge variant="destructive" className="gap-1">
                                      <Clock className="h-3 w-3" />
                                      {diasPendentes} dias
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {doc.contrato?.numero_contrato && (
                                    <span>Contrato: {doc.contrato.numero_contrato} | </span>
                                  )}
                                  {doc.locatario?.pessoa?.nome && (
                                    <span>Locatário: {doc.locatario.pessoa.nome}</span>
                                  )}
                                </div>
                                {doc.gerado_em && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Gerado em:{' '}
                                    {format(new Date(doc.gerado_em), 'dd/MM/yyyy HH:mm', {
                                      locale: ptBR,
                                    })}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {doc.status === 'rascunho' && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleFinalizar(doc)}
                                    variant="outline"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Finalizar
                                  </Button>
                                )}
                                {doc.status === 'gerado' && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleEnviar(doc)}
                                    variant="default"
                                  >
                                    <Send className="h-4 w-4 mr-1" />
                                    Enviar
                                  </Button>
                                )}
                                {doc.conteudo_html && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handlePreview(doc)}
                                  >
                                    Preview
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhum documento pendente</p>
              <p className="text-sm">Todos os documentos foram finalizados ou assinados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      {documentoPreview && (
        <DocumentoPreview
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          htmlContent={documentoPreview.conteudo_html || '<p>Conteúdo não disponível</p>'}
          documentoNumero={documentoPreview.numero_documento}
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
