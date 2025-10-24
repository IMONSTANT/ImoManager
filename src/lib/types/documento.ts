/**
 * =====================================================
 * TIPOS: MÓDULO DE DOCUMENTOS
 * =====================================================
 * Tipos TypeScript para geração, assinatura e gestão de documentos
 * Baseado em: supabase/migrations/20250101000007_create_documentos_tables.sql
 * =====================================================
 */

// =====================================================
// ENUMS
// =====================================================

export type DocumentoTipo =
  | 'D1'  // Declaração Entrega Contrato
  | 'D2'  // Ficha Cadastro Fiador
  | 'D3'  // Contrato Locação
  | 'D4'  // Termo Vistoria Entrada
  | 'D5'  // Termo Vistoria Saída
  | 'D6'  // Autorização Débito Automático
  | 'D7'  // Termo Entrega Chaves
  | 'D8'  // Notificação Atraso
  | 'D9'  // Acordo Rescisão
  | 'D10' // Recibo Pagamento

export type DocumentoStatus =
  | 'rascunho'              // Documento criado mas não finalizado
  | 'gerado'                // PDF gerado, aguardando assinaturas
  | 'enviado'               // Enviado para assinatura eletrônica
  | 'parcialmente_assinado' // Algumas assinaturas coletadas
  | 'assinado'              // Todas assinaturas coletadas
  | 'cancelado'             // Documento cancelado
  | 'expirado'              // Prazo para assinatura expirado

export type AssinaturaStatus =
  | 'pendente'  // Aguardando assinatura
  | 'assinado'  // Assinado com sucesso
  | 'recusado'  // Signatário recusou
  | 'expirado'  // Prazo expirou

export type TipoSignatario =
  | 'locatario'
  | 'fiador'
  | 'proprietario'
  | 'testemunha'
  | 'imobiliaria'

export type AssinaturaProvider = 'clicksign' | 'docusign' | 'manual'

// =====================================================
// INTERFACES - TABELAS DO BANCO
// =====================================================

export interface DocumentoModelo {
  id: number
  tipo: DocumentoTipo
  nome: string
  descricao?: string
  template: string // HTML com Handlebars
  variaveis_esperadas: string[]
  versao: number
  ativo: boolean
  data_vigencia_inicio: Date
  data_vigencia_fim?: Date
  criado_por?: string
  criado_em: Date
  atualizado_em: Date
}

export interface DocumentoInstancia {
  id: number
  modelo_id: number
  numero_documento: string
  tipo: DocumentoTipo
  status: DocumentoStatus

  // Relacionamentos opcionais
  contrato_id?: number
  parcela_id?: number
  locatario_id?: number
  fiador_id?: number
  imovel_id?: number

  // Dados do documento
  dados_documento: Record<string, any>
  conteudo_html?: string
  pdf_url?: string
  pdf_storage_path?: string

  // Assinatura
  requer_assinatura: boolean
  prazo_assinatura_dias?: number
  data_limite_assinatura?: Date
  assinatura_provider?: string
  assinatura_provider_id?: string

  // Observações
  observacoes?: string

  // Auditoria
  gerado_por?: string
  gerado_em?: Date
  enviado_em?: Date
  assinado_em?: Date
  cancelado_em?: Date
  cancelado_por?: string
  motivo_cancelamento?: string

  criado_em: Date
  atualizado_em: Date
}

export interface Assinatura {
  id: number
  documento_id: number

  // Signatário
  pessoa_id?: number
  nome_signatario: string
  email_signatario: string
  cpf_signatario?: string

  // Tipo
  tipo_signatario: TipoSignatario
  ordem_assinatura: number

  // Status
  status: AssinaturaStatus

  // Dados da assinatura
  assinado_em?: Date
  ip_assinatura?: string
  token_assinatura?: string
  certificado_digital?: string

  // Notificações
  notificado_em?: Date
  lembrete_enviado_em?: Date

  // Recusa
  recusado_em?: Date
  motivo_recusa?: string

  criado_em: Date
  atualizado_em: Date
}

export interface ArquivoAnexo {
  id: number

  // Relacionamentos opcionais
  documento_id?: number
  contrato_id?: number
  locatario_id?: number
  fiador_id?: number

  // Metadados
  nome_arquivo: string
  tipo_arquivo: string
  mime_type?: string
  tamanho_bytes?: number

  // Storage
  storage_path: string
  url_publica?: string

  // Descrição
  descricao?: string
  uploadado_por?: string
  uploadado_em: Date

  // Validação
  validado: boolean
  validado_por?: string
  validado_em?: Date
  observacoes_validacao?: string

  criado_em: Date
}

// =====================================================
// TIPOS AUXILIARES
// =====================================================

export interface TemplateData {
  [key: string]: any
}

