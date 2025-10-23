// ============================================================================
// Supabase Client Functions: Sistema Imobiliário
// Description: Database operations for all entities
// ============================================================================

import { SupabaseClient } from '@supabase/supabase-js'
import type {
  Pessoa,
  PessoaInput,
  Locador,
  LocadorInput,
  Locatario,
  LocatarioInput,
  Fiador,
  FiadorInput,
  Endereco,
  EnderecoInput,
  Imovel,
  ImovelInput,
  ImovelFiltros,
  EmpresaCliente,
  EmpresaClienteInput,
  ContratoLocacao,
  ContratoLocacaoInput,
  ContratoFiltros,
  HistoricoReajuste,
  HistoricoReajusteInput,
  Profissao,
  TipoImovel,
  TipoLocacao,
  ViewImovelCompleto,
  ViewContratoAtivo,
  ViewContratoVencendo,
  DashboardStats,
  PaginationParams,
  PaginatedResponse
} from '@/types/imobiliaria'

// ============================================================================
// PESSOA Operations
// ============================================================================
export async function getPessoas(
  client: SupabaseClient,
  params?: PaginationParams
) {
  let query = client
    .from('pessoa')
    .select(`
      id,
      nome,
      cpf,
      email,
      telefone,
      data_nascimento,
      profissao:profissao_id (id, descricao)
    `, { count: 'exact' })
    .is('deleted_at', null)
    .order('criado_em', { ascending: false })

  if (params?.sortBy) {
    query = query.order(params.sortBy, {
      ascending: params.sortOrder === 'asc'
    })
  }

  if (params?.page && params?.limit) {
    const from = (params.page - 1) * params.limit
    const to = from + params.limit - 1
    query = query.range(from, to)
  }

  const { data, error, count } = await query

  if (error) throw error

  return {
    data,
    count: count || 0
  }
}

