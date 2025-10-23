// ============================================================================
// Types: Sistema Imobiliário
// Description: TypeScript types for all entities in the real estate system
// ============================================================================

// ============================================================================
// Base Types
// ============================================================================
export interface BaseEntity {
  id: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// ============================================================================
// Reference Tables
// ============================================================================
export interface Profissao extends BaseEntity {
  descricao: string
}

export interface TipoLocacao extends BaseEntity {
  descricao: string
}

export interface TipoImovel extends BaseEntity {
  descricao: string
}

// ============================================================================
// Endereco
// ============================================================================
export interface Endereco extends BaseEntity {
  cep: string
  logradouro: string
  numero: string
  complemento: string | null
  bairro: string
  cidade: string
  uf: string
  pais: string
}

export interface EnderecoInput {
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade?: string
  uf?: string
  pais?: string
}

export interface EnderecoCompleto {
  id: number
  cep_formatado: string
  endereco_completo: string
  cidade: string
  uf: string
}

// ============================================================================
// Pessoa
// ============================================================================
export interface Pessoa extends BaseEntity {
  nome: string
  data_nascimento: string | null
  cpf: string | null
  rg: string | null
  profissao_id: number | null
  endereco_id: number | null
  email: string | null
  telefone: string | null
  data_registro: string
  observacoes: string | null
  // Relations (populated via joins)
  profissao?: Profissao
  endereco?: Endereco
}

export interface PessoaInput {
  nome: string
  data_nascimento?: string
  cpf?: string
  rg?: string
  profissao_id?: number
  endereco_id?: number
  email?: string
  telefone?: string
  observacoes?: string
}

export interface PessoaCompleta extends Pessoa {
  cpf_formatado: string | null
  profissao_nome: string | null
  endereco_completo: string | null
  idade: number | null
}

// ============================================================================
// Locador
// ============================================================================
export type TipoPessoa = 'fisica' | 'juridica'

export interface Locador extends BaseEntity {
  pessoa_id: number
  tipo_pessoa: TipoPessoa
  cnpj: string | null
  razao_social: string | null
  // Relations
  pessoa?: Pessoa
}

export interface LocadorInput {
  pessoa_id: number
  tipo_pessoa: TipoPessoa
  cnpj?: string
  razao_social?: string
}

export interface LocadorCompleto extends Locador {
  nome: string
  cpf: string | null
  cnpj_formatado: string | null
  telefone: string | null
  email: string | null
  endereco_completo: string | null
  total_imoveis: number
}

// ============================================================================
// Locatario
// ============================================================================
export interface Locatario extends BaseEntity {
  pessoa_id: number
  referencias: string | null
  renda_mensal: number | null
  // Relations
  pessoa?: Pessoa
}

export interface LocatarioInput {
  pessoa_id: number
  referencias?: string
  renda_mensal?: number
}

export interface LocatarioCompleto extends Locatario {
  nome: string
  cpf: string | null
  cpf_formatado: string | null
  telefone: string | null
  email: string | null
  endereco_completo: string | null
  contratos_ativos: number
}

// ============================================================================
// Fiador
// ============================================================================
export interface Fiador extends BaseEntity {
  pessoa_id: number
  patrimonio_estimado: number | null
  observacoes: string | null
  // Relations
  pessoa?: Pessoa
}

export interface FiadorInput {
  pessoa_id: number
  patrimonio_estimado?: number
  observacoes?: string
}

export interface FiadorCompleto extends Fiador {
  nome: string
  cpf: string | null
  cpf_formatado: string | null
  telefone: string | null
  email: string | null
  endereco_completo: string | null
  contratos_ativos: number
}

// ============================================================================
// Imovel
// ============================================================================
export interface Imovel extends BaseEntity {
  endereco_id: number
  locador_id: number
  tipo_imovel_id: number
  codigo_imovel: string | null
  descricao: string | null
  area_total: number | null
  area_construida: number | null
  quartos: number | null
  banheiros: number | null
  vagas_garagem: number | null
  valor_aluguel: number
  valor_condominio: number | null
  iptu: number | null
  disponivel: boolean
  data_disponibilidade: string | null
  observacoes: string | null
  // Relations
  endereco?: Endereco
  locador?: Locador
  tipo_imovel?: TipoImovel
}

export interface ImovelInput {
  endereco_id: number
  locador_id: number
  tipo_imovel_id: number
  codigo_imovel?: string
  descricao?: string
  area_total?: number
  area_construida?: number
  quartos?: number
  banheiros?: number
  vagas_garagem?: number
  valor_aluguel: number
  valor_condominio?: number
  iptu?: number
  disponivel?: boolean
  data_disponibilidade?: string
  observacoes?: string
}

export interface ImovelCompleto extends Imovel {
  tipo_imovel_nome: string
  endereco_completo: string
  cep_formatado: string
  bairro: string
  cidade: string
  locador_nome: string
  locador_telefone: string | null
  valor_total_mensal: number
  status_ocupacao: 'disponivel' | 'ocupado' | 'manutencao'
}

export interface ImovelFiltros {
  tipo_imovel_id?: number
  locador_id?: number
  disponivel?: boolean
  valor_min?: number
  valor_max?: number
  quartos_min?: number
  quartos_max?: number
  bairro?: string
  cidade?: string
}

// ============================================================================
// Empresa Cliente
// ============================================================================
export interface EmpresaCliente extends BaseEntity {
  descricao: string
  razao_social: string | null
  nome_fantasia: string | null
  cnpj: string | null
  inscricao_estadual: string | null
  inscricao_municipal: string | null
  endereco_id: number
  imovel_id: number | null
  email: string | null
  telefone: string | null
  contato_principal: string | null
  observacoes: string | null
  // Relations
  endereco?: Endereco
  imovel?: Imovel
}

export interface EmpresaClienteInput {
  descricao: string
  razao_social?: string
  nome_fantasia?: string
  cnpj?: string
  inscricao_estadual?: string
  inscricao_municipal?: string
  endereco_id: number
  imovel_id?: number
  email?: string
  telefone?: string
  contato_principal?: string
  observacoes?: string
}

export interface EmpresaClienteCompleta extends EmpresaCliente {
  cnpj_formatado: string | null
  endereco_completo: string | null
  imovel_codigo: string | null
  imovel_endereco: string | null
}

// ============================================================================
// Contrato Locacao
// ============================================================================
export type StatusContrato = 'ativo' | 'pendente' | 'encerrado' | 'cancelado' | 'renovado'

export interface ContratoLocacao extends BaseEntity {
  numero_contrato: string | null
  imovel_id: number
  locatario_id: number
  fiador_id: number | null
  tipo_locacao_id: number
  valor: number
  caucao: number | null
  valor_iptu: number | null
  valor_condominio: number | null
  data_inicio_contrato: string
  data_fim_contrato: string
  data_vencimento_aluguel: number
  indice_reajuste: string
  periodicidade_reajuste: number
  data_ultimo_reajuste: string | null
  status: StatusContrato
  dia_vencimento: number
  observacoes: string | null
  clausulas_especiais: string | null
  contrato_assinado: boolean
  data_assinatura: string | null
  arquivo_contrato_url: string | null
  // Relations
  imovel?: Imovel
  locatario?: Locatario
  fiador?: Fiador
  tipo_locacao?: TipoLocacao
}

export interface ContratoLocacaoInput {
  imovel_id: number
  locatario_id: number
  fiador_id?: number
  tipo_locacao_id: number
  valor: number
  caucao?: number
  valor_iptu?: number
  valor_condominio?: number
  data_inicio_contrato: string
  data_fim_contrato: string
  data_vencimento_aluguel?: number
  indice_reajuste?: string
  periodicidade_reajuste?: number
  dia_vencimento?: number
  observacoes?: string
  clausulas_especiais?: string
}

export interface ContratoLocacaoCompleto extends ContratoLocacao {
  imovel_codigo: string
  imovel_descricao: string | null
  imovel_endereco: string
  tipo_imovel_nome: string
  locatario_nome: string
  locatario_cpf: string | null
  locatario_telefone: string | null
  locador_nome: string
  locador_telefone: string | null
  fiador_nome: string | null
  fiador_telefone: string | null
  tipo_locacao_nome: string
  dias_restantes: number | null
  valor_total_mensal: number
  tempo_contrato_meses: number
}

export interface ContratoFiltros {
  imovel_id?: number
  locatario_id?: number
  locador_id?: number
  status?: StatusContrato
  data_inicio_min?: string
  data_inicio_max?: string
  data_fim_min?: string
  data_fim_max?: string
  tipo_locacao_id?: number
}

// ============================================================================
// Historico Reajuste
// ============================================================================
export interface HistoricoReajuste {
  id: number
  contrato_locacao_id: number
  data_reajuste: string
  valor_anterior: number
  valor_novo: number
  percentual_reajuste: number
  indice_utilizado: string
  observacoes: string | null
  created_at: string
}

export interface HistoricoReajusteInput {
  contrato_locacao_id: number
  data_reajuste: string
  valor_anterior: number
  valor_novo: number
  percentual_reajuste: number
  indice_utilizado: string
  observacoes?: string
}

// ============================================================================
// Views
// ============================================================================
export interface ViewImovelCompleto {
  id: number
  codigo_imovel: string
  descricao: string | null
  area_total: number | null
  area_construida: number | null
  quartos: number | null
  banheiros: number | null
  vagas_garagem: number | null
  valor_aluguel: number
  valor_condominio: number | null
  iptu: number | null
  disponivel: boolean
  data_disponibilidade: string | null
  tipo_imovel: string
  cep: string
  logradouro: string
  numero: string
  complemento: string | null
  bairro: string
  cidade: string
  uf: string
  pais: string
  locador_id: number
  locador_nome: string
  locador_cpf: string | null
  locador_telefone: string | null
  locador_email: string | null
  created_at: string
  updated_at: string
}

export interface ViewContratoAtivo {
  id: number
  numero_contrato: string | null
  valor: number
  caucao: number | null
  data_inicio_contrato: string
  data_fim_contrato: string
  dia_vencimento: number
  status: StatusContrato
  codigo_imovel: string
  imovel_descricao: string | null
  tipo_imovel: string
  imovel_cep: string
  imovel_endereco_completo: string
  imovel_cidade: string
  locatario_nome: string
  locatario_cpf: string | null
  locatario_telefone: string | null
  locatario_email: string | null
  locador_nome: string
  locador_cpf: string | null
  locador_telefone: string | null
  fiador_nome: string | null
  fiador_cpf: string | null
  fiador_telefone: string | null
  tipo_locacao: string
  created_at: string
  updated_at: string
}

export interface ViewContratoVencendo {
  id: number
  numero_contrato: string | null
  data_fim_contrato: string
  dias_restantes: number
  codigo_imovel: string
  locatario_nome: string
  locatario_telefone: string | null
  valor: number
}

// ============================================================================
// Dashboard & Analytics
// ============================================================================
export interface DashboardStats {
  total_imoveis: number
  imoveis_disponiveis: number
  imoveis_ocupados: number
  total_contratos_ativos: number
  contratos_vencendo_60_dias: number
  receita_mensal_total: number
  valor_medio_aluguel: number
  taxa_ocupacao: number
}

export interface ImoveisPorTipo {
  tipo_imovel: string
  quantidade: number
  percentual: number
}

export interface ContratoesPorStatus {
  status: StatusContrato
  quantidade: number
  valor_total: number
}

export interface ReceitaMensal {
  mes: string
  ano: number
  receita_total: number
  numero_contratos: number
}

// ============================================================================
// Utility Types
// ============================================================================
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  message?: string
}

// ============================================================================
// Form State Types
// ============================================================================
export interface PessoaFormData extends PessoaInput {
  criar_locador?: boolean
  criar_locatario?: boolean
  criar_fiador?: boolean
  tipo_pessoa_locador?: TipoPessoa
  cnpj_locador?: string
  razao_social_locador?: string
  referencias_locatario?: string
  renda_mensal_locatario?: number
  patrimonio_fiador?: number
  observacoes_fiador?: string
}

export interface ImovelFormData extends ImovelInput {
  criar_endereco?: boolean
  endereco_data?: EnderecoInput
}

export interface ContratoFormData extends ContratoLocacaoInput {
  gerar_numero_automatico?: boolean
  copiar_valores_imovel?: boolean
}