export interface GerarDocumentoInput {
  modelo_id: number
  tipo: DocumentoTipo
  dados_documento: TemplateData
  contrato_id?: number
  parcela_id?: number
  locatario_id?: number
  fiador_id?: number
  imovel_id?: number
  requer_assinatura?: boolean
  prazo_assinatura_dias?: number
  assinatura_provider?: AssinaturaProvider
  observacoes?: string
  gerado_por?: string
}

export interface CriarAssinaturaInput {
  documento_id: number
  pessoa_id?: number
  nome_signatario: string
  email_signatario: string
  cpf_signatario?: string
  tipo_signatario: TipoSignatario
  ordem_assinatura: number
}

export interface RegistrarAssinaturaInput {
  ip: string
  token?: string
  certificado_digital?: string
}

export interface ValidationResult {
  valido: boolean
  erros: string[]
  avisos?: string[]
}

export interface PdfOptions {
  margin?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
  format?: 'A4' | 'Letter'
  orientation?: 'portrait' | 'landscape'
}

// =====================================================
// TIPOS PARA TEMPLATES DOS DOCUMENTOS
// =====================================================

// D1 - Declaração Entrega Contrato
export interface D1_DeclaracaoEntregaContratoData {
  locatarios: Array<{
    nome: string
    cpf: string
    rg: string
    nacionalidade: string
    estado_civil: string
    profissao: string
    genero_masculino?: boolean
  }>
  locatario?: {
    nome: string
    cpf: string
    rg: string
    nacionalidade: string
    estado_civil: string
    profissao: string
  }
  locador: {
    nome: string
    cpf_cnpj?: string
  }
  contrato: {
    numero: string
    valor_caucao?: number
    data_vencimento_caucao?: Date
    data_devolucao_assinado?: Date
  }
  imovel: {
    endereco: {
      logradouro: string
      numero: string
      complemento?: string
      bairro: string
      cidade: string
      estado: string
      cep: string
    }
  }
  data_emissao: Date | string
}

// D2 - Ficha Cadastro Fiador
export interface D2_FichaCadastroFiadorData {
  fiador: {
    nome: string
    cpf: string
    rg: string
    data_nascimento: Date
    nacionalidade: string
    estado_civil: string
    profissao: string
    renda_mensal: number
    email: string
    telefone: string
    endereco: {
      logradouro: string
      numero: string
      complemento?: string
      bairro: string
      cidade: string
      estado: string
      cep: string
    }
  }
  imovel_proprio?: {
    endereco: string
    matricula: string
  }
}

// D3 - Contrato de Locação
export interface D3_ContratoLocacaoData {
  contrato: {
    numero: string
    data_inicio: Date
    data_fim: Date
    valor: number
    dia_vencimento: number
    indice_reajuste: 'IGPM' | 'IPCA' | 'IGP-M'
  }
  locatario: {
    nome: string
    cpf: string
    rg: string
    estado_civil: string
    profissao: string
    endereco_completo: string
  }
  fiador?: {
    nome: string
    cpf: string
    rg: string
    estado_civil: string
    profissao: string
    endereco_completo: string
  }
  proprietario: {
    nome: string
    cpf_cnpj: string
    endereco_completo: string
  }
  imovel: {
    endereco: {
      logradouro: string
      numero: string
      complemento?: string
      bairro: string
      cidade: string
      estado: string
      cep: string
    }
    tipo: string
    descricao?: string
    matricula?: string
  }
  clausulas_especiais?: string[]
}

// D8 - Notificação de Atraso
export interface D8_NotificacaoAtrasoData {
  locatario: {
    nome: string
    cpf: string
  }
  contrato: {
    numero: string
  }
  imovel: {
    endereco_completo: string
  }
  parcela: {
    competencia: string
    vencimento: Date
    dias_atraso: number
    principal: number
    multa: number
    juros: number
    valor_total: number
  }
  data_notificacao: Date
}

// D10 - Recibo de Pagamento
export interface D10_ReciboPagamentoData {
  locatario: {
    nome: string
    cpf: string
  }
  contrato: {
    numero: string
  }
  imovel: {
    endereco_completo: string
  }
  pagamento: {
    valor: number
    data: Date
    forma_pagamento: string
    referente: string
    principal: number
    multa: number
    juros: number
  }
  recibo_numero: string
  data_emissao: Date
}

// =====================================================
// TIPOS COM RELACIONAMENTOS (para queries)
// =====================================================

export interface DocumentoInstanciaComRelacoes extends DocumentoInstancia {
  modelo?: DocumentoModelo
  assinaturas?: Assinatura[]
  anexos?: ArquivoAnexo[]
  contrato?: {
    numero_contrato: string
    valor: number
  }
  locatario?: {
    pessoa: {
      nome: string
      cpf_cnpj: string
      email: string
    }
  }
}

export interface AssinaturaComPessoa extends Assinatura {
  pessoa?: {
    nome: string
    cpf_cnpj: string
    email: string
  }
}
