/**
 * VALIDAÇÕES FINANCEIRO
 *
 * Schemas Zod para validação de dados do módulo financeiro
 */

import { z } from 'zod'

/**
 * Schema para filtros de parcela
 */
export const parcelaFiltersSchema = z.object({
  contrato_id: z.number().positive().optional(),
  status: z
    .array(
      z.enum(['pendente', 'emitido', 'pago', 'vencido', 'cancelado', 'estornado'])
    )
    .optional(),
  data_inicio: z.string().datetime().optional(),
  data_fim: z.string().datetime().optional(),
  locatario: z.string().min(1).optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(10),
})

export type ParcelaFiltersInput = z.infer<typeof parcelaFiltersSchema>

/**
 * Schema para filtros de cobrança
 */
export const cobrancaFiltersSchema = z.object({
  gateway: z
    .array(z.enum(['asaas', 'gerencianet', 'iugu', 'pagarme']))
    .optional(),
  status: z
    .array(
      z.enum(['criada', 'emitida', 'paga', 'vencida', 'cancelada', 'estornada'])
    )
    .optional(),
  data_emissao_inicio: z.string().datetime().optional(),
  data_emissao_fim: z.string().datetime().optional(),
  data_pagamento_inicio: z.string().datetime().optional(),
  data_pagamento_fim: z.string().datetime().optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(10),
})

export type CobrancaFiltersInput = z.infer<typeof cobrancaFiltersSchema>

/**
 * Schema para baixa manual de parcela
 *
 * Validações:
 * - Data de pagamento <= hoje
 * - Valor pago > 0
 * - Comprovante obrigatório se valor >= R$ 1000
 */
export const baixaManualSchema = z
  .object({
    parcela_id: z.number().positive('Parcela inválida'),
    data_pagamento: z
      .date()
      .max(new Date(), 'Data de pagamento não pode ser futura'),
    valor_pago: z.number().positive('Valor pago deve ser maior que zero'),
    forma_pagamento: z.enum(['dinheiro', 'transferencia', 'pix', 'cartao']),
    observacoes: z.string().max(500, 'Observações muito longas').optional(),
    comprovante: z
      .instanceof(File, { message: 'Comprovante deve ser um arquivo' })
      .optional(),
  })
  .refine(
    (data) => {
      // Comprovante obrigatório para valores >= R$ 1000
      if (data.valor_pago >= 1000 && !data.comprovante) {
        return false
      }
      return true
    },
    {
      message: 'Comprovante obrigatório para valores acima de R$ 1.000,00',
      path: ['comprovante'],
    }
  )

export type BaixaManualFormData = z.infer<typeof baixaManualSchema>

/**
 * Schema para emissão de boleto
 */
export const emitirBoletoSchema = z.object({
  parcela_id: z.number().positive('Parcela inválida'),
  gateway: z.enum(['asaas', 'gerencianet', 'iugu', 'pagarme']),
  enviar_notificacao: z.boolean().default(true),
  canais_notificacao: z
    .array(z.enum(['email', 'whatsapp', 'sms']))
    .min(1, 'Selecione pelo menos um canal de notificação')
    .default(['email']),
})

export type EmitirBoletoFormData = z.infer<typeof emitirBoletoSchema>

/**
 * Schema para cancelamento de cobrança
 */
export const cancelarCobrancaSchema = z.object({
  cobranca_id: z.number().positive('Cobrança inválida'),
  motivo: z
    .string()
    .min(10, 'Motivo deve ter pelo menos 10 caracteres')
    .max(500, 'Motivo muito longo'),
})

export type CancelarCobrancaFormData = z.infer<typeof cancelarCobrancaSchema>

/**
 * Schema para reenvio de boleto
 */
export const reenviarBoletoSchema = z.object({
  cobranca_id: z.number().positive('Cobrança inválida'),
  canal: z.enum(['email', 'whatsapp', 'sms']),
  destinatario: z.string().min(1, 'Destinatário obrigatório'),
})

export type ReenviarBoletoFormData = z.infer<typeof reenviarBoletoSchema>

/**
 * Schema para marcação de repasse como pago
 */
export const marcarRepassePagoSchema = z.object({
  repasse_id: z.number().positive('Repasse inválido'),
  data_pagamento: z
    .date()
    .max(new Date(), 'Data de pagamento não pode ser futura'),
  comprovante: z.instanceof(File, {
    message: 'Comprovante de pagamento obrigatório',
  }),
  observacoes: z.string().max(500, 'Observações muito longas').optional(),
})

export type MarcarRepassePagoFormData = z.infer<typeof marcarRepassePagoSchema>

/**
 * Schema para geração de relatório de repasse
 */
export const gerarRelatorioRepasseSchema = z.object({
  proprietario_id: z.number().positive('Proprietário inválido'),
  mes: z.number().min(1).max(12, 'Mês inválido'),
  ano: z
    .number()
    .min(2020, 'Ano muito antigo')
    .max(new Date().getFullYear() + 1, 'Ano inválido'),
  incluir_comprovantes: z.boolean().default(false),
  formato: z.enum(['pdf', 'excel']).default('pdf'),
})

export type GerarRelatorioRepasseFormData = z.infer<
  typeof gerarRelatorioRepasseSchema
>

/**
 * Schema para exportação de parcelas
 */
export const exportarParcelasSchema = z.object({
  formato: z.enum(['csv', 'excel', 'pdf']),
  filtros: parcelaFiltersSchema.optional(),
  incluir_totalizadores: z.boolean().default(true),
})

export type ExportarParcelasFormData = z.infer<typeof exportarParcelasSchema>

/**
 * Validações auxiliares
 */

/**
 * Valida se arquivo é uma imagem válida
 */
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  const maxSize = 5 * 1024 * 1024 // 5MB

  return validTypes.includes(file.type) && file.size <= maxSize
}

/**
 * Valida CPF ou CNPJ
 */
export const cpfCnpjSchema = z
  .string()
  .refine(
    (val) => {
      const cleaned = val.replace(/\D/g, '')
      return cleaned.length === 11 || cleaned.length === 14
    },
    { message: 'CPF ou CNPJ inválido' }
  )

/**
 * Valida email
 */
export const emailSchema = z.string().email('Email inválido')

/**
 * Valida telefone brasileiro
 */
export const telefoneSchema = z
  .string()
  .regex(/^\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$/, 'Telefone inválido')
