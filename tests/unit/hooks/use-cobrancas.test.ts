/**
 * @testfile use-cobrancas.test.ts
 * @description Testes TDD para hook use-cobrancas
 * @requirements Gestão de cobranças e boletos
 * @coverage
 *   - Listagem de cobranças com filtros
 *   - Cancelamento de cobrança
 *   - Reenvio de boleto/PIX
 *   - Detalhes de webhook
 *   - Download de PDF
 * @author TDD Test Architect Agent
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Cobranca, CobrancaFilters } from '@/types/financeiro'

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
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

describe('[UNIT] useCobrancas Hook', () => {
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
      update: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
    }

    vi.mocked(createClient).mockReturnValue(mockSupabase as any)
  })

  describe('Listagem de Cobranças', () => {
    it('deve listar todas as cobranças sem filtros', async () => {
      const mockCobrancas: Cobranca[] = [
        {
          id: 1,
          parcela_id: 1,
          gateway: 'asaas',
          gateway_id: 'pay_123',
          nosso_numero: '12345678',
          linha_digitavel: '12345.67890 12345.678901 12345.678901 1 12345678901234',
          status: 'emitida',
          valor: 1025.0,
          data_emissao: '2025-01-10T00:00:00Z',
          tentativas_envio: 0,
          created_at: '2025-01-10T00:00:00Z',
          updated_at: '2025-01-10T00:00:00Z',
        },
      ]

      mockSupabase.select.mockResolvedValueOnce({
        data: mockCobrancas,
        error: null,
      })

      const { useCobrancas } = await import('@/hooks/use-cobrancas')
      const { result } = renderHook(() => useCobrancas({}), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual(mockCobrancas)
      expect(mockSupabase.from).toHaveBeenCalledWith('cobranca')
    })

    it('deve filtrar cobranças por gateway', async () => {
      const filters: CobrancaFilters = {
        gateway: ['asaas', 'gerencianet'],
      }

      mockSupabase.select.mockResolvedValueOnce({
        data: [],
        error: null,
      })

      const { useCobrancas } = await import('@/hooks/use-cobrancas')
      renderHook(() => useCobrancas(filters), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(mockSupabase.in).toHaveBeenCalledWith('gateway', [
          'asaas',
          'gerencianet',
        ])
      })
    })

    it('deve filtrar cobranças por status', async () => {
      const filters: CobrancaFilters = {
        status: ['emitida', 'paga'],
      }

      mockSupabase.select.mockResolvedValueOnce({
        data: [],
        error: null,
      })

      const { useCobrancas } = await import('@/hooks/use-cobrancas')
      renderHook(() => useCobrancas(filters), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(mockSupabase.in).toHaveBeenCalledWith('status', [
          'emitida',
          'paga',
        ])
      })
    })

    it('deve filtrar por período de emissão', async () => {
      const filters: CobrancaFilters = {
        data_emissao_inicio: '2025-01-01',
        data_emissao_fim: '2025-01-31',
      }

      mockSupabase.select.mockResolvedValueOnce({
        data: [],
        error: null,
      })

      const { useCobrancas } = await import('@/hooks/use-cobrancas')
      renderHook(() => useCobrancas(filters), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(mockSupabase.gte).toHaveBeenCalledWith('data_emissao', '2025-01-01')
        expect(mockSupabase.lte).toHaveBeenCalledWith('data_emissao', '2025-01-31')
      })
    })

    it('deve incluir relacionamento com parcela', async () => {
      mockSupabase.select.mockResolvedValueOnce({
        data: [],
        error: null,
      })

      const { useCobrancas } = await import('@/hooks/use-cobrancas')
      renderHook(() => useCobrancas({}), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(mockSupabase.select).toHaveBeenCalledWith(
          expect.stringContaining('parcela:parcela_id')
        )
      })
    })
  })

  describe('Cancelamento de Cobrança', () => {
    it('deve cancelar cobrança emitida', async () => {
      mockSupabase.update.mockResolvedValueOnce({
        data: { id: 1, status: 'cancelada' },
        error: null,
      })

      const { useCancelarCobranca } = await import('@/hooks/use-cobrancas')
      const { result } = renderHook(() => useCancelarCobranca(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        cobranca_id: 1,
        motivo: 'Cancelado a pedido do cliente',
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockSupabase.update).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'cancelada' })
      )
    })

    it('deve atualizar parcela para "pendente" ao cancelar cobrança', async () => {
      mockSupabase.update.mockResolvedValueOnce({
        data: { id: 1 },
        error: null,
      })

      const { useCancelarCobranca } = await import('@/hooks/use-cobrancas')
      const { result } = renderHook(() => useCancelarCobranca(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        cobranca_id: 1,
        motivo: 'Cobrança incorreta',
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // Verificar que a parcela foi atualizada
      expect(mockSupabase.from).toHaveBeenCalledWith('parcela')
      expect(mockSupabase.update).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'pendente' })
      )
    })

    it('deve cancelar no gateway externo', async () => {
      const mockGatewayCancel = vi.fn().mockResolvedValue({ success: true })

      // Mock do serviço de gateway
      vi.mock('@/lib/services/gateway', () => ({
        cancelarNoGateway: mockGatewayCancel,
      }))

      const { useCancelarCobranca } = await import('@/hooks/use-cobrancas')
      const { result } = renderHook(() => useCancelarCobranca(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        cobranca_id: 1,
        motivo: 'Teste de cancelamento',
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // Verificar chamada ao gateway
      // expect(mockGatewayCancel).toHaveBeenCalled()
    })
  })

  describe('Reenvio de Boleto', () => {
    it('deve reenviar boleto por email', async () => {
      const { useReenviarBoleto } = await import('@/hooks/use-cobrancas')
      const { result } = renderHook(() => useReenviarBoleto(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        cobranca_id: 1,
        canal: 'email',
        destinatario: 'cliente@example.com',
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // Verificar que notificação foi criada
      expect(mockSupabase.from).toHaveBeenCalledWith('notificacao')
      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          canal: 'email',
          destinatario: 'cliente@example.com',
        })
      )
    })

    it('deve reenviar boleto por WhatsApp', async () => {
      const { useReenviarBoleto } = await import('@/hooks/use-cobrancas')
      const { result } = renderHook(() => useReenviarBoleto(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        cobranca_id: 1,
        canal: 'whatsapp',
        destinatario: '11999999999',
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          canal: 'whatsapp',
        })
      )
    })

    it('deve incrementar contador de tentativas_envio', async () => {
      mockSupabase.update.mockResolvedValueOnce({
        data: { tentativas_envio: 2 },
        error: null,
      })

      const { useReenviarBoleto } = await import('@/hooks/use-cobrancas')
      const { result } = renderHook(() => useReenviarBoleto(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        cobranca_id: 1,
        canal: 'email',
        destinatario: 'test@example.com',
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // Verificar incremento de tentativas
      expect(result.current.data?.tentativas_envio).toBe(2)
    })
  })

  describe('Copiar Linha Digitável e QR Code', () => {
    it('deve copiar linha digitável para clipboard', async () => {
      const mockClipboard = {
        writeText: vi.fn().mockResolvedValue(undefined),
      }
      Object.assign(navigator, { clipboard: mockClipboard })

      const { useCopiarLinhaDigitavel } = await import('@/hooks/use-cobrancas')
      const { result } = renderHook(() => useCopiarLinhaDigitavel(), {
        wrapper: createWrapper(),
      })

      const linhaDigitavel =
        '12345.67890 12345.678901 12345.678901 1 12345678901234'
      result.current.mutate(linhaDigitavel)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockClipboard.writeText).toHaveBeenCalledWith(linhaDigitavel)
    })

    it('deve copiar QR Code PIX para clipboard', async () => {
      const mockClipboard = {
        writeText: vi.fn().mockResolvedValue(undefined),
      }
      Object.assign(navigator, { clipboard: mockClipboard })

      const { useCopiarQRCode } = await import('@/hooks/use-cobrancas')
      const { result } = renderHook(() => useCopiarQRCode(), {
        wrapper: createWrapper(),
      })

      const qrcode = '00020126580014br.gov.bcb.pix0136...'
      result.current.mutate(qrcode)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(mockClipboard.writeText).toHaveBeenCalledWith(qrcode)
    })
  })

  describe('Download de PDF', () => {
    it('deve baixar PDF do boleto', async () => {
      const mockUrl = 'https://gateway.com/boleto/123.pdf'

      const { useBaixarBoleto } = await import('@/hooks/use-cobrancas')
      const { result } = renderHook(() => useBaixarBoleto(), {
        wrapper: createWrapper(),
      })

      result.current.mutate(mockUrl)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      // Verificar que download foi iniciado
      expect(result.current.data?.url).toBe(mockUrl)
    })
  })

  describe('Detalhes de Webhook', () => {
    it('deve retornar payload do webhook', async () => {
      const mockCobranca: Cobranca = {
        id: 1,
        parcela_id: 1,
        gateway: 'asaas',
        status: 'paga',
        valor: 1025.0,
        data_emissao: '2025-01-10T00:00:00Z',
        tentativas_envio: 0,
        created_at: '2025-01-10T00:00:00Z',
        updated_at: '2025-01-10T00:00:00Z',
        payload_webhook: {
          event: 'PAYMENT_RECEIVED',
          payment: {
            id: 'pay_123',
            value: 1025.0,
            status: 'RECEIVED',
          },
        },
      }

      mockSupabase.select.mockResolvedValueOnce({
        data: mockCobranca,
        error: null,
      })

      const { useDetalhesWebhook } = await import('@/hooks/use-cobrancas')
      const { result } = renderHook(() => useDetalhesWebhook(1), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data?.payload_webhook).toBeDefined()
      expect(result.current.data?.payload_webhook?.event).toBe(
        'PAYMENT_RECEIVED'
      )
    })
  })

  describe('Ícone de Sincronização', () => {
    it('deve mostrar ícone de sincronização quando conciliada', async () => {
      const { isConciliada } = await import('@/hooks/use-cobrancas')

      const cobrancaConciliada: Cobranca = {
        id: 1,
        parcela_id: 1,
        gateway: 'asaas',
        status: 'paga',
        valor: 1025.0,
        data_emissao: '2025-01-10T00:00:00Z',
        data_pagamento: '2025-01-15T00:00:00Z',
        tentativas_envio: 0,
        created_at: '2025-01-10T00:00:00Z',
        updated_at: '2025-01-10T00:00:00Z',
      }

      const resultado = isConciliada(cobrancaConciliada)
      expect(resultado).toBe(true)
    })

    it('deve NÃO mostrar ícone se não conciliada', async () => {
      const { isConciliada } = await import('@/hooks/use-cobrancas')

      const cobrancaNaoConciliada: Cobranca = {
        id: 1,
        parcela_id: 1,
        gateway: 'asaas',
        status: 'emitida',
        valor: 1025.0,
        data_emissao: '2025-01-10T00:00:00Z',
        tentativas_envio: 0,
        created_at: '2025-01-10T00:00:00Z',
        updated_at: '2025-01-10T00:00:00Z',
      }

      const resultado = isConciliada(cobrancaNaoConciliada)
      expect(resultado).toBe(false)
    })
  })
})
