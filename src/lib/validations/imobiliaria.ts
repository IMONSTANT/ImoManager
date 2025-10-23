// ============================================================================
// Zod Validation Schemas: Sistema Imobiliário
// Description: Form validation schemas for all entities
// ============================================================================

import { z } from 'zod'
import { validateCPF, validateCNPJ, validateCEP, validateEmail, validatePhone } from '@/lib/utils/formatters'

// ============================================================================
// ENDERECO Schema
// ============================================================================
export const enderecoSchema = z.object({
  cep: z.string()
    .min(8, 'CEP deve ter 8 dígitos')
    .max(9, 'CEP inválido')
    .refine((val) => validateCEP(val), {
      message: 'CEP inválido'
    }),
  logradouro: z.string()
    .min(3, 'Logradouro deve ter pelo menos 3 caracteres')
    .max(120, 'Logradouro muito longo'),
  numero: z.string()
    .min(1, 'Número é obrigatório')
    .max(20, 'Número muito longo'),
  complemento: z.string().max(60, 'Complemento muito longo').optional(),
  bairro: z.string()
    .min(2, 'Bairro deve ter pelo menos 2 caracteres')
    .max(80, 'Bairro muito longo'),
  cidade: z.string()
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(80, 'Cidade muito longa')
    .default('Fortaleza'),
  uf: z.string()
    .length(2, 'UF deve ter 2 caracteres')
    .regex(/^[A-Z]{2}$/, 'UF inválido')
    .default('CE'),
  pais: z.string()
    .max(60, 'País muito longo')
    .default('Brasil')
})

export type EnderecoFormData = z.infer<typeof enderecoSchema>

// ============================================================================
// PESSOA Schema
// ============================================================================
export const pessoaSchema = z.object({
  nome: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(120, 'Nome muito longo'),
  data_nascimento: z.string().optional(),
  cpf: z.string()
    .optional()
    .refine((val) => !val || validateCPF(val), {
      message: 'CPF inválido'
    }),
  rg: z.string().max(20, 'RG muito longo').optional(),
  profissao_id: z.number().int().positive().optional(),
  endereco_id: z.number().int().positive().optional(),
  email: z.string()
    .optional()
    .refine((val) => !val || validateEmail(val), {
      message: 'E-mail inválido'
    }),
  telefone: z.string()
    .optional()
    .refine((val) => !val || validatePhone(val), {
      message: 'Telefone inválido'
    }),
  observacoes: z.string().optional()
})

export type PessoaFormData = z.infer<typeof pessoaSchema>

// ============================================================================
// LOCADOR Schema
// ============================================================================
export const locadorSchema = z.object({
  pessoa_id: z.number().int().positive('Selecione uma pessoa'),
  tipo_pessoa: z.enum(['fisica', 'juridica'], 'Selecione o tipo de pessoa'),
  cnpj: z.string()
    .optional()
    .refine((val) => !val || validateCNPJ(val), {
      message: 'CNPJ inválido'
    }),
  razao_social: z.string().max(255, 'Razão social muito longa').optional()
}).refine((data) => {
  if (data.tipo_pessoa === 'juridica') {
    return !!data.cnpj && !!data.razao_social
  }
  return true
}, {
  message: 'CNPJ e Razão Social são obrigatórios para pessoa jurídica',
  path: ['cnpj']
})

export type LocadorFormData = z.infer<typeof locadorSchema>

// ============================================================================
// LOCATARIO Schema
// ============================================================================
export const locatarioSchema = z.object({
  pessoa_id: z.number().int().positive('Selecione uma pessoa'),
  referencias: z.string().optional(),
  renda_mensal: z.number().nonnegative('Renda deve ser positiva').optional()
})

export type LocatarioFormData = z.infer<typeof locatarioSchema>

// ============================================================================
// FIADOR Schema
// ============================================================================
export const fiadorSchema = z.object({
  pessoa_id: z.number().int().positive('Selecione uma pessoa'),
  patrimonio_estimado: z.number().nonnegative('Patrimônio deve ser positivo').optional(),
  observacoes: z.string().optional()
})

export type FiadorFormData = z.infer<typeof fiadorSchema>

