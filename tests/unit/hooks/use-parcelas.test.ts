/**
 * @testfile use-parcelas.test.ts
 * @description Testes TDD para hook use-parcelas
 * @requirements RN-3.3, RN-3.4 (Cálculos financeiros e baixa manual)
 * @coverage
 *   - Listagem de parcelas com filtros
 *   - Emissão de boleto
 *   - Baixa manual de parcela
 *   - Geração de 2ª via
 *   - Cálculo de totalizadores
 *   - Exportação de dados
 * @author TDD Test Architect Agent
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Parcela, ParcelaFilters } from '@/types/financeiro'

// Mock do Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}))

// Mock do FinanceiroService
vi.mock('@/lib/services/FinanceiroService', () => ({
  FinanceiroService: {
    aplicarPagamentoParcial: vi.fn(),
    calcularValorComMultaJuros: vi.fn(),
    calcularDiasAtraso: vi.fn(),
  },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }

  return Wrapper
}

describe('[UNIT] useParcelas Hook', () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
    }

    vi.mocked(createClient).mockReturnValue(mockSupabase as any)
  })

  describe('Listagem de Parcelas', () => {
    it('deve listar todas as parcelas sem filtros', async () => {
      const mockParcelas: Parcela[] = [
        {
          id: 1,
          contrato_id: 100,
          numero_parcela: 1,
          competencia: '2025-01',
          vencimento: '2025-01-10',
          valor_base: 1000,
          valor_multa: 0,
          valor_juros: 0,
          valor_total: 1000,
          status: 'pendente',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ]

      mockSupabase.select.mockResolvedValueOnce({
        data: mockParcelas,
        error: null,
      })

      const { useParcelas } = await import('@/hooks/use-parcelas')
      const { result } = renderHook(() => useParcelas({}), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual(mockParcelas)
      expect(mockSupabase.from).toHaveBeenCalledWith('parcela')
    })

    it('deve filtrar parcelas por status', async () => {
      const filters: ParcelaFilters = {
        status: ['vencido', 'pendente'],
      }

      mockSupabase.select.mockResolvedValueOnce({
        data: [],
        error: null,
      })

      const { useParcelas } = await import('@/hooks/use-parcelas')
      renderHook(() => useParcelas(filters), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(mockSupabase.in).toHaveBeenCalledWith('status', [
          'vencido',
          'pendente',
        ])
      })
    })

    it('deve filtrar parcelas por contrato_id', async () => {
      const filters: ParcelaFilters = {
        contrato_id: 100,
      }

      mockSupabase.select.mockResolvedValueOnce({
        data: [],
        error: null,
      })

      const { useParcelas } = await import('@/hooks/use-parcelas')
      renderHook(() => useParcelas(filters), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(mockSupabase.eq).toHaveBeenCalledWith('contrato_id', 100)
      })
    })

    it('deve filtrar parcelas por período (data_inicio e data_fim)', async () => {
      const filters: ParcelaFilters = {
        data_inicio: '2025-01-01',
        data_fim: '2025-01-31',
      }

      mockSupabase.select.mockResolvedValueOnce({
        data: [],
        error: null,
      })

      const { useParcelas } = await import('@/hooks/use-parcelas')
      renderHook(() => useParcelas(filters), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(mockSupabase.gte).toHaveBeenCalledWith('vencimento', '2025-01-01')
        expect(mockSupabase.lte).toHaveBeenCalledWith('vencimento', '2025-01-31')
      })
    })

    it('deve ordenar parcelas por vencimento descendente', async () => {
      mockSupabase.select.mockResolvedValueOnce({
        data: [],
        error: null,
      })

      const { useParcelas } = await import('@/hooks/use-parcelas')
      renderHook(() => useParcelas({}), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(mockSupabase.order).toHaveBeenCalledWith('vencimento', {
          ascending: false,
        })
      })
    })

    it('deve incluir relacionamentos (contrato, locatário, imóvel)', async () => {
      mockSupabase.select.mockResolvedValueOnce({
        data: [],
        error: null,
      })

      const { useParcelas } = await import('@/hooks/use-parcelas')
      renderHook(() => useParcelas({}), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(mockSupabase.select).toHaveBeenCalledWith(
          expect.stringContaining('contrato:contrato_locacao')
        )
        expect(mockSupabase.select).toHaveBeenCalledWith(
          expect.stringContaining('locatario:locatario_id')
        )
      })
    })

    it('deve tratar erro ao buscar parcelas', async () => {
      mockSupabase.select.mockResolvedValueOnce({
        data: null,
        error: { message: 'Erro ao buscar parcelas' },
      })

      const { useParcelas } = await import('@/hooks/use-parcelas')
      const { result } = renderHook(() => useParcelas({}), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))

      expect(result.current.error).toBeDefined()
    })
  })

  describe('Emissão de Boleto', () => {
    it('deve emitir boleto para parcela pendente', async () => {
      mockSupabase.select.mockResolvedValueOnce({
        data: { id: 1 },
        error: null,
      })

      const { useEmitirBoleto } = await import('@/hooks/use-parcelas')
      const { result } = renderHook(() => useEmitirBoleto(), {
        wrapper: createWrapper(),
      })

      const parcelaId = 1
      result.current.mutate({
        parcela_id: parcelaId,
        gateway: 'asaas',
        enviar_notificacao: true,
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
    })

    it('deve atualizar status da parcela para "emitido" após emissão', async () => {
      mockSupabase.update = vi.fn().mockReturnThis()
      mockSupabase.update.mockResolvedValueOnce({
        data: { id: 1, status: 'emitido' },
        error: null,
      })

      const { useEmitirBoleto } = await import('@/hooks/use-parcelas')
      const { result } = renderHook(() => useEmitirBoleto(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        parcela_id: 1,
        gateway: 'asaas',
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockSupabase.update).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'emitido' })
      )
    })

    it('deve criar registro de cobrança ao emitir boleto', async () => {
      mockSupabase.insert = vi.fn().mockReturnThis()
      mockSupabase.insert.mockResolvedValueOnce({
        data: {
          id: 1,
          parcela_id: 1,
          gateway: 'asaas',
          status: 'emitida',
        },
        error: null,
      })

      const { useEmitirBoleto } = await import('@/hooks/use-parcelas')
      const { result } = renderHook(() => useEmitirBoleto(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        parcela_id: 1,
        gateway: 'asaas',
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockSupabase.from).toHaveBeenCalledWith('cobranca')
      expect(mockSupabase.insert).toHaveBeenCalled()
    })

    it('deve enviar notificação quando enviar_notificacao = true', async () => {
      const { useEmitirBoleto } = await import('@/hooks/use-parcelas')
      const { result } = renderHook(() => useEmitirBoleto(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        parcela_id: 1,
        gateway: 'asaas',
        enviar_notificacao: true,
        canais_notificacao: ['email', 'whatsapp'],
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // Verificar que notificações foram criadas
      expect(result.current.data?.notificacoes).toBeDefined()
      expect(result.current.data?.notificacoes).toHaveLength(2)
    })
  })

  describe('Baixa Manual de Parcela', () => {
    it('deve realizar baixa manual com valor total', async () => {
      const baixaInput = {
        parcela_id: 1,
        data_pagamento: new Date('2025-01-15'),
        valor_pago: 1025.0,
        forma_pagamento: 'pix' as const,
        observacoes: 'Pagamento recebido',
      }

      mockSupabase.update = vi.fn().mockReturnThis()
      mockSupabase.update.mockResolvedValueOnce({
        data: { id: 1, status: 'pago' },
        error: null,
      })

      const { useBaixaManual } = await import('@/hooks/use-parcelas')
      const { result } = renderHook(() => useBaixaManual(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(baixaInput)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data?.parcela.status).toBe('pago')
    })

    it('deve aplicar pagamento parcial usando FinanceiroService', async () => {
      const { FinanceiroService } = await import(
        '@/lib/services/FinanceiroService'
      )

      const baixaInput = {
        parcela_id: 1,
        data_pagamento: new Date('2025-01-15'),
        valor_pago: 15.0, // Pagamento parcial
        forma_pagamento: 'dinheiro' as const,
      }

      vi.mocked(FinanceiroService.aplicarPagamentoParcial).mockReturnValue({
        principal: 1000,
        multa: 10,
        juros: 0,
        valorPago: 15,
        saldoDevedor: 1010,
        quitado: false,
      })

      const { useBaixaManual } = await import('@/hooks/use-parcelas')
      const { result } = renderHook(() => useBaixaManual(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(baixaInput)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(FinanceiroService.aplicarPagamentoParcial).toHaveBeenCalled()
      expect(result.current.data?.breakdown.saldo_devedor).toBe(1010)
      expect(result.current.data?.breakdown.quitado).toBe(false)
    })

    it('deve calcular breakdown (juros, multa, principal)', async () => {
      const baixaInput = {
        parcela_id: 1,
        data_pagamento: new Date('2025-01-15'),
        valor_pago: 1025.0,
        forma_pagamento: 'transferencia' as const,
      }

      const { useBaixaManual } = await import('@/hooks/use-parcelas')
      const { result } = renderHook(() => useBaixaManual(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(baixaInput)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      const breakdown = result.current.data?.breakdown
      expect(breakdown).toBeDefined()
      expect(breakdown?.abate_juros).toBeGreaterThanOrEqual(0)
      expect(breakdown?.abate_multa).toBeGreaterThanOrEqual(0)
      expect(breakdown?.abate_principal).toBeGreaterThanOrEqual(0)
    })

    it('deve fazer upload de comprovante se fornecido', async () => {
      const mockFile = new File(['conteúdo'], 'comprovante.pdf', {
        type: 'application/pdf',
      })

      const baixaInput = {
        parcela_id: 1,
        data_pagamento: new Date('2025-01-15'),
        valor_pago: 1500.0,
        forma_pagamento: 'pix' as const,
        comprovante: mockFile,
      }

      mockSupabase.storage = {
        from: vi.fn().mockReturnThis(),
        upload: vi.fn().mockResolvedValue({
          data: { path: 'comprovantes/123.pdf' },
          error: null,
        }),
      }

      const { useBaixaManual } = await import('@/hooks/use-parcelas')
      const { result } = renderHook(() => useBaixaManual(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(baixaInput)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockSupabase.storage.from).toHaveBeenCalledWith('comprovantes')
      expect(result.current.data?.comprovante_url).toBeDefined()
    })

    it('deve invalidar cache após baixa manual', async () => {
      const baixaInput = {
        parcela_id: 1,
        data_pagamento: new Date('2025-01-15'),
        valor_pago: 1000.0,
        forma_pagamento: 'cartao' as const,
      }

      const queryClient = new QueryClient()
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

      const { useBaixaManual } = await import('@/hooks/use-parcelas')
      const { result } = renderHook(() => useBaixaManual(), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      })

      result.current.mutate(baixaInput)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: expect.arrayContaining(['parcelas']),
      })
    })
  })

  describe('Geração de 2ª Via', () => {
    it('deve gerar 2ª via para parcela com boleto emitido', async () => {
      const { useGerar2Via } = await import('@/hooks/use-parcelas')
      const { result } = renderHook(() => useGerar2Via(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(1) // parcela_id

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.url_boleto).toBeDefined()
    })
  })

  describe('Cálculo de Totalizadores', () => {
    it('deve calcular totalizadores corretamente', async () => {
      const mockParcelas: Parcela[] = [
        {
          id: 1,
          contrato_id: 100,
          numero_parcela: 1,
          competencia: '2025-01',
          vencimento: '2025-01-10',
          valor_base: 1000,
          valor_multa: 20,
          valor_juros: 5,
          valor_total: 1025,
          status: 'vencido',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
        {
          id: 2,
          contrato_id: 100,
          numero_parcela: 2,
          competencia: '2025-02',
          vencimento: '2025-02-10',
          valor_base: 1000,
          valor_multa: 0,
          valor_juros: 0,
          valor_total: 1000,
          status: 'pendente',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ]

      const { calcularTotalizadores } = await import('@/hooks/use-parcelas')
      const totalizadores = calcularTotalizadores(mockParcelas)

      expect(totalizadores.total_principal).toBe(2000)
      expect(totalizadores.total_multa).toBe(20)
      expect(totalizadores.total_juros).toBe(5)
      expect(totalizadores.total_geral).toBe(2025)
      expect(totalizadores.quantidade).toBe(2)
      expect(totalizadores.por_status.vencido).toBe(1)
      expect(totalizadores.por_status.pendente).toBe(1)
    })
  })

  describe('Exportação de Dados', () => {
    it('deve exportar parcelas para CSV', async () => {
      const { useExportarParcelas } = await import('@/hooks/use-parcelas')
      const { result } = renderHook(() => useExportarParcelas(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        formato: 'csv',
        filtros: { status: ['vencido'] },
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.url).toContain('.csv')
    })

    it('deve exportar parcelas para Excel', async () => {
      const { useExportarParcelas } = await import('@/hooks/use-parcelas')
      const { result } = renderHook(() => useExportarParcelas(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        formato: 'excel',
        incluir_totalizadores: true,
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data?.url).toContain('.xlsx')
    })
  })
})
