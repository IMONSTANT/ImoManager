/**
 * =====================================================
 * TIPOS: CONTROLE OPERACIONAL
 * =====================================================
 * Types para rescisões, vistorias, chaves e pendências
 * =====================================================
 */

// =====================================================
// ENUMS
// =====================================================

export type RescisaoTipo =
  | 'normal'
  | 'antecipada_locador'
  | 'antecipada_locatario'
  | 'judicial'

export type RescisaoStatus =
  | 'solicitada'
  | 'em_analise'
  | 'aprovada'
  | 'concluida'
  | 'cancelada'

export type VistoriaTipo =
  | 'entrada'
  | 'saida'
  | 'periodica'
  | 'manutencao'

export type VistoriaStatus =
  | 'agendada'
  | 'realizada'
  | 'aprovada'
  | 'reprovada'
  | 'cancelada'

export type ChaveMovimentacaoTipo =
  | 'entrega'
  | 'devolucao'
  | 'copia'
  | 'perda'
  | 'reposicao'

export type PendenciaTipo =
  | 'financeira'
  | 'documental'
  | 'manutencao'
  | 'entrega'
  | 'contratual'
  | 'outro'

export type PendenciaStatus =
  | 'aberta'
  | 'em_andamento'
  | 'resolvida'
  | 'cancelada'

// =====================================================
// INTERFACES
// =====================================================

export interface Rescisao {
  id: number
  contrato_id: number

  tipo: RescisaoTipo
  status: RescisaoStatus

  data_solicitacao: Date
  data_desejada_saida: Date
  data_efetiva_saida?: Date

  solicitado_por: string
  motivo: string
  observacoes?: string

  tem_multa: boolean
  valor_multa?: number
  multa_paga?: boolean

  vistoria_saida_id?: number
  vistoria_aprovada?: boolean

  chaves_devolvidas: boolean
  data_devolucao_chaves?: Date

  tem_pendencias: boolean
  pendencias_resolvidas: boolean

  termo_rescisao_id?: number

  responsavel_id?: string

  criado_em: Date
  atualizado_em: Date
  concluido_em?: Date
}

export interface VistoriaChecklistItem {
  item: string
  categoria?: string // Ex: "Parede", "Piso", "Instalação Elétrica"
  estado: 'otimo' | 'bom' | 'regular' | 'ruim' | 'pessimo'
  observacoes?: string
  requer_reparo?: boolean
  foto_url?: string
}

export interface Vistoria {
  id: number
  contrato_id: number
  imovel_id: number

  tipo: VistoriaTipo
  status: VistoriaStatus

  data_agendada: Date
  data_realizada?: Date

  vistoriador_id?: string
  vistoriador_nome?: string

  locatario_presente: boolean
  locador_presente: boolean

  observacoes_gerais?: string
  fotos?: string[] // URLs das fotos
  checklist?: VistoriaChecklistItem[]

  aprovada?: boolean
  motivo_reprovacao?: string

  tem_pendencias: boolean

  termo_vistoria_id?: number

  criado_em: Date
  atualizado_em: Date
}

export interface ChaveMovimentacao {
  id: number
  contrato_id: number
  imovel_id: number

  tipo: ChaveMovimentacaoTipo

  data_movimentacao: Date

  quantidade_chaves: number
  descricao_chaves?: string
  numero_copia?: number

  pessoa_nome: string
  pessoa_cpf?: string
  pessoa_tipo?: string

  comprovante_storage_path?: string
  assinatura_digital?: string

  observacoes?: string
  condicao_chaves?: string

  responsavel_id?: string

  criado_em: Date
}

export interface ChaveMovimentacaoWithRelations extends ChaveMovimentacao {
  contrato?: {
    numero_contrato: string
  }
  imovel?: {
    endereco?: {
      logradouro: string
      numero: string
    }
  }
}

export interface Pendencia {
  id: number

  contrato_id?: number
  imovel_id?: number
  vistoria_id?: number
  rescisao_id?: number

  tipo: PendenciaTipo
  status: PendenciaStatus

