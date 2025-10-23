/**
 * @file imovel.fixtures.ts
 * @description Test fixtures for property (Imovel) related data
 * @usage Import these fixtures in integration and E2E tests for consistent test data
 */

import type { ImovelFormData } from '@/lib/validations/imobiliaria'

// ============================================================================
// VALID IMOVEL DATA
// ============================================================================

export const validImovelData: ImovelFormData = {
  endereco_id: 1,
  locador_id: 1,
  tipo_imovel_id: 1,
  codigo_imovel: 'IMV20240001',
  descricao: 'Casa ampla com 3 quartos no bairro Aldeota',
  area_total: 250.00,
  area_construida: 200.00,
  quartos: 3,
  banheiros: 2,
  vagas_garagem: 2,
  valor_aluguel: 2500.00,
  valor_condominio: 300.00,
  iptu: 150.00,
  disponivel: true,
  data_disponibilidade: '2024-01-01',
  observacoes: 'Imóvel recém reformado'
}

export const minimalValidImovelData = {
  endereco_id: 1,
  locador_id: 1,
  tipo_imovel_id: 1,
  valor_aluguel: 1500.00
}

export const apartmentImovelData: ImovelFormData = {
  endereco_id: 2,
  locador_id: 1,
  tipo_imovel_id: 2,
  codigo_imovel: 'IMV20240002',
  descricao: 'Apartamento 2 quartos com vista para o mar',
  area_total: 80.00,
  area_construida: 75.00,
  quartos: 2,
  banheiros: 1,
  vagas_garagem: 1,
  valor_aluguel: 1800.00,
  valor_condominio: 450.00,
  iptu: 80.00,
  disponivel: true
}

export const studioImovelData: ImovelFormData = {
  endereco_id: 3,
  locador_id: 2,
  tipo_imovel_id: 2,
  descricao: 'Studio moderno mobiliado',
  area_total: 35.00,
  area_construida: 33.00,
  quartos: 0, // Studio
  banheiros: 1,
  vagas_garagem: 0,
  valor_aluguel: 1200.00,
  valor_condominio: 250.00,
  iptu: 50.00,
  disponivel: true
}

// ============================================================================
// INVALID IMOVEL DATA - RN-005: Área construída > área total
// ============================================================================

export const invalidAreaImovelData = {
  endereco_id: 1,
  locador_id: 1,
  tipo_imovel_id: 1,
  area_total: 200.00,
  area_construida: 250.00, // Greater than total!
  valor_aluguel: 2000.00
}

export const boundaryEqualAreaImovelData = {
  endereco_id: 1,
  locador_id: 1,
  tipo_imovel_id: 1,
  area_total: 200.00,
  area_construida: 200.00, // Equal is valid
  valor_aluguel: 2000.00
}

// ============================================================================
// INVALID IMOVEL DATA - RN-007: Negative monetary values
// ============================================================================

export const negativeValorAluguelData = {
  endereco_id: 1,
  locador_id: 1,
  tipo_imovel_id: 1,
  valor_aluguel: -500.00
}

export const zeroValorAluguelData = {
  endereco_id: 1,
  locador_id: 1,
  tipo_imovel_id: 1,
  valor_aluguel: 0
}

export const negativeCondominioData = {
  endereco_id: 1,
  locador_id: 1,
  tipo_imovel_id: 1,
  valor_aluguel: 2000.00,
  valor_condominio: -100.00
}

export const negativeIptuData = {
  endereco_id: 1,
  locador_id: 1,
  tipo_imovel_id: 1,
  valor_aluguel: 2000.00,
  iptu: -50.00
}

export const negativeAreaTotalData = {
  endereco_id: 1,
  locador_id: 1,
  tipo_imovel_id: 1,
  area_total: -100.00,
  valor_aluguel: 2000.00
}

// ============================================================================
// INVALID IMOVEL DATA - Negative room counts
// ============================================================================

export const negativeQuartosData = {
  endereco_id: 1,
  locador_id: 1,
  tipo_imovel_id: 1,
  quartos: -1,
  valor_aluguel: 2000.00
}

export const negativeBanheirosData = {
  endereco_id: 1,
  locador_id: 1,
  tipo_imovel_id: 1,
  banheiros: -1,
  valor_aluguel: 2000.00
}

export const negativeVagasData = {
  endereco_id: 1,
  locador_id: 1,
  tipo_imovel_id: 1,
  vagas_garagem: -2,
  valor_aluguel: 2000.00
}

// ============================================================================
// MISSING REQUIRED FIELDS
// ============================================================================

export const missingEnderecoIdData = {
  locador_id: 1,
  tipo_imovel_id: 1,
  valor_aluguel: 2000.00
}

export const missingLocadorIdData = {
  endereco_id: 1,
  tipo_imovel_id: 1,
  valor_aluguel: 2000.00
}

export const missingTipoImovelIdData = {
  endereco_id: 1,
  locador_id: 1,
  valor_aluguel: 2000.00
}

export const missingValorAluguelData = {
  endereco_id: 1,
  locador_id: 1,
  tipo_imovel_id: 1
}

// ============================================================================
// EDGE CASES
// ============================================================================

export const luxuryPropertyData: ImovelFormData = {
  endereco_id: 4,
  locador_id: 3,
  tipo_imovel_id: 3,
  codigo_imovel: 'IMV20240099',
  descricao: 'Mansão de luxo com piscina, sauna e academia',
  area_total: 1500.00,
  area_construida: 800.00,
  quartos: 8,
  banheiros: 6,
  vagas_garagem: 6,
  valor_aluguel: 50000.00,
  valor_condominio: 2000.00,
  iptu: 1200.00,
  disponivel: true
}

export const commercialPropertyData: ImovelFormData = {
  endereco_id: 5,
  locador_id: 4,
  tipo_imovel_id: 4,
  codigo_imovel: 'IMV20240100',
  descricao: 'Sala comercial em edifício empresarial',
  area_total: 120.00,
  area_construida: 115.00,
  quartos: 0,
  banheiros: 2,
  vagas_garagem: 3,
  valor_aluguel: 4500.00,
  valor_condominio: 800.00,
  iptu: 300.00,
  disponivel: true
}

export const unavailablePropertyData: ImovelFormData = {
  ...validImovelData,
  disponivel: false,
  observacoes: 'Imóvel em reforma'
}

// ============================================================================
// MOCK DATABASE RESPONSES
// ============================================================================

export const mockImovel = {
  id: 1,
  ...validImovelData,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  deleted_at: null,
  organization_id: 'org-123'
}

export const mockImovelList = [
  { id: 1, ...validImovelData },
  { id: 2, ...apartmentImovelData },
  { id: 3, ...studioImovelData }
]

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const imovelErrorMessages = {
  areaInvalid: 'Área construída não pode ser maior que área total',
  valorAluguelRequired: 'Valor do aluguel é obrigatório',
  valorAluguelNegative: 'Valor do aluguel é obrigatório',
  condominioNegative: 'Valor do condomínio deve ser positivo',
  iptuNegative: 'IPTU deve ser positivo',
  areaTotalNegative: 'Área total deve ser positiva',
  areaConstruidaNegative: 'Área construída deve ser positiva',
  quartosNegative: 'Quartos deve ser positivo',
  banheirosNegative: 'Banheiros deve ser positivo',
  vagasNegative: 'Vagas deve ser positivo',
  enderecoRequired: 'Selecione um endereço',
  locadorRequired: 'Selecione um locador',
  tipoImovelRequired: 'Selecione o tipo de imóvel'
}