export async function getPessoaById(client: SupabaseClient, id: number) {
  const { data, error } = await client
    .from('pessoa')
    .select(`
      *,
      profissao:profissao_id (*),
      endereco:endereco_id (*)
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  return data
}

export async function createPessoa(
  client: SupabaseClient,
  input: PessoaInput
) {
  const { data, error } = await client
    .from('pessoa')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePessoa(
  client: SupabaseClient,
  id: number,
  input: Partial<PessoaInput>
) {
  const { data, error } = await client
    .from('pessoa')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePessoa(client: SupabaseClient, id: number) {
  const { error } = await client
    .from('pessoa')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function searchPessoas(
  client: SupabaseClient,
  searchTerm: string
) {
  const { data, error } = await client
    .from('pessoa')
    .select(`
      *,
      profissao:profissao_id (*),
      endereco:endereco_id (*)
    `)
    .or(`nome.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
    .is('deleted_at', null)
    .limit(10)

  if (error) throw error
  return data
}

// ============================================================================
// LOCADOR Operations
// ============================================================================
export async function getLocadores(client: SupabaseClient) {
  const { data, error } = await client
    .from('locador')
    .select(`
      *,
      pessoa:pessoa_id (*)
    `)
    .is('deleted_at', null)
    .order('criado_em', { ascending: false })

  if (error) throw error
  return data
}

export async function getLocadorById(client: SupabaseClient, id: number) {
  const { data, error } = await client
    .from('locador')
    .select(`
      *,
      pessoa:pessoa_id (
        *,
        profissao:profissao_id (*),
        endereco:endereco_id (*)
      )
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  return data
}

export async function createLocador(
  client: SupabaseClient,
  input: LocadorInput
) {
  const { data, error } = await client
    .from('locador')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateLocador(
  client: SupabaseClient,
  id: number,
  input: Partial<LocadorInput>
) {
  const { data, error } = await client
    .from('locador')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteLocador(client: SupabaseClient, id: number) {
  const { error } = await client
    .from('locador')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

// ============================================================================
// LOCATARIO Operations
// ============================================================================
export async function getLocatarios(client: SupabaseClient) {
  const { data, error } = await client
    .from('locatario')
    .select(`
      *,
      pessoa:pessoa_id (*)
    `)
    .is('deleted_at', null)
    .order('criado_em', { ascending: false })

  if (error) throw error
  return data
}

export async function getLocatarioById(client: SupabaseClient, id: number) {
  const { data, error } = await client
    .from('locatario')
    .select(`
      *,
      pessoa:pessoa_id (
        *,
        profissao:profissao_id (*),
        endereco:endereco_id (*)
      )
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  return data
}

export async function createLocatario(
  client: SupabaseClient,
  input: LocatarioInput
) {
  const { data, error } = await client
    .from('locatario')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateLocatario(
  client: SupabaseClient,
  id: number,
  input: Partial<LocatarioInput>
) {
  const { data, error } = await client
    .from('locatario')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteLocatario(client: SupabaseClient, id: number) {
  const { error } = await client
    .from('locatario')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

// ============================================================================
// FIADOR Operations
// ============================================================================
export async function getFiadores(client: SupabaseClient) {
  const { data, error } = await client
    .from('fiador')
    .select(`
      *,
      pessoa:pessoa_id (*)
    `)
    .is('deleted_at', null)
    .order('criado_em', { ascending: false })

  if (error) throw error
  return data
}

export async function getFiadorById(client: SupabaseClient, id: number) {
  const { data, error } = await client
    .from('fiador')
    .select(`
      *,
      pessoa:pessoa_id (
        *,
        profissao:profissao_id (*),
        endereco:endereco_id (*)
      )
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  return data
}

export async function createFiador(
  client: SupabaseClient,
  input: FiadorInput
) {
  const { data, error } = await client
    .from('fiador')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateFiador(
  client: SupabaseClient,
  id: number,
  input: Partial<FiadorInput>
) {
  const { data, error } = await client
    .from('fiador')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteFiador(client: SupabaseClient, id: number) {
  const { error } = await client
    .from('fiador')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

// ============================================================================
// ENDERECO Operations
// ============================================================================
export async function getEnderecos(client: SupabaseClient) {
  const { data, error } = await client
    .from('endereco')
    .select('*')
    .is('deleted_at', null)
    .order('criado_em', { ascending: false })

  if (error) throw error
  return data
}

export async function getEnderecoById(client: SupabaseClient, id: number) {
  const { data, error } = await client
    .from('endereco')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  return data
}

export async function createEndereco(
  client: SupabaseClient,
  input: EnderecoInput
) {
  const { data, error } = await client
    .from('endereco')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateEndereco(
  client: SupabaseClient,
  id: number,
  input: Partial<EnderecoInput>
) {
  const { data, error } = await client
    .from('endereco')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteEndereco(client: SupabaseClient, id: number) {
  const { error } = await client
    .from('endereco')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function searchEnderecoByCEP(
  client: SupabaseClient,
  cep: string
) {
  const { data, error } = await client
    .from('endereco')
    .select('*')
    .eq('cep', cep.replace(/\D/g, ''))
    .is('deleted_at', null)
    .limit(1)

  if (error) throw error
  return data?.[0] || null
}

// ============================================================================
// IMOVEL Operations
// ============================================================================
export async function getImoveis(
  client: SupabaseClient,
  filtros?: ImovelFiltros,
  params?: PaginationParams
) {
  let query = client
    .from('imovel')
    .select(`
      *,
      endereco:endereco_id (*),
      locador:locador_id (
        *,
        pessoa:pessoa_id (*)
      ),
      tipo_imovel:tipo_imovel_id (*)
    `, { count: 'exact' })
    .is('deleted_at', null)

  // Apply filters
  if (filtros?.tipo_imovel_id) {
    query = query.eq('tipo_imovel_id', filtros.tipo_imovel_id)
  }
  if (filtros?.locador_id) {
    query = query.eq('locador_id', filtros.locador_id)
  }
  if (filtros?.disponivel !== undefined) {
    query = query.eq('disponivel', filtros.disponivel)
  }
  if (filtros?.valor_min) {
    query = query.gte('valor_aluguel', filtros.valor_min)
  }
  if (filtros?.valor_max) {
    query = query.lte('valor_aluguel', filtros.valor_max)
  }
  if (filtros?.quartos_min) {
    query = query.gte('quartos', filtros.quartos_min)
  }
  if (filtros?.quartos_max) {
    query = query.lte('quartos', filtros.quartos_max)
  }

  if (params?.sortBy) {
    query = query.order(params.sortBy, {
      ascending: params.sortOrder === 'asc'
    })
  } else {
    query = query.order('criado_em', { ascending: false })
  }

  if (params?.page && params?.limit) {
    const from = (params.page - 1) * params.limit
    const to = from + params.limit - 1
    query = query.range(from, to)
  }

  const { data, error, count } = await query

  if (error) throw error

  return {
    data,
    count: count || 0
  }
}

export async function getImovelById(client: SupabaseClient, id: number) {
  const { data, error } = await client
    .from('imovel')
    .select(`
      *,
      endereco:endereco_id (*),
      locador:locador_id (
        *,
        pessoa:pessoa_id (
          *,
          endereco:endereco_id (*)
        )
      ),
      tipo_imovel:tipo_imovel_id (*)
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  return data
}

export async function createImovel(
  client: SupabaseClient,
  input: ImovelInput
) {
  const { data, error } = await client
    .from('imovel')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateImovel(
  client: SupabaseClient,
  id: number,
  input: Partial<ImovelInput>
) {
  const { data, error } = await client
    .from('imovel')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteImovel(client: SupabaseClient, id: number) {
  const { error } = await client
    .from('imovel')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

// ============================================================================
// EMPRESA CLIENTE Operations
// ============================================================================
export async function getEmpresasCliente(client: SupabaseClient) {
  const { data, error } = await client
    .from('empresa_cliente')
    .select(`
      *,
      endereco:endereco_id (*),
      imovel:imovel_id (*)
    `)
    .is('deleted_at', null)
    .order('criado_em', { ascending: false })

  if (error) throw error
  return data
}

export async function getEmpresaClienteById(
  client: SupabaseClient,
  id: number
) {
  const { data, error } = await client
    .from('empresa_cliente')
    .select(`
      *,
      endereco:endereco_id (*),
      imovel:imovel_id (
        *,
        endereco:endereco_id (*)
      )
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  return data
}

export async function createEmpresaCliente(
  client: SupabaseClient,
  input: EmpresaClienteInput
) {
  const { data, error } = await client
    .from('empresa_cliente')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateEmpresaCliente(
  client: SupabaseClient,
  id: number,
  input: Partial<EmpresaClienteInput>
) {
  const { data, error } = await client
    .from('empresa_cliente')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteEmpresaCliente(
  client: SupabaseClient,
  id: number
) {
  const { error } = await client
    .from('empresa_cliente')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

// ============================================================================
// CONTRATO LOCACAO Operations
// ============================================================================
export async function getContratos(
  client: SupabaseClient,
  filtros?: ContratoFiltros,
  params?: PaginationParams
) {
  let query = client
    .from('contrato_locacao')
    .select(`
      *,
      imovel:imovel_id (
        *,
        endereco:endereco_id (*),
        tipo_imovel:tipo_imovel_id (*)
      ),
      locatario:locatario_id (
        *,
        pessoa:pessoa_id (*)
      ),
      fiador:fiador_id (
        *,
        pessoa:pessoa_id (*)
      ),
      tipo_locacao:tipo_locacao_id (*)
    `, { count: 'exact' })
    .is('deleted_at', null)

  // Apply filters
  if (filtros?.imovel_id) {
    query = query.eq('imovel_id', filtros.imovel_id)
  }
  if (filtros?.locatario_id) {
    query = query.eq('locatario_id', filtros.locatario_id)
  }
  if (filtros?.status) {
    query = query.eq('status', filtros.status)
  }
  if (filtros?.tipo_locacao_id) {
    query = query.eq('tipo_locacao_id', filtros.tipo_locacao_id)
  }
  if (filtros?.data_inicio_min) {
    query = query.gte('data_inicio_contrato', filtros.data_inicio_min)
  }
  if (filtros?.data_inicio_max) {
    query = query.lte('data_inicio_contrato', filtros.data_inicio_max)
  }

  if (params?.sortBy) {
    query = query.order(params.sortBy, {
      ascending: params.sortOrder === 'asc'
    })
  } else {
    query = query.order('criado_em', { ascending: false })
  }

  if (params?.page && params?.limit) {
    const from = (params.page - 1) * params.limit
    const to = from + params.limit - 1
    query = query.range(from, to)
  }

  const { data, error, count } = await query

  if (error) throw error

  return {
    data,
    count: count || 0
  }
}

export async function getContratoById(client: SupabaseClient, id: number) {
  const { data, error } = await client
    .from('contrato_locacao')
    .select(`
      *,
      imovel:imovel_id (
        *,
        endereco:endereco_id (*),
        tipo_imovel:tipo_imovel_id (*),
        locador:locador_id (
          *,
          pessoa:pessoa_id (*)
        )
      ),
      locatario:locatario_id (
        *,
        pessoa:pessoa_id (
          *,
          endereco:endereco_id (*)
        )
      ),
      fiador:fiador_id (
        *,
        pessoa:pessoa_id (
          *,
          endereco:endereco_id (*)
        )
      ),
      tipo_locacao:tipo_locacao_id (*)
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  return data
}

export async function createContrato(
  client: SupabaseClient,
  input: ContratoLocacaoInput
) {
  const { data, error } = await client
    .from('contrato_locacao')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateContrato(
  client: SupabaseClient,
  id: number,
  input: Partial<ContratoLocacaoInput>
) {
  const { data, error } = await client
    .from('contrato_locacao')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteContrato(client: SupabaseClient, id: number) {
  const { error } = await client
    .from('contrato_locacao')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function getContratosVencendo(
  client: SupabaseClient,
  dias: number = 60
) {
  const { data, error } = await client
    .from('view_contratos_vencendo')
    .select('*')
    .lte('dias_restantes', dias)

  if (error) throw error
  return data as ViewContratoVencendo[]
}

// ============================================================================
// REFERENCE DATA Operations
// ============================================================================
export async function getProfissoes(client: SupabaseClient) {
  const { data, error } = await client
    .from('profissao')
    .select('*')
    .is('deleted_at', null)
    .order('descricao')

  if (error) throw error
  return data as Profissao[]
}

export async function getTiposImovel(client: SupabaseClient) {
  const { data, error } = await client
    .from('tipo_imovel')
    .select('*')
    .is('deleted_at', null)
    .order('descricao')

  if (error) throw error
  return data as TipoImovel[]
}

export async function getTiposLocacao(client: SupabaseClient) {
  const { data, error } = await client
    .from('tipo_locacao')
    .select('*')
    .is('deleted_at', null)
    .order('descricao')

  if (error) throw error
  return data as TipoLocacao[]
}

// ============================================================================
// DASHBOARD & ANALYTICS
// ============================================================================
export async function getDashboardStats(
  client: SupabaseClient
): Promise<DashboardStats> {
  // Total de imóveis
  const { count: totalImoveis } = await client
    .from('imovel')
    .select('*', { count: 'exact', head: true })
    .is('deleted_at', null)

  // Imóveis disponíveis
  const { count: imoveisDisponiveis } = await client
    .from('imovel')
    .select('*', { count: 'exact', head: true })
    .eq('disponivel', true)
    .is('deleted_at', null)

  // Contratos ativos
  const { count: contratosAtivos } = await client
    .from('contrato_locacao')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'ativo')
    .is('deleted_at', null)

  // Contratos vencendo em 60 dias
  const dataFutura = new Date()
  dataFutura.setDate(dataFutura.getDate() + 60)

  const { count: contratosVencendo } = await client
    .from('contrato_locacao')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'ativo')
    .lte('data_fim_contrato', dataFutura.toISOString().split('T')[0])
    .is('deleted_at', null)

  // Receita mensal total (soma dos contratos ativos)
  const { data: receitaData } = await client
    .from('contrato_locacao')
    .select('valor')
    .eq('status', 'ativo')
    .is('deleted_at', null)

  const receitaMensalTotal = receitaData?.reduce((sum, c) => sum + Number(c.valor), 0) || 0
  const valorMedioAluguel = receitaData && receitaData.length > 0
    ? receitaMensalTotal / receitaData.length
    : 0

  const imoveisOcupados = (totalImoveis || 0) - (imoveisDisponiveis || 0)
  const taxaOcupacao = totalImoveis && totalImoveis > 0
    ? (imoveisOcupados / totalImoveis) * 100
    : 0

  return {
    total_imoveis: totalImoveis || 0,
    imoveis_disponiveis: imoveisDisponiveis || 0,
    imoveis_ocupados: imoveisOcupados,
    total_contratos_ativos: contratosAtivos || 0,
    contratos_vencendo_60_dias: contratosVencendo || 0,
    receita_mensal_total: receitaMensalTotal,
    valor_medio_aluguel: valorMedioAluguel,
    taxa_ocupacao: taxaOcupacao
  }
}
