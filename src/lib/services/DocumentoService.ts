/**
 * =====================================================
 * SERVICE: DocumentoService
 * =====================================================
 * Serviço para geração, interpolação e gestão de documentos
 * Implementação TDD - GREEN Phase
 * =====================================================
 */

import Handlebars from 'handlebars'
import { format, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import puppeteer from 'puppeteer'
import type {
  DocumentoTipo,
  DocumentoStatus,
  DocumentoModelo,
  DocumentoInstancia,
  Assinatura,
  AssinaturaStatus,
  GerarDocumentoInput,
  CriarAssinaturaInput,
  RegistrarAssinaturaInput,
  TemplateData,
  ValidationResult,
  PdfOptions,
} from '@/lib/types/documento'

// =====================================================
// HELPERS HANDLEBARS
// =====================================================

// Formatar moeda brasileira
Handlebars.registerHelper('formatMoney', (value: number): string => {
  if (typeof value !== 'number') return ''
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
})

// Formatar data
Handlebars.registerHelper('formatDate', (value: Date | string): string => {
  if (!value) return ''
  let date: Date
  if (typeof value === 'string') {
    // Se for string no formato ISO (YYYY-MM-DD), parse manual para evitar timezone
    const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (isoMatch) {
      const year = parseInt(isoMatch[1])
      const month = parseInt(isoMatch[2]) - 1 // Mês começa em 0
      const day = parseInt(isoMatch[3])
      date = new Date(year, month, day)
    } else {
      date = new Date(value)
    }
  } else {
    date = value
  }
  return format(date, 'dd/MM/yyyy', { locale: ptBR })
})

// Formatar CPF
Handlebars.registerHelper('formatCPF', (value: string): string => {
  if (!value || value.length !== 11) return value
  return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
})

// Formatar CNPJ
Handlebars.registerHelper('formatCNPJ', (value: string): string => {
  if (!value || value.length !== 14) return value
  return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
})

// Formatar CEP
Handlebars.registerHelper('formatCEP', (value: string): string => {
  if (!value || value.length !== 8) return value
  return value.replace(/(\d{5})(\d{3})/, '$1-$2')
})

// =====================================================
// CLASSE PRINCIPAL
// =====================================================

export class DocumentoService {
  /**
   * RN-7.7.1: Geração de Número de Documento
   * Formato: {TIPO}-{ANO}-{SEQUENCIAL}
   */
  static gerarNumeroDocumento(tipo: DocumentoTipo, ano: number, sequencial: number): string {
    if (sequencial <= 0) {
      throw new Error('Sequencial deve ser maior que zero')
    }
    if (ano < 2000 || ano > 2100) {
      throw new Error('Ano deve ser entre 2000 e 2100')
    }

    const sequencialPadded = sequencial.toString().padStart(5, '0')
    return `${tipo}-${ano}-${sequencialPadded}`
  }

  /**
   * RN-7.7.2: Interpolação de Templates (Handlebars)
   */
  static interpolarTemplate(template: string, data: TemplateData): string {
    try {
      const compiledTemplate = Handlebars.compile(template)
      return compiledTemplate(data)
    } catch (error) {
      throw new Error(`Erro ao interpolar template: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  /**
   * RN-7.7.3: Validação de Template
   */
  static validarTemplate(template: string, variaveisEsperadas: string[]): ValidationResult {
    const erros: string[] = []
    const avisos: string[] = []

    // Verifica sintaxe Handlebars
    try {
      Handlebars.compile(template)
    } catch (error) {
      erros.push(`Sintaxe Handlebars inválida: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
      return { valido: false, erros, avisos }
    }

    // Verifica se todas as variáveis esperadas estão no template
    for (const variavel of variaveisEsperadas) {
      const regex = new RegExp(`{{\\s*${variavel.replace(/\./g, '\\.')}\\s*}}`)
      if (!regex.test(template) && !template.includes(variavel)) {
        erros.push(`Variável esperada "${variavel}" não encontrada no template`)
      }
    }

    return {
      valido: erros.length === 0,
      erros,
      avisos,
    }
  }

  /**
   * RN-7.7.4: Geração de Documento Completo
   */
  static async gerarDocumento(
    input: GerarDocumentoInput,
    modelo: DocumentoModelo
  ): Promise<DocumentoInstancia> {
    // Valida dados contra variáveis esperadas
    const dataKeys = this.extractKeys(input.dados_documento)
    const missingVars = modelo.variaveis_esperadas.filter(v => !dataKeys.includes(v))

    if (missingVars.length > 0) {
      console.error('Dados incompletos para o template:', {
        missingVars,
        dataKeys,
        variaveis_esperadas: modelo.variaveis_esperadas,
        dados_documento: input.dados_documento
      })
      throw new Error(`Dados incompletos para o template. Faltam: ${missingVars.join(', ')}`)
    }

    // Interpola template
    const conteudo_html = this.interpolarTemplate(modelo.template, input.dados_documento)

    // Gera número do documento
    const ano = new Date().getFullYear()
    const sequencial = 1 // Na implementação real, buscar do banco
    const numero_documento = this.gerarNumeroDocumento(input.tipo, ano, sequencial)

    // Calcula data limite de assinatura
    let data_limite_assinatura: Date | undefined
    if (input.requer_assinatura && input.prazo_assinatura_dias) {
      data_limite_assinatura = addDays(new Date(), input.prazo_assinatura_dias)
    }

    const documento: DocumentoInstancia = {
      id: 0, // Será gerado pelo banco
      modelo_id: input.modelo_id,
      numero_documento,
      tipo: input.tipo,
      status: 'rascunho',
      contrato_id: input.contrato_id,
      parcela_id: input.parcela_id,
      locatario_id: input.locatario_id,
      fiador_id: input.fiador_id,
      imovel_id: input.imovel_id,
      dados_documento: input.dados_documento,
      conteudo_html,
      requer_assinatura: input.requer_assinatura || false,
      prazo_assinatura_dias: input.prazo_assinatura_dias,
      data_limite_assinatura,
      assinatura_provider: input.assinatura_provider,
      observacoes: input.observacoes,
      gerado_por: input.gerado_por,
      gerado_em: new Date(),
      criado_em: new Date(),
      atualizado_em: new Date(),
    }

    return documento
  }

  /**
   * Extrai todas as chaves de um objeto (incluindo aninhadas)
   */
  private static extractKeys(obj: any, prefix = ''): string[] {
    let keys: string[] = []

    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys.push(fullKey)
        keys = keys.concat(this.extractKeys(obj[key], fullKey))
      } else {
        keys.push(fullKey)
      }
    }

    return keys
  }

  /**
   * RN-7.7.5: Conversão HTML para PDF
   */
  static async htmlParaPdf(html: string, options: PdfOptions = {}): Promise<Buffer> {
    if (!html || html.trim() === '') {
      throw new Error('HTML não pode estar vazio')
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    try {
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'networkidle0' })

      const pdfBuffer = await page.pdf({
        format: options.format || 'A4',
        margin: options.margin || {
          top: 20,
          right: 15,
          bottom: 20,
          left: 15,
        },
        printBackground: true,
      })

      return Buffer.from(pdfBuffer)
    } finally {
      await browser.close()
    }
  }

  /**
   * RN-7.7.6: Numeração Sequencial por Tipo e Ano
   */
  static async obterProximoNumero(tipo: DocumentoTipo): Promise<string> {
    const ultimoNumero = await this.obterUltimoNumero(tipo)
    const ano = new Date().getFullYear()

    if (!ultimoNumero) {
      return this.gerarNumeroDocumento(tipo, ano, 1)
    }

    // Extrai o ano e sequencial do último número
    const match = ultimoNumero.match(/^([A-Z0-9]+)-(\d{4})-(\d{5})$/)
    if (!match) {
      return this.gerarNumeroDocumento(tipo, ano, 1)
    }

    const ultimoAno = parseInt(match[2])
    const ultimoSequencial = parseInt(match[3])

    // Se mudou o ano, reinicia o sequencial
    if (ultimoAno < ano) {
      return this.gerarNumeroDocumento(tipo, ano, 1)
    }

    return this.gerarNumeroDocumento(tipo, ano, ultimoSequencial + 1)
  }

  /**
   * Mock para obter último número (na implementação real, consulta o banco)
   */
  static async obterUltimoNumero(tipo: DocumentoTipo): Promise<string | null> {
    // Na implementação real, consultar o banco de dados
    // Por enquanto retorna null (mock)
    return null
  }

  /**
   * RN-7.7.7: Gerenciamento de Status
   */
  static criarRascunho(data: Partial<DocumentoInstancia>): Pick<DocumentoInstancia, 'status'> {
    return { status: 'rascunho' }
  }

  static finalizarDocumento(
    documento: Pick<DocumentoInstancia, 'status'>
  ): Pick<DocumentoInstancia, 'status' | 'gerado_em'> {
    return {
      status: 'gerado',
      gerado_em: new Date(),
    }
  }

  static enviarParaAssinatura(
    documento: Pick<DocumentoInstancia, 'status'>
  ): Pick<DocumentoInstancia, 'status' | 'enviado_em'> {
    if (documento.status !== 'gerado') {
      throw new Error('Documento deve estar no status "gerado" para ser enviado')
    }

    return {
      status: 'enviado',
      enviado_em: new Date(),
    }
  }

  static cancelarDocumento(
    documento: Pick<DocumentoInstancia, 'status'>,
    motivo: string,
    userId: string
  ): Pick<DocumentoInstancia, 'status' | 'cancelado_em' | 'cancelado_por' | 'motivo_cancelamento'> {
    if (documento.status === 'assinado') {
      throw new Error('Não é possível cancelar documento assinado')
    }

    return {
      status: 'cancelado',
      cancelado_em: new Date(),
      cancelado_por: userId,
      motivo_cancelamento: motivo,
    }
  }

  /**
   * RN-7.7.8: Assinaturas Eletrônicas
   */
  static criarAssinatura(input: CriarAssinaturaInput): Omit<Assinatura, 'id' | 'criado_em' | 'atualizado_em'> {
    return {
      documento_id: input.documento_id,
      pessoa_id: input.pessoa_id,
      nome_signatario: input.nome_signatario,
      email_signatario: input.email_signatario,
      cpf_signatario: input.cpf_signatario,
      tipo_signatario: input.tipo_signatario,
      ordem_assinatura: input.ordem_assinatura,
      status: 'pendente',
    }
  }

  static registrarAssinatura(
    assinatura: Pick<Assinatura, 'status'>,
    input: RegistrarAssinaturaInput
  ): Pick<Assinatura, 'status' | 'assinado_em' | 'ip_assinatura' | 'token_assinatura'> {
    return {
      status: 'assinado',
      assinado_em: new Date(),
      ip_assinatura: input.ip,
      token_assinatura: input.token,
    }
  }

  static recusarAssinatura(
    assinatura: Pick<Assinatura, 'status'>,
    motivo: string
  ): Pick<Assinatura, 'status' | 'recusado_em' | 'motivo_recusa'> {
    return {
      status: 'recusado',
      recusado_em: new Date(),
      motivo_recusa: motivo,
    }
  }

  static todasAssinaturasColetadas(assinaturas: Array<Pick<Assinatura, 'status'>>): boolean {
    return assinaturas.every(a => a.status === 'assinado')
  }

  /**
   * RN-7.7.9: Expiração de Documentos
   */
  static verificarExpiracao(
    documento: Pick<DocumentoInstancia, 'status' | 'data_limite_assinatura'>,
    hoje: Date = new Date()
  ): Pick<DocumentoInstancia, 'status'> {
    // Documentos já assinados não expiram
    if (documento.status === 'assinado') {
      return { status: documento.status }
    }

    // Verifica se está dentro do prazo
    if (documento.data_limite_assinatura && documento.data_limite_assinatura < hoje) {
      if (documento.status === 'enviado' || documento.status === 'parcialmente_assinado') {
        return { status: 'expirado' }
      }
    }

    return { status: documento.status }
  }

  /**
   * RN-7.7.10: Templates dos 10 Documentos Obrigatórios
   */
  static obterTemplatePadrao(tipo: DocumentoTipo): Pick<DocumentoModelo, 'tipo' | 'variaveis_esperadas'> {
    const templates: Record<DocumentoTipo, string[]> = {
      D1: ['locatario.nome', 'locatario.cpf', 'locatario.rg', 'locatario.email', 'locatario.telefone'],
      D2: ['fiador.nome', 'fiador.cpf', 'fiador.rg', 'fiador.email', 'fiador.telefone'],
      D3: [
        'contrato.numero',
        'contrato.valor',
        'contrato.data_inicio',
        'contrato.data_fim',
        'imovel.endereco',
        'locatario.nome',
        'proprietario.nome',
      ],
      D4: ['imovel.endereco', 'contrato.numero', 'data_vistoria'],
      D5: ['imovel.endereco', 'contrato.numero', 'data_vistoria'],
      D6: ['locatario.nome', 'locatario.cpf', 'contrato.numero', 'conta.banco', 'conta.agencia', 'conta.numero'],
      D7: ['locatario.nome', 'imovel.endereco', 'contrato.numero', 'data_entrega', 'chaves.quantidade'],
      D8: ['locatario.nome', 'parcela.vencimento', 'parcela.valor_total', 'parcela.dias_atraso'],
      D9: ['locatario.nome', 'contrato.numero', 'imovel.endereco', 'motivo_rescisao', 'data_rescisao'],
      D10: ['locatario.nome', 'pagamento.valor', 'pagamento.data', 'pagamento.forma_pagamento'],
    }

    if (!templates[tipo]) {
      throw new Error('Tipo de documento inválido')
    }

    return {
      tipo,
      variaveis_esperadas: templates[tipo],
    }
  }
}
