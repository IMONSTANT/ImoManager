/**
 * TIPOS FINANCEIRO
 *
 * Tipos TypeScript para o módulo financeiro do sistema imobiliário
 * Baseado nas tabelas: parcela, cobranca, notificacao
 */

/**
 * Status de uma parcela
 */
export type ParcelaStatus =
  | 'pendente'   // Aguardando emissão
  | 'emitido'    // Boleto/PIX emitido
  | 'pago'       // Pagamento confirmado
  | 'vencido'    // Após vencimento sem pagamento
  | 'cancelado'  // Cancelado manualmente
  | 'estornado'  // Pagamento estornado

/**
 * Entidade Parcela (espelho da tabela)
 */
export interface Parcela {
  id: number
  contrato_id: number
  numero_parcela: number
  competencia: string // YYYY-MM
  vencimento: string // ISO date
  valor_base: number
  valor_multa: number
  valor_juros: number
  valor_total: number
  valor_pago?: number
  data_pagamento?: string // ISO date
  status: ParcelaStatus
  forma_pagamento?: 'dinheiro' | 'transferencia' | 'pix' | 'cartao' | 'boleto'
  observacoes?: string
  created_at: string
  updated_at: string

  // Relacionamentos (quando joinado)
  contrato?: {
    id: number
    numero_contrato: string
    locatario: {
      pessoa: {
        nome: string
        cpf_cnpj: string
      }
    }
    imovel: {
      endereco: {
        logradouro: string
        numero: string
        bairro: string
        cidade: string
        uf: string
      }
    }
  }
}

/**
 * Status de uma cobrança
 */
export type CobrancaStatus =
  | 'criada'     // Criada mas não enviada ao gateway
  | 'emitida'    // Enviada ao gateway e aguardando pagamento
  | 'paga'       // Pagamento confirmado
  | 'vencida'    // Vencida sem pagamento
  | 'cancelada'  // Cancelada
  | 'estornada'  // Estornada

/**
 * Gateway de pagamento
 */
export type GatewayPagamento = 'asaas' | 'gerencianet' | 'iugu' | 'pagarme'

/**
 * Entidade Cobrança (espelho da tabela)
 */
export interface Cobranca {
  id: number
  parcela_id: number
  gateway: GatewayPagamento
  gateway_id?: string // ID no gateway externo
  nosso_numero?: string
  linha_digitavel?: string
  codigo_barras?: string
  qrcode_pix?: string
  url_boleto?: string
  status: CobrancaStatus
  valor: number
  data_emissao: string // ISO date
  data_pagamento?: string // ISO date
  payload_webhook?: Record<string, unknown> // JSON do webhook
  tentativas_envio: number
  created_at: string
  updated_at: string

  // Relacionamento
  parcela?: Parcela
}

/**
 * Canal de notificação
 */
export type CanalNotificacao = 'email' | 'whatsapp' | 'sms'

/**
 * Status de notificação
 */
export type NotificacaoStatus =
  | 'agendado'   // Agendada mas não enviada
  | 'enviado'    // Enviada
  | 'entregue'   // Confirmação de entrega
  | 'lido'       // Lido pelo destinatário
  | 'erro'       // Erro no envio
  | 'respondido' // Usuário respondeu

/**
 * Tipo de evento da régua
 */
export type TipoEventoRegua =
  | 'lembrete'    // D-3: Lembrete antes do vencimento
  | 'aviso'       // D+1: Aviso de atraso
  | 'reaviso_1'   // D+7: Primeiro reaviso
  | 'reaviso_2'   // D+15: Segundo reaviso (negociação)
  | 'juridico'    // D+30: Encaminhamento jurídico

/**
 * Entidade Notificação (espelho da tabela)
 */
export interface Notificacao {
  id: number
  parcela_id: number
  canal: CanalNotificacao
  tipo_evento: TipoEventoRegua
  destinatario: string // email, telefone, etc
  template_usado?: string
  mensagem?: string
  status: NotificacaoStatus
  data_agendamento?: string // ISO date
  data_envio?: string // ISO date
  data_entrega?: string // ISO date
  data_leitura?: string // ISO date
  tentativas: number
  erro_mensagem?: string
  created_at: string
  updated_at: string

  // Relacionamento
  parcela?: Parcela
}

/**
 * Filtros para busca de parcelas
 */
export interface ParcelaFilters {
  contrato_id?: number
  status?: ParcelaStatus[]
  data_inicio?: string // ISO date
  data_fim?: string // ISO date
  locatario?: string // Busca por nome
  page?: number
  limit?: number
}

/**
 * Filtros para busca de cobranças
 */
export interface CobrancaFilters {
  gateway?: GatewayPagamento[]
  status?: CobrancaStatus[]
  data_emissao_inicio?: string
  data_emissao_fim?: string
  data_pagamento_inicio?: string
  data_pagamento_fim?: string
  page?: number
  limit?: number
}

/**
 * Input para baixa manual de parcela
 */
export interface BaixaManualInput {
  parcela_id: number
  data_pagamento: Date
  valor_pago: number
  forma_pagamento: 'dinheiro' | 'transferencia' | 'pix' | 'cartao'
  observacoes?: string
  comprovante?: File
}

/**
 * Resultado de baixa manual
 */
export interface BaixaManualResult {
  parcela: Parcela
  breakdown: {
    abate_juros: number
    abate_multa: number
    abate_principal: number
    saldo_devedor: number
    quitado: boolean
  }
  comprovante_url?: string
}

/**
 * Input para emissão de boleto
 */
export interface EmitirBoletoInput {
  parcela_id: number
  gateway: GatewayPagamento
  enviar_notificacao?: boolean
  canais_notificacao?: CanalNotificacao[]
}

/**
 * Resultado de emissão de boleto
 */
export interface EmitirBoletoResult {
  cobranca: Cobranca
  notificacoes: Notificacao[]
}

/**
 * Dados de repasse para proprietário
 */
export interface RepasseProprietario {
  proprietario_id: number
  proprietario: {
    nome: string
    cpf_cnpj: string
    banco?: string
    agencia?: string
    conta?: string
  }
  periodo: {
    mes: number
    ano: number
  }
  contratos: {
    id: number
    numero_contrato: string
    imovel: string
  }[]
  parcelas_pagas: Parcela[]
  valor_bruto: number
  descontos: {
    taxa_administracao: number
    iptu?: number
    outros?: number
  }
  valor_liquido: number
  status: 'pendente' | 'pago'
  data_pagamento?: string
  comprovante_url?: string
}

/**
 * Totalizadores de parcelas
 */
export interface ParcelaTotalizadores {
  total_principal: number
  total_multa: number
  total_juros: number
  total_geral: number
  quantidade: number
  por_status: Record<ParcelaStatus, number>
}

/**
 * Evento da régua de cobrança
 */
export interface EventoRegua {
  tipo: TipoEventoRegua
  dias_referencia: number // -3, +1, +7, +15, +30
  descricao: string
  icon: string
  notificacao?: Notificacao
}

/**
 * Configuração de cores por status
 */
export const STATUS_COLORS: Record<ParcelaStatus, string> = {
  pendente: 'gray',
  emitido: 'blue',
  pago: 'green',
  vencido: 'red',
  cancelado: 'orange',
  estornado: 'yellow',
}

/**
 * Configuração de ícones por tipo de evento
 */
export const EVENTO_ICONS: Record<TipoEventoRegua, string> = {
  lembrete: 'bell',
  aviso: 'alert-triangle',
  reaviso_1: 'alert-circle',
  reaviso_2: 'message-circle',
  juridico: 'gavel',
}
