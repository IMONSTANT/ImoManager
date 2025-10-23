/**
 * @file contrato.fixtures.ts
 * @description Test fixtures for contract (Contrato Locação) related data
 * @usage Import these fixtures in integration and E2E tests for consistent test data
 */

import type { ContratoLocacaoFormData } from '@/lib/validations/imobiliaria'

// ============================================================================
// VALID CONTRATO DATA
// ============================================================================

export const validContratoData: ContratoLocacaoFormData = {
  imovel_id: 1,
  locatario_id: 1,
  fiador_id: 1,
  tipo_locacao_id: 1,
  valor: 2500.00,
  caucao: 5000.00,
  valor_iptu: 150.00,
  valor_condominio: 300.00,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: '2025-01-01',
  data_vencimento_aluguel: 10,
  indice_reajuste: 'IGPM',
  periodicidade_reajuste: 12,
  dia_vencimento: 10,
  observacoes: 'Contrato residencial padrão',
  clausulas_especiais: 'Permite animais de estimação de pequeno porte'
}

export const minimalValidContratoData = {
  imovel_id: 1,
  locatario_id: 1,
  tipo_locacao_id: 1,
  valor: 2000.00,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: '2024-12-31'
}

export const shortTermContratoData: ContratoLocacaoFormData = {
  imovel_id: 2,
  locatario_id: 2,
  tipo_locacao_id: 2,
  valor: 3000.00,
  caucao: 3000.00,
  data_inicio_contrato: '2024-06-01',
  data_fim_contrato: '2024-12-31',
  data_vencimento_aluguel: 5,
  dia_vencimento: 5,
  indice_reajuste: 'IPCA',
  periodicidade_reajuste: 6,
  observacoes: 'Contrato de curta duração'
}

export const longTermContratoData: ContratoLocacaoFormData = {
  imovel_id: 3,
  locatario_id: 3,
  fiador_id: 2,
  tipo_locacao_id: 1,
  valor: 4500.00,
  caucao: 13500.00,
  valor_iptu: 300.00,
  valor_condominio: 600.00,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: '2029-01-01', // 5 years
  data_vencimento_aluguel: 15,
  dia_vencimento: 15,
  indice_reajuste: 'IGPM',
  periodicidade_reajuste: 12,
  clausulas_especiais: 'Renovação automática se não houver notificação com 90 dias de antecedência'
}

// ============================================================================
// INVALID CONTRATO DATA - RN-008: Data fim > data início
// ============================================================================

export const sameDateContratoData = {
  imovel_id: 1,
  locatario_id: 1,
  tipo_locacao_id: 1,
  valor: 2000.00,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: '2024-01-01' // Same date!
}

export const endBeforeStartContratoData = {
  imovel_id: 1,
  locatario_id: 1,
  tipo_locacao_id: 1,
  valor: 2000.00,
  data_inicio_contrato: '2024-12-31',
  data_fim_contrato: '2024-01-01' // End before start!
}

export const oneDayContratoData = {
  imovel_id: 1,
  locatario_id: 1,
  tipo_locacao_id: 1,
  valor: 2000.00,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: '2024-01-02' // Minimal valid duration
}

// ============================================================================
// INVALID CONTRATO DATA - RN-009: Dia vencimento entre 1-31
// ============================================================================

export const zeroDiaVencimentoData = {
  imovel_id: 1,
  locatario_id: 1,
  tipo_locacao_id: 1,
  valor: 2000.00,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: '2024-12-31',
  dia_vencimento: 0
}

export const day32VencimentoData = {
  imovel_id: 1,
  locatario_id: 1,
  tipo_locacao_id: 1,
  valor: 2000.00,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: '2024-12-31',
  dia_vencimento: 32
}

export const negativeDiaVencimentoData = {
  imovel_id: 1,
  locatario_id: 1,
  tipo_locacao_id: 1,
  valor: 2000.00,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: '2024-12-31',
  dia_vencimento: -5
}

export const day1VencimentoData = {
  imovel_id: 1,
  locatario_id: 1,
  tipo_locacao_id: 1,
  valor: 2000.00,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: '2024-12-31',
  dia_vencimento: 1 // Lower boundary (valid)
}

export const day31VencimentoData = {
  imovel_id: 1,
  locatario_id: 1,
  tipo_locacao_id: 1,
  valor: 2000.00,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: '2024-12-31',
  dia_vencimento: 31 // Upper boundary (valid)
}

// ============================================================================
// INVALID CONTRATO DATA - Monetary values
// ============================================================================

export const negativeValorContratoData = {
  imovel_id: 1,
  locatario_id: 1,
  tipo_locacao_id: 1,
  valor: -500.00,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: '2024-12-31'
}