// ============================================================================
// IMOVEL Schema
// ============================================================================
export const imovelSchema = z.object({
  endereco_id: z.number().int().positive('Selecione um endereço'),
  locador_id: z.number().int().positive('Selecione um locador'),
  tipo_imovel_id: z.number().int().positive('Selecione o tipo de imóvel'),
  codigo_imovel: z.string().max(50, 'Código muito longo').optional(),
  descricao: z.string().optional(),
  area_total: z.number().positive('Área total deve ser positiva').optional(),
  area_construida: z.number().positive('Área construída deve ser positiva').optional(),
  quartos: z.number().int().nonnegative('Quartos deve ser positivo').optional(),
  banheiros: z.number().int().nonnegative('Banheiros deve ser positivo').optional(),
  vagas_garagem: z.number().int().nonnegative('Vagas deve ser positivo').optional(),
  valor_aluguel: z.number().positive('Valor do aluguel é obrigatório'),
  valor_condominio: z.number().nonnegative('Valor do condomínio deve ser positivo').optional(),
  iptu: z.number().nonnegative('IPTU deve ser positivo').optional(),
  disponivel: z.boolean().default(true),
  data_disponibilidade: z.string().optional(),
  observacoes: z.string().optional()
}).refine((data) => {
  if (data.area_construida && data.area_total) {
    return data.area_construida <= data.area_total
  }
  return true
}, {
  message: 'Área construída não pode ser maior que área total',
  path: ['area_construida']
})

export type ImovelFormData = z.infer<typeof imovelSchema>

// ============================================================================
// EMPRESA CLIENTE Schema
// ============================================================================
export const empresaClienteSchema = z.object({
  descricao: z.string()
    .min(3, 'Descrição deve ter pelo menos 3 caracteres')
    .max(120, 'Descrição muito longa'),
  razao_social: z.string().max(255, 'Razão social muito longa').optional(),
  nome_fantasia: z.string().max(255, 'Nome fantasia muito longo').optional(),
  cnpj: z.string()
    .optional()
    .refine((val) => !val || validateCNPJ(val), {
      message: 'CNPJ inválido'
    }),
  inscricao_estadual: z.string().max(30, 'Inscrição estadual muito longa').optional(),
  inscricao_municipal: z.string().max(30, 'Inscrição municipal muito longa').optional(),
  endereco_id: z.number().int().positive('Selecione um endereço'),
  imovel_id: z.number().int().positive().optional(),
  email: z.string()
    .optional()
    .refine((val) => !val || validateEmail(val), {
      message: 'E-mail inválido'
    }),
  telefone: z.string()
    .optional()
    .refine((val) => !val || validatePhone(val), {
      message: 'Telefone inválido'
    }),
  contato_principal: z.string().max(120, 'Nome do contato muito longo').optional(),
  observacoes: z.string().optional()
})

export type EmpresaClienteFormData = z.infer<typeof empresaClienteSchema>

// ============================================================================
// CONTRATO LOCACAO Schema
// ============================================================================
export const contratoLocacaoSchema = z.object({
  imovel_id: z.number().int().positive('Selecione um imóvel'),
  locatario_id: z.number().int().positive('Selecione um locatário'),
  fiador_id: z.number().int().positive().optional(),
  tipo_locacao_id: z.number().int().positive('Selecione o tipo de locação'),
  valor: z.number().positive('Valor do aluguel é obrigatório'),
  caucao: z.number().nonnegative('Caução deve ser positiva').optional(),
  valor_iptu: z.number().nonnegative('Valor do IPTU deve ser positivo').optional(),
  valor_condominio: z.number().nonnegative('Valor do condomínio deve ser positivo').optional(),
  data_inicio_contrato: z.string().min(1, 'Data de início é obrigatória'),
  data_fim_contrato: z.string().min(1, 'Data de fim é obrigatória'),
  data_vencimento_aluguel: z.number()
    .int()
    .min(1, 'Dia de vencimento deve ser entre 1 e 31')
    .max(31, 'Dia de vencimento deve ser entre 1 e 31')
    .default(10),
  indice_reajuste: z.string().max(20, 'Índice muito longo').default('IGPM'),
  periodicidade_reajuste: z.number().int().positive('Periodicidade deve ser positiva').default(12),
  dia_vencimento: z.number()
    .int()
    .min(1, 'Dia de vencimento deve ser entre 1 e 31')
    .max(31, 'Dia de vencimento deve ser entre 1 e 31')
    .default(10),
  observacoes: z.string().optional(),
  clausulas_especiais: z.string().optional()
}).refine((data) => {
  const inicio = new Date(data.data_inicio_contrato)
  const fim = new Date(data.data_fim_contrato)
  return fim > inicio
}, {
  message: 'Data de fim deve ser posterior à data de início',
  path: ['data_fim_contrato']
})