  titulo: string
  descricao: string

  prioridade: 1 | 2 | 3 | 4 | 5

  data_limite?: Date

  valor_estimado?: number
  valor_real?: number

  responsavel_id?: string

  data_resolucao?: Date
  solucao?: string
  comprovante_storage_path?: string

  criado_em: Date
  atualizado_em: Date
}

// =====================================================
// TYPES COM RELACIONAMENTOS
// =====================================================

export interface RescisaoWithRelations extends Rescisao {
  contrato?: {
    numero_contrato: string
    valor: number
    locatario?: {
      pessoa: {
        nome: string
        cpf_cnpj: string
      }
    }
    imovel?: {
      endereco: {
        logradouro: string
        numero: string
        cidade: string
      }
    }
  }
  vistoria_saida?: Vistoria
  pendencias?: Pendencia[]
}

export interface VistoriaWithRelations extends Vistoria {
  contrato?: {
    numero_contrato: string
    locatario?: {
      pessoa: {
        nome: string
      }
    }
  }
  imovel?: {
    endereco: {
      logradouro: string
      numero: string
    }
  }
  pendencias?: Pendencia[]
}

export interface PendenciaWithRelations extends Pendencia {
  contrato?: {
    numero_contrato: string
  }
  imovel?: {
    endereco: {
      logradouro: string
      numero: string
    }
  }
  vistoria?: {
    tipo: VistoriaTipo
    data_realizada?: Date
  }
  rescisao?: {
    tipo: RescisaoTipo
    data_solicitacao: Date
  }
}

// =====================================================
// INPUT TYPES
// =====================================================

export interface CriarRescisaoInput {
  contrato_id: number
  tipo: RescisaoTipo
  data_desejada_saida: Date
  solicitado_por: string
  motivo: string
  observacoes?: string
  tem_multa?: boolean
  valor_multa?: number
}

export interface CriarVistoriaInput {
  contrato_id: number
  imovel_id: number
  tipo: VistoriaTipo
  data_agendada: Date
  vistoriador_nome?: string
}

export interface RegistrarMovimentacaoChaveInput {
  contrato_id: number
  imovel_id: number
  tipo: ChaveMovimentacaoTipo
  quantidade_chaves: number
  descricao_chaves?: string
  pessoa_nome: string
  pessoa_cpf?: string
  pessoa_tipo?: string
  observacoes?: string
  condicao_chaves?: string
}

export interface CriarPendenciaInput {
  contrato_id?: number
  imovel_id?: number
  vistoria_id?: number
  rescisao_id?: number
  tipo: PendenciaTipo
  titulo: string
  descricao: string
  prioridade: 1 | 2 | 3 | 4 | 5
  data_limite?: Date
  valor_estimado?: number
  responsavel_id?: string
}

export interface RealizarVistoriaInput {
  locatario_presente: boolean
  locador_presente: boolean
  observacoes_gerais?: string
  checklist: VistoriaChecklistItem[]
  fotos?: string[]
  aprovada: boolean
  motivo_reprovacao?: string
}

export interface ResolverPendenciaInput {
  solucao: string
  valor_real?: number
  comprovante_storage_path?: string
}

// =====================================================
// HELPER TYPES
// =====================================================

export interface RescisaoFilters {
  status?: RescisaoStatus[]
  tipo?: RescisaoTipo
  contrato_id?: number
  data_inicio?: string
  data_fim?: string
  com_pendencias?: boolean
}

export interface VistoriaFilters {
  status?: VistoriaStatus[]
  tipo?: VistoriaTipo
  contrato_id?: number
  imovel_id?: number
  data_inicio?: string
  data_fim?: string
}

export interface PendenciaFilters {
  status?: PendenciaStatus[]
  tipo?: PendenciaTipo
  prioridade?: number[]
  contrato_id?: number
  imovel_id?: number
  responsavel_id?: string
}

export interface ChaveFilters {
  tipo?: ChaveMovimentacaoTipo[]
  contrato_id?: number
  imovel_id?: number
  data_inicio?: string
  data_fim?: string
}
