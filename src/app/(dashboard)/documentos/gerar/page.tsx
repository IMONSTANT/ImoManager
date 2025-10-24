/**
 * =====================================================
 * PÁGINA: Wizard de Geração de Documentos
 * =====================================================
 * Rota: /documentos/gerar
 *
 * Wizard em 3 etapas:
 * 1. Selecionar tipo de documento (grid visual)
 * 2. Preencher informações (selects dinâmicos)
 * 3. Preview HTML + Gerar/Baixar PDF
 * =====================================================
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Eye,
  Download,
  Check,
  ArrowLeft,
  ArrowRight,
  FileUser,
  FileSignature,
  Home,
  ClipboardCheck,
  Key,
  Bell,
  Receipt,
  UserCheck,
  Building,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DocumentoCard } from '@/components/documentos/DocumentoCard'
import { DocumentoPreview } from '@/components/documentos/DocumentoPreview'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import type { DocumentoTipo } from '@/lib/types/documento'
import { Skeleton } from '@/components/ui/skeleton'

interface Template {
  tipo: DocumentoTipo
  nome: string
  descricao: string
  variaveis_esperadas: string[]
}

interface Contrato {
  id: number
  numero_contrato: string | null
  valor: number
}

interface Fiador {
  id: number
  pessoa: {
    nome: string
    cpf_cnpj: string
  }
}

interface Parcela {
  id: number
  competencia: string
  vencimento: string
  principal: number
  status: string
}

const DOCUMENTO_ICONS = {
  D1: FileUser,
  D2: UserCheck,
  D3: FileSignature,
  D4: ClipboardCheck,
  D5: ClipboardCheck,
  D6: Building,
  D7: Key,
  D8: Bell,
  D9: FileText,
  D10: Receipt,
}

const DOCUMENTO_TITULOS: Record<DocumentoTipo, string> = {
  D1: 'Ficha Cadastro Locatário',
  D2: 'Ficha Cadastro Fiador',
  D3: 'Contrato de Locação',
  D4: 'Termo Vistoria Entrada',
  D5: 'Termo Vistoria Saída',
  D6: 'Autorização Débito Automático',
  D7: 'Termo Entrega de Chaves',
  D8: 'Notificação de Atraso',
  D9: 'Notificação de Rescisão',
  D10: 'Recibo de Pagamento',
}

const DOCUMENTO_DESCRICOES: Record<DocumentoTipo, string> = {
  D1: 'Ficha de cadastro completo do locatário',
  D2: 'Ficha de cadastro completo do fiador',
  D3: 'Contrato de locação residencial ou comercial',
  D4: 'Registro do estado do imóvel na entrada',
  D5: 'Registro do estado do imóvel na saída',
  D6: 'Autorização para débito automático de aluguel',
  D7: 'Comprovante de entrega das chaves do imóvel',
  D8: 'Notificação de parcela em atraso',
  D9: 'Acordo de rescisão antecipada de contrato',
  D10: 'Comprovante de pagamento de aluguel',
}

export default function GerarDocumentoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  // Estados do wizard
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Dados disponíveis
  const [templates, setTemplates] = useState<Template[]>([])
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [fiadores, setFiadores] = useState<Fiador[]>([])
  const [parcelas, setParcelas] = useState<Parcela[]>([])

  // Seleções do usuário
  const [tipoSelecionado, setTipoSelecionado] = useState<DocumentoTipo | ''>('')
  const [contratoId, setContratoId] = useState('none')
  const [fiadorId, setFiadorId] = useState('none')
  const [parcelaId, setParcelaId] = useState('none')

  // Documento gerado
  const [documentoGerado, setDocumentoGerado] = useState<any>(null)
  const [previewHTML, setPreviewHTML] = useState('')

  useEffect(() => {
    carregarDados()
  }, [])

  useEffect(() => {
    if (step === 2 && contratoId && contratoId !== 'none') {
      carregarParcelasDoContrato()
    }
  }, [contratoId, step])

  async function carregarDados() {
    try {
      setLoading(true)

      // Carregar templates
      const tipos: DocumentoTipo[] = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10']
      const templatesData: Template[] = tipos.map((tipo) => ({
        tipo,
        nome: DOCUMENTO_TITULOS[tipo],
        descricao: DOCUMENTO_DESCRICOES[tipo],
        variaveis_esperadas: [],
      }))
      setTemplates(templatesData)

      // Carregar contratos ativos
      const { data: contratosData, error: contratosError } = await supabase
        .from('contrato_locacao')
        .select('id, numero_contrato, valor')
        .eq('status', 'ativo')
        .order('numero_contrato')

      if (contratosError) throw contratosError
      setContratos(contratosData || [])

      // Carregar fiadores
      const { data: fiadoresData, error: fiadoresError } = await supabase
        .from('fiador')
        .select(`
          id,
          pessoa:pessoa_id(
            nome,
            cpf_cnpj
          )
        `)
        .limit(100)

      if (fiadoresError) throw fiadoresError
      setFiadores((fiadoresData as any) || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados necessários',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function carregarParcelasDoContrato() {
    if (!contratoId || contratoId === 'none') return

    try {
      const { data, error } = await supabase
        .from('parcela')
        .select('id, competencia, vencimento, principal, status')
        .eq('contrato_id', parseInt(contratoId))
        .in('status', ['vencido', 'pago', 'pendente'])
        .order('vencimento', { ascending: false })
        .limit(50)

      if (error) throw error
      setParcelas(data || [])
    } catch (error) {
      console.error('Erro ao carregar parcelas:', error)
    }
  }

  async function gerarDocumento() {
    if (!tipoSelecionado) return

    setLoading(true)
    try {
      const payload: any = {
        tipo: tipoSelecionado,
      }

      if (contratoId && contratoId !== 'none') payload.contrato_id = parseInt(contratoId)
      if (fiadorId && fiadorId !== 'none') payload.fiador_id = parseInt(fiadorId)
      if (parcelaId && parcelaId !== 'none') payload.parcela_id = parseInt(parcelaId)

      const response = await fetch('/api/documentos/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success && data.documento) {
        setDocumentoGerado(data.documento)
        setPreviewHTML(data.documento.conteudo_html || '')
        setStep(3)

        toast({
          title: 'Sucesso',
          description: 'Documento gerado com sucesso!',
        })
      } else {
        toast({
          title: 'Erro',
          description: data.error || 'Erro ao gerar documento',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Erro ao gerar documento:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao gerar documento',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function baixarPDF() {
    if (!documentoGerado?.id) return

    try {
      const response = await fetch(`/api/documentos/${documentoGerado.id}/pdf`, {
        method: 'POST',
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${documentoGerado.numero_documento}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Sucesso',
        description: 'PDF baixado com sucesso!',
      })
    } catch (error) {
      console.error('Erro ao baixar PDF:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao baixar PDF',
        variant: 'destructive',
      })
    }
  }

  function visualizarPDF() {
    if (!documentoGerado?.id) return
    window.open(`/api/documentos/${documentoGerado.id}/pdf`, '_blank')
  }

  // Verificar se pode avançar para step 2
  const podeAvancarParaStep2 = tipoSelecionado !== ''

  // Verificar se pode gerar documento
  const podeGerarDocumento = (() => {
    if (!tipoSelecionado) return false

    // D2 requer fiador
    if (tipoSelecionado === 'D2') return !!fiadorId

    // D8 e D10 requerem parcela
    if (tipoSelecionado === 'D8' || tipoSelecionado === 'D10') return !!parcelaId

    // Outros tipos requerem contrato (exceto se for teste)
    return true // Permitir gerar mesmo sem contrato para teste
  })()

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/documentos"
          className="flex items-center gap-2 text-blue-600 hover:underline mb-4"
        >
          <ArrowLeft size={20} />
          Voltar para Documentos
        </Link>
        <h1 className="text-3xl font-bold">Gerar Novo Documento</h1>
        <p className="text-gray-600 mt-1">
          Selecione o tipo de documento e preencha as informações
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4">
          {[
            { num: 1, label: 'Selecionar Tipo' },
            { num: 2, label: 'Informações' },
            { num: 3, label: 'Preview e Download' },
          ].map(({ num, label }, idx) => (
            <div key={num} className="flex items-center">
              <div className={`flex flex-col items-center ${idx > 0 ? 'ml-4' : ''}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    step >= num
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > num ? <Check size={20} /> : num}
                </div>
                <span className="text-sm mt-2 text-center">{label}</span>
              </div>
              {idx < 2 && (
                <div
                  className={`w-20 h-1 transition-all ${
                    step > num ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Selecionar Tipo */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Selecione o Tipo de Documento</CardTitle>
            <CardDescription>
              Escolha qual tipo de documento você deseja gerar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => {
                  const Icon = DOCUMENTO_ICONS[template.tipo]
                  return (
                    <DocumentoCard
                      key={template.tipo}
                      tipo={template.tipo}
                      titulo={template.nome}
                      descricao={template.descricao}
                      icon={Icon}
                      selecionado={tipoSelecionado === template.tipo}
                      onClick={() => setTipoSelecionado(template.tipo)}
                    />
                  )
                })}
              </div>
            )}

            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setStep(2)}
                disabled={!podeAvancarParaStep2}
              >
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Informações */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Informações do Documento</CardTitle>
            <CardDescription>
              Documento selecionado: <strong>{tipoSelecionado}</strong> -{' '}
              {tipoSelecionado && DOCUMENTO_TITULOS[tipoSelecionado as DocumentoTipo]}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* D2 - Requer Fiador */}
              {tipoSelecionado === 'D2' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Selecione o Fiador <span className="text-red-500">*</span>
                  </label>
                  <Select value={fiadorId} onValueChange={setFiadorId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um fiador" />
                    </SelectTrigger>
                    <SelectContent>
                      {fiadores.map((fiador) => (
                        <SelectItem key={fiador.id} value={String(fiador.id)}>
                          {fiador.pessoa.nome} - {fiador.pessoa.cpf_cnpj}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* D8, D10 - Requer Parcela */}
              {(tipoSelecionado === 'D8' || tipoSelecionado === 'D10') && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Selecione o Contrato <span className="text-red-500">*</span>
                    </label>
                    <Select value={contratoId} onValueChange={setContratoId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha um contrato" />
                      </SelectTrigger>
                      <SelectContent>
                        {contratos.map((contrato) => (
                          <SelectItem key={contrato.id} value={String(contrato.id)}>
                            {contrato.numero_contrato} - R$ {contrato.valor.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {contratoId && contratoId !== 'none' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Selecione a Parcela <span className="text-red-500">*</span>
                      </label>
                      <Select value={parcelaId} onValueChange={setParcelaId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha uma parcela" />
                        </SelectTrigger>
                        <SelectContent>
                          {parcelas.map((parcela) => (
                            <SelectItem key={parcela.id} value={String(parcela.id)}>
                              {parcela.competencia} - Venc: {parcela.vencimento} - R${' '}
                              {parcela.principal.toFixed(2)} ({parcela.status})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}

              {/* Outros documentos - Contrato opcional */}
              {tipoSelecionado &&
                tipoSelecionado !== 'D2' &&
                tipoSelecionado !== 'D8' &&
                tipoSelecionado !== 'D10' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Contrato (opcional)
                    </label>
                    <Select value={contratoId} onValueChange={setContratoId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha um contrato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum contrato</SelectItem>
                        {contratos.map((contrato) => (
                          <SelectItem key={contrato.id} value={String(contrato.id)}>
                            {contrato.numero_contrato} - R$ {contrato.valor.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1">
                      Ao selecionar um contrato, os dados serão preenchidos automaticamente
                    </p>
                  </div>
                )}

              {/* Info box */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold mb-2 text-blue-900">Como funciona?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Selecione um contrato para preencher automaticamente os dados</li>
                  <li>• Os dados serão buscados do banco de dados</li>
                  <li>• O template será interpolado com as variáveis corretas</li>
                  <li>• Você poderá visualizar o preview antes de gerar o PDF final</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button onClick={gerarDocumento} disabled={loading || !podeGerarDocumento}>
                {loading ? 'Gerando...' : 'Gerar Documento'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Preview */}
      {step === 3 && documentoGerado && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documento Gerado com Sucesso!</CardTitle>
              <CardDescription>
                O documento foi gerado e está pronto para uso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm text-gray-600">Número do Documento:</span>
                  <p className="font-mono font-semibold text-lg">
                    {documentoGerado.numero_documento}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Tipo:</span>
                  <p className="font-semibold text-lg">{documentoGerado.tipo}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={visualizarPDF}>
                  <Eye className="mr-2 h-4 w-4" />
                  Visualizar PDF
                </Button>
                <Button onClick={baixarPDF} variant="secondary">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar PDF
                </Button>
                <Button variant="outline" onClick={() => router.push('/dashboard/documentos')}>
                  Ver Todos os Documentos
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep(1)
                    setTipoSelecionado('')
                    setContratoId('none')
                    setFiadorId('none')
                    setParcelaId('none')
                    setDocumentoGerado(null)
                    setPreviewHTML('')
                  }}
                >
                  Gerar Outro Documento
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview HTML */}
          <Card>
            <CardHeader>
              <CardTitle>Preview HTML</CardTitle>
              <CardDescription>Visualização do conteúdo do documento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 max-h-96 overflow-y-auto bg-white">
                <div dangerouslySetInnerHTML={{ __html: previewHTML }} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
