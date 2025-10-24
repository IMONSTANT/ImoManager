/**
 * =====================================================
 * HOOK: use-documentos
 * =====================================================
 * Hook para gerenciamento completo de documentos
 * - Listagem de documentos
 * - Geração de documentos
 * - Envio para assinatura
 * - Controle de status
 * =====================================================
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type {
  DocumentoInstancia,
  DocumentoModelo,
  Assinatura,
  GerarDocumentoInput,
  CriarAssinaturaInput,
  DocumentoStatus,
  DocumentoTipo,
} from '@/lib/types/documento'
// NOTE: DocumentoService moved to API route to avoid importing Node.js modules in client
// import { DocumentoService } from '@/lib/services/DocumentoService'

// =====================================================
// TYPES
// =====================================================

export interface DocumentosFilters {
  status?: DocumentoStatus[]
  tipo?: DocumentoTipo
  contrato_id?: number
  locatario_id?: number
  data_inicio?: string
  data_fim?: string
}

export interface DocumentoWithRelations extends DocumentoInstancia {
  modelo?: DocumentoModelo
  assinaturas?: Assinatura[]
  contrato?: {
    numero_contrato: string
    valor: number
  }
}

// =====================================================
// HOOK: useDocumentos
// =====================================================

export function useDocumentos(filters: DocumentosFilters = {}) {
  return useQuery({
    queryKey: ['documentos', filters],
    queryFn: async () => {
      const supabase = createClient()
      let query = supabase
        .from('documento_instancia')
        .select(`
          *,
          modelo:modelo_id(id, tipo, nome),
          assinaturas:assinatura(
            id,
            nome_signatario,
            email_signatario,
            status,
            assinado_em
          ),
          contrato:contrato_id(numero_contrato, valor)
        `)
        .order('criado_em', { ascending: false })

      if (filters.status?.length) {
        query = query.in('status', filters.status)
      }
      if (filters.tipo) {
        query = query.eq('tipo', filters.tipo)
      }
      if (filters.contrato_id) {
        query = query.eq('contrato_id', filters.contrato_id)
      }
      if (filters.locatario_id) {
        query = query.eq('locatario_id', filters.locatario_id)
      }
      if (filters.data_inicio) {
        query = query.gte('criado_em', filters.data_inicio)
      }
      if (filters.data_fim) {
        query = query.lte('criado_em', filters.data_fim)
      }

      const { data, error } = await query

      if (error) throw error
      return (data || []) as unknown as DocumentoWithRelations[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// =====================================================
// HOOK: useDocumentoById
// =====================================================

export function useDocumentoById(id: number | null) {
  return useQuery({
    queryKey: ['documento', id],
    queryFn: async () => {
      const supabase = createClient()
      if (!id) return null

      const { data, error } = await supabase
        .from('documento_instancia')
        .select(`
          *,
          modelo:modelo_id(id, tipo, nome, template),
          assinaturas:assinatura(*),
          contrato:contrato_id(
            numero_contrato,
            valor,
            locatario:locatario_id(
              pessoa:pessoa_id(nome, cpf_cnpj, email)
            ),
            imovel:imovel_id(
              endereco:endereco_id(*)
            )
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data as unknown as DocumentoWithRelations
    },
    enabled: !!id,
  })
}

// =====================================================
// HOOK: useGerarDocumento
// =====================================================

export function useGerarDocumento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: GerarDocumentoInput) => {
      const supabase = createClient()
      // 1. Buscar o modelo do documento
      const { data: modelo, error: modeloError } = await supabase
        .from('documento_modelo')
        .select('*')
        .eq('id', input.modelo_id)
        .eq('ativo', true)
        .single()

      if (modeloError || !modelo) {
        throw new Error('Modelo de documento não encontrado')
      }

      // 2. Gerar o documento usando o service
      // TODO: Move to API route - DocumentoService uses Node.js modules
      // const documentoData = await DocumentoService.gerarDocumento(input, modelo)
      const documentoData = {
        modelo_id: input.modelo_id,
        tipo: input.tipo,
        contrato_id: input.contrato_id,
        locatario_id: input.locatario_id,
        html_content: modelo.template, // Temporary placeholder
        storage_path: '',
      }

      // 3. Obter próximo número sequencial
      // TODO: Move to API route
      // const proximoNumero = await DocumentoService.obterProximoNumero(input.tipo)
      const proximoNumero = `${input.tipo.toUpperCase()}-${Date.now()}`

      // 4. Inserir no banco
      const { data: documentoCriado, error: insertError } = await supabase
        .from('documento_instancia')
        .insert({
          ...documentoData,
          numero_documento: proximoNumero,
          gerado_por: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single()

      if (insertError) throw insertError

      return documentoCriado as unknown as DocumentoInstancia
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] })
      toast.success('Documento gerado com sucesso!')
    },
    onError: (error) => {
      toast.error(`Erro ao gerar documento: ${error.message}`)
    },
  })
}

// =====================================================
// HOOK: useEnviarParaAssinatura
// =====================================================

export function useEnviarParaAssinatura() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      documentoId,
      assinaturas,
    }: {
      documentoId: number
      assinaturas: CriarAssinaturaInput[]
    }) => {
      const supabase = createClient()
      // 1. Atualizar status do documento para 'enviado'
      const { error: updateError } = await supabase
        .from('documento_instancia')
        .update({
          status: 'enviado',
          enviado_em: new Date().toISOString(),
        })
        .eq('id', documentoId)

      if (updateError) throw updateError

      // 2. Criar registros de assinatura
      // TODO: Move to API route
      // const assinaturasParaInserir = assinaturas.map(DocumentoService.criarAssinatura)
      const assinaturasParaInserir = assinaturas.map((a) => ({
        documento_id: documentoId,
        pessoa_id: a.pessoa_id,
        nome_signatario: a.nome_signatario,
        email_signatario: a.email_signatario,
        cpf_signatario: a.cpf_signatario,
        tipo_signatario: a.tipo_signatario,
        ordem_assinatura: a.ordem_assinatura,
      }))

      const { data: assinaturasCriadas, error: insertError } = await supabase
        .from('assinatura')
        .insert(assinaturasParaInserir)
        .select()

      if (insertError) throw insertError

      // 3. Enviar notificações (aqui você integraria com Clicksign/DocuSign)
      // TODO: Implementar integração com provider de assinatura

      return assinaturasCriadas
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] })
      toast.success('Documento enviado para assinatura!')
    },
    onError: (error) => {
      toast.error(`Erro ao enviar documento: ${error.message}`)
    },
  })
}

// =====================================================
// HOOK: useCancelarDocumento
// =====================================================

export function useCancelarDocumento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      documentoId,
      motivo,
    }: {
      documentoId: number
      motivo: string
    }) => {
      const supabase = createClient()
      const userId = (await supabase.auth.getUser()).data.user?.id

      const { error } = await supabase
        .from('documento_instancia')
        .update({
          status: 'cancelado',
          cancelado_em: new Date().toISOString(),
          cancelado_por: userId,
          motivo_cancelamento: motivo,
        })
        .eq('id', documentoId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] })
      toast.success('Documento cancelado')
    },
    onError: (error) => {
      toast.error(`Erro ao cancelar documento: ${error.message}`)
    },
  })
}

// =====================================================
// HOOK: useModelos
// =====================================================

export function useModelos(tipo?: DocumentoTipo) {
  return useQuery({
    queryKey: ['modelos', tipo],
    queryFn: async () => {
      const supabase = createClient()
      let query = supabase
        .from('documento_modelo')
        .select('*')
        .eq('ativo', true)
        .order('tipo', { ascending: true })

      if (tipo) {
        query = query.eq('tipo', tipo)
      }

      const { data, error } = await query

      if (error) throw error
      return (data || []) as unknown as DocumentoModelo[]
    },
    staleTime: 1000 * 60 * 30, // 30 minutos (modelos mudam pouco)
  })
}