export const zeroValorContratoData = {
  imovel_id: 1,
  locatario_id: 1,
  tipo_locacao_id: 1,
  valor: 0,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: '2024-12-31'
}

export const negativeCaucaoData = {
  imovel_id: 1,
  locatario_id: 1,
  tipo_locacao_id: 1,
  valor: 2000.00,
  caucao: -1000.00,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: '2024-12-31'
}

export const negativeIptuContratoData = {
  imovel_id: 1,
  locatario_id: 1,
  tipo_locacao_id: 1,
  valor: 2000.00,
  valor_iptu: -50.00,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: '2024-12-31'
}

export const negativeCondominioContratoData = {
  imovel_id: 1,
  locatario_id: 1,
  tipo_locacao_id: 1,
  valor: 2000.00,
  valor_condominio: -100.00,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: '2024-12-31'
}

// ============================================================================
// MISSING REQUIRED FIELDS
// ============================================================================

export const missingImovelIdData = {
  locatario_id: 1,
  tipo_locacao_id: 1,
  valor: 2000.00,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: '2024-12-31'
}

export const missingLocatarioIdData = {
  imovel_id: 1,
  tipo_locacao_id: 1,
  valor: 2000.00,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: '2024-12-31'
}

export const missingValorData = {
  imovel_id: 1,
  locatario_id: 1,
  tipo_locacao_id: 1,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: '2024-12-31'
}

export const emptyDataInicioData = {
  imovel_id: 1,
  locatario_id: 1,
  tipo_locacao_id: 1,
  valor: 2000.00,
  data_inicio_contrato: '',
  data_fim_contrato: '2024-12-31'
}

export const emptyDataFimData = {
  imovel_id: 1,
  locatario_id: 1,
  tipo_locacao_id: 1,
  valor: 2000.00,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: ''
}

// ============================================================================
// EDGE CASES
// ============================================================================

export const luxuryContratoData: ContratoLocacaoFormData = {
  imovel_id: 4,
  locatario_id: 4,
  fiador_id: 3,
  tipo_locacao_id: 1,
  valor: 50000.00,
  caucao: 150000.00,
  valor_iptu: 1200.00,
  valor_condominio: 2000.00,
  data_inicio_contrato: '2024-01-01',
  data_fim_contrato: '2027-01-01',
  data_vencimento_aluguel: 1,
  dia_vencimento: 1,
  indice_reajuste: 'IGPM',
  periodicidade_reajuste: 12,
  clausulas_especiais: 'Propriedade de alto padrão com cláusulas especiais'
}

export const commercialContratoData: ContratoLocacaoFormData = {
  imovel_id: 5,
  locatario_id: 5,
  tipo_locacao_id: 3,
  valor: 8000.00,
  caucao: 24000.00,
  valor_iptu: 500.00,
  valor_condominio: 1200.00,
  data_inicio_contrato: '2024-03-01',
  data_fim_contrato: '2029-03-01',
  data_vencimento_aluguel: 10,
  dia_vencimento: 10,
  indice_reajuste: 'IPCA',
  periodicidade_reajuste: 12,
  observacoes: 'Contrato comercial',
  clausulas_especiais: 'Horário de funcionamento: 8h às 22h'
}

// ============================================================================
// MOCK DATABASE RESPONSES
// ============================================================================

export const mockContrato = {
  id: 1,
  ...validContratoData,
  numero_contrato: 'CTR20240001',
  status: 'ativo',
  data_assinatura: '2023-12-15',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  deleted_at: null,
  organization_id: 'org-123'
}

export const mockContratoList = [
  { id: 1, ...validContratoData, numero_contrato: 'CTR20240001', status: 'ativo' },
  { id: 2, ...shortTermContratoData, numero_contrato: 'CTR20240002', status: 'ativo' },
  { id: 3, ...longTermContratoData, numero_contrato: 'CTR20240003', status: 'pendente' }
]

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const contratoErrorMessages = {
  dataFimInvalid: 'Data de fim deve ser posterior à data de início',
  diaVencimentoRange: 'Dia de vencimento deve ser entre 1 e 31',
  valorRequired: 'Valor do aluguel é obrigatório',
  valorNegative: 'Valor do aluguel é obrigatório',
  caucaoNegative: 'Caução deve ser positiva',
  iptuNegative: 'Valor do IPTU deve ser positivo',
  condominioNegative: 'Valor do condomínio deve ser positivo',
  dataInicioRequired: 'Data de início é obrigatória',
  dataFimRequired: 'Data de fim é obrigatória',
  imovelRequired: 'Selecione um imóvel',
  locatarioRequired: 'Selecione um locatário',
  tipoLocacaoRequired: 'Selecione o tipo de locação',
  contratoOverlap: 'Já existe um contrato ativo para este imóvel no período informado'
}