export type ContratoLocacaoFormData = z.infer<typeof contratoLocacaoSchema>

// ============================================================================
// HISTORICO REAJUSTE Schema
// ============================================================================
export const historicoReajusteSchema = z.object({
  contrato_locacao_id: z.number().int().positive('Selecione um contrato'),
  data_reajuste: z.string().min(1, 'Data de reajuste é obrigatória'),
  valor_anterior: z.number().positive('Valor anterior é obrigatório'),
  valor_novo: z.number().positive('Valor novo é obrigatório'),
  percentual_reajuste: z.number(),
  indice_utilizado: z.string().max(20, 'Índice muito longo'),
  observacoes: z.string().optional()
}).refine((data) => {
  return data.valor_novo !== data.valor_anterior
}, {
  message: 'Valor novo deve ser diferente do valor anterior',
  path: ['valor_novo']
})

export type HistoricoReajusteFormData = z.infer<typeof historicoReajusteSchema>

// ============================================================================
// PESSOA COMPLETA Schema (para criação com endereço)
// ============================================================================
export const pessoaCompletaSchema = z.object({
  // Dados da pessoa
  pessoa: pessoaSchema,
  // Criar endereço junto?
  criar_endereco: z.boolean().default(false),
  endereco: enderecoSchema.optional(),
  // Criar papéis?
  criar_locador: z.boolean().default(false),
  locador: locadorSchema.omit({ pessoa_id: true }).optional(),
  criar_locatario: z.boolean().default(false),
  locatario: locatarioSchema.omit({ pessoa_id: true }).optional(),
  criar_fiador: z.boolean().default(false),
  fiador: fiadorSchema.omit({ pessoa_id: true }).optional()
})

export type PessoaCompletaFormData = z.infer<typeof pessoaCompletaSchema>

// ============================================================================
// IMOVEL COMPLETO Schema (para criação com endereço)
// ============================================================================
export const imovelCompletoSchema = z.object({
  // Dados do imóvel
  imovel: imovelSchema.omit({ endereco_id: true }),
  // Criar endereço junto?
  criar_endereco: z.boolean().default(false),
  endereco: enderecoSchema.optional(),
  // Ou selecionar existente
  endereco_id: z.number().int().positive().optional()
}).refine((data) => {
  return (data.criar_endereco && data.endereco) || (!data.criar_endereco && data.endereco_id)
}, {
  message: 'Selecione um endereço existente ou crie um novo',
  path: ['endereco_id']
})

export type ImovelCompletoFormData = z.infer<typeof imovelCompletoSchema>

// ============================================================================
// SEARCH Schemas
// ============================================================================
export const searchPessoaSchema = z.object({
  termo: z.string().min(3, 'Digite pelo menos 3 caracteres')
})

export const searchImovelSchema = z.object({
  tipo_imovel_id: z.number().int().positive().optional(),
  locador_id: z.number().int().positive().optional(),
  disponivel: z.boolean().optional(),
  valor_min: z.number().nonnegative().optional(),
  valor_max: z.number().nonnegative().optional(),
  quartos_min: z.number().int().nonnegative().optional(),
  quartos_max: z.number().int().nonnegative().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional()
})

export const searchContratoSchema = z.object({
  imovel_id: z.number().int().positive().optional(),
  locatario_id: z.number().int().positive().optional(),
  status: z.enum(['ativo', 'pendente', 'encerrado', 'cancelado', 'renovado'], 'Status inválido').optional(),
  data_inicio_min: z.string().optional(),
  data_inicio_max: z.string().optional(),
  tipo_locacao_id: z.number().int().positive().optional()
})
