// ============================================================================
// React Query Hooks: Sistema Imobiliário
// Description: Custom hooks for data fetching and mutations
// ============================================================================

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type {
  PessoaInput,
  LocadorInput,
  LocatarioInput,
  FiadorInput,
  EnderecoInput,
  ImovelInput,
  ImovelFiltros,
  EmpresaClienteInput,
  ContratoLocacaoInput,
  ContratoFiltros,
  PaginationParams
} from '@/types/imobiliaria'
import * as api from '@/lib/supabase/imobiliaria'

// ============================================================================
// PESSOA Hooks
// ============================================================================
export function usePessoas(params?: PaginationParams) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['pessoas', params],
    queryFn: () => api.getPessoas(supabase, params)
  })
}

export function usePessoa(id: number | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['pessoa', id],
    queryFn: () => id ? api.getPessoaById(supabase, id) : null,
    enabled: !!id
  })
}

export function useSearchPessoas(searchTerm: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['pessoas', 'search', searchTerm],
    queryFn: () => api.searchPessoas(supabase, searchTerm),
    enabled: searchTerm.length >= 3
  })
}

export function useCreatePessoa() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: (input: PessoaInput) => api.createPessoa(supabase, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pessoas'] })
    }
  })
}

export function useUpdatePessoa() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<PessoaInput> }) =>
      api.updatePessoa(supabase, id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pessoa', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['pessoas'] })
    }
  })
}

export function useDeletePessoa() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: (id: number) => api.deletePessoa(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pessoas'] })
    }
  })
}

// ============================================================================
// LOCADOR Hooks
// ============================================================================
export function useLocadores() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['locadores'],
    queryFn: () => api.getLocadores(supabase)
  })
}

export function useLocador(id: number | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['locador', id],
    queryFn: () => id ? api.getLocadorById(supabase, id) : null,
    enabled: !!id
  })
}

export function useCreateLocador() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: (input: LocadorInput) => api.createLocador(supabase, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locadores'] })
    }
  })
}

export function useUpdateLocador() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<LocadorInput> }) =>
      api.updateLocador(supabase, id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['locador', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['locadores'] })
    }
  })
}

export function useDeleteLocador() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: (id: number) => api.deleteLocador(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locadores'] })
    }
  })
}

// ============================================================================
// LOCATARIO Hooks
// ============================================================================
export function useLocatarios() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['locatarios'],
    queryFn: () => api.getLocatarios(supabase)
  })
}

export function useLocatario(id: number | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['locatario', id],
    queryFn: () => id ? api.getLocatarioById(supabase, id) : null,
    enabled: !!id
  })
}

export function useCreateLocatario() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: (input: LocatarioInput) => api.createLocatario(supabase, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locatarios'] })
    }
  })
}

export function useUpdateLocatario() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<LocatarioInput> }) =>
      api.updateLocatario(supabase, id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['locatario', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['locatarios'] })
    }
  })
}

export function useDeleteLocatario() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: (id: number) => api.deleteLocatario(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locatarios'] })
    }
  })
}

// ============================================================================
// FIADOR Hooks
// ============================================================================
export function useFiadores() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['fiadores'],
    queryFn: () => api.getFiadores(supabase)
  })
}

export function useFiador(id: number | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['fiador', id],
    queryFn: () => id ? api.getFiadorById(supabase, id) : null,
    enabled: !!id
  })
}

export function useCreateFiador() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: (input: FiadorInput) => api.createFiador(supabase, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiadores'] })
    }
  })
}

export function useUpdateFiador() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<FiadorInput> }) =>
      api.updateFiador(supabase, id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fiador', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['fiadores'] })
    }
  })
}

export function useDeleteFiador() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: (id: number) => api.deleteFiador(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiadores'] })
    }
  })
}

// ============================================================================
// ENDERECO Hooks
// ============================================================================
export function useEnderecos() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['enderecos'],
    queryFn: () => api.getEnderecos(supabase)
  })
}

export function useEndereco(id: number | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['endereco', id],
    queryFn: () => id ? api.getEnderecoById(supabase, id) : null,
    enabled: !!id
  })
}

export function useSearchEnderecoByCEP(cep: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['endereco', 'cep', cep],
    queryFn: () => api.searchEnderecoByCEP(supabase, cep),
    enabled: cep.replace(/\D/g, '').length === 8
  })
}

export function useCreateEndereco() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: (input: EnderecoInput) => api.createEndereco(supabase, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enderecos'] })
    }
  })
}

export function useUpdateEndereco() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<EnderecoInput> }) =>
      api.updateEndereco(supabase, id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['endereco', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['enderecos'] })
    }
  })
}

export function useDeleteEndereco() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: (id: number) => api.deleteEndereco(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enderecos'] })
    }
  })
}

// ============================================================================
// IMOVEL Hooks
// ============================================================================
export function useImoveis(filtros?: ImovelFiltros, params?: PaginationParams) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['imoveis', filtros, params],
    queryFn: () => api.getImoveis(supabase, filtros, params)
  })
}

export function useImovel(id: number | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['imovel', id],
    queryFn: () => id ? api.getImovelById(supabase, id) : null,
    enabled: !!id
  })
}

export function useCreateImovel() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: (input: ImovelInput) => api.createImovel(supabase, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imoveis'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}

export function useUpdateImovel() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<ImovelInput> }) =>
      api.updateImovel(supabase, id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['imovel', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['imoveis'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}

export function useDeleteImovel() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: (id: number) => api.deleteImovel(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imoveis'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}

// ============================================================================
// EMPRESA CLIENTE Hooks
// ============================================================================
export function useEmpresasCliente() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['empresas-cliente'],
    queryFn: () => api.getEmpresasCliente(supabase)
  })
}

export function useEmpresaCliente(id: number | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['empresa-cliente', id],
    queryFn: () => id ? api.getEmpresaClienteById(supabase, id) : null,
    enabled: !!id
  })
}

export function useCreateEmpresaCliente() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: (input: EmpresaClienteInput) => api.createEmpresaCliente(supabase, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas-cliente'] })
    }
  })
}

export function useUpdateEmpresaCliente() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<EmpresaClienteInput> }) =>
      api.updateEmpresaCliente(supabase, id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['empresa-cliente', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['empresas-cliente'] })
    }
  })
}

export function useDeleteEmpresaCliente() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: (id: number) => api.deleteEmpresaCliente(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas-cliente'] })
    }
  })
}

// ============================================================================
// CONTRATO LOCACAO Hooks
// ============================================================================
export function useContratos(filtros?: ContratoFiltros, params?: PaginationParams) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['contratos', filtros, params],
    queryFn: () => api.getContratos(supabase, filtros, params)
  })
}

export function useContrato(id: number | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['contrato', id],
    queryFn: () => id ? api.getContratoById(supabase, id) : null,
    enabled: !!id
  })
}

export function useContratosVencendo(dias: number = 60) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['contratos', 'vencendo', dias],
    queryFn: () => api.getContratosVencendo(supabase, dias)
  })
}

export function useCreateContrato() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: (input: ContratoLocacaoInput) => api.createContrato(supabase, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] })
      queryClient.invalidateQueries({ queryKey: ['imoveis'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}

export function useUpdateContrato() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<ContratoLocacaoInput> }) =>
      api.updateContrato(supabase, id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contrato', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['contratos'] })
      queryClient.invalidateQueries({ queryKey: ['imoveis'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}

export function useDeleteContrato() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: (id: number) => api.deleteContrato(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] })
      queryClient.invalidateQueries({ queryKey: ['imoveis'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}

// ============================================================================
// REFERENCE DATA Hooks
// ============================================================================
export function useProfissoes() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['profissoes'],
    queryFn: () => api.getProfissoes(supabase),
    staleTime: 1000 * 60 * 60 // 1 hour
  })
}

export function useTiposImovel() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tipos-imovel'],
    queryFn: () => api.getTiposImovel(supabase),
    staleTime: 1000 * 60 * 60 // 1 hour
  })
}

export function useTiposLocacao() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tipos-locacao'],
    queryFn: () => api.getTiposLocacao(supabase),
    staleTime: 1000 * 60 * 60 // 1 hour
  })
}

// ============================================================================
// DASHBOARD Hooks
// ============================================================================
export function useDashboardStats() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => api.getDashboardStats(supabase),
    refetchInterval: 1000 * 60 * 5 // Refetch every 5 minutes
  })
}
