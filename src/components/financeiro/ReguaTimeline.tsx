/**
 * REGUA TIMELINE COMPONENT
 *
 * Timeline vertical mostrando eventos da régua de cobrança
 * Eventos: D-3 (Lembrete), D+1 (Aviso), D+7 (Reaviso 1), D+15 (Negociação), D+30 (Jurídico)
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Notificacao, TipoEventoRegua, EventoRegua } from '@/types/financeiro'
import { StatusBadge, getNotificacaoStatusBadge } from '@/components/ui/status-badge'
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  MessageCircle,
  Gavel,
  Mail,
  MessageSquare,
  Smartphone,
  RefreshCw,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ReguaTimelineProps {
  parcelaId: number
}

// Mapeamento de ícones
const EVENTO_ICONS: Record<TipoEventoRegua, React.ComponentType<{ className?: string }>> = {
  lembrete: Bell,
  aviso: AlertTriangle,
  reaviso_1: AlertCircle,
  reaviso_2: MessageCircle,
  juridico: Gavel,
}

// Mapeamento de descrições
const EVENTO_DESCRICOES: Record<TipoEventoRegua, string> = {
  lembrete: 'Lembrete enviado 3 dias antes do vencimento',
  aviso: 'Aviso de atraso enviado 1 dia após vencimento',
  reaviso_1: 'Primeiro reaviso enviado 7 dias após vencimento',
  reaviso_2: 'Negociação iniciada 15 dias após vencimento',
  juridico: 'Encaminhado para jurídico 30 dias após vencimento',
}

// Ícones de canal
const getCanalIcon = (canal: string) => {
  switch (canal) {
    case 'email':
      return Mail
    case 'whatsapp':
      return MessageSquare
    case 'sms':
      return Smartphone
    default:
      return Bell
  }
}

export function ReguaTimeline({ parcelaId }: ReguaTimelineProps) {
  const supabase = createClient()

  // Buscar notificações da parcela
  const { data: notificacoes = [], isLoading, refetch } = useQuery({
    queryKey: ['regua-notificacoes', parcelaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notificacao')
        .select('*')
        .eq('parcela_id', parcelaId)
        .order('data_envio', { ascending: true })

      if (error) throw error
      return (data || []) as unknown as Notificacao[]
    },
  })

  // Agrupar notificações por tipo de evento
  const eventosPorTipo: Record<TipoEventoRegua, Notificacao[]> = {
    lembrete: [],
    aviso: [],
    reaviso_1: [],
    reaviso_2: [],
    juridico: [],
  }

  notificacoes.forEach((notif) => {
    if (notif.tipo_evento) {
      eventosPorTipo[notif.tipo_evento].push(notif)
    }
  })

  // Montar eventos da timeline
  const eventos: EventoRegua[] = [
    { tipo: 'lembrete', dias_referencia: -3, descricao: EVENTO_DESCRICOES.lembrete, icon: 'bell' },
    { tipo: 'aviso', dias_referencia: 1, descricao: EVENTO_DESCRICOES.aviso, icon: 'alert-triangle' },
    { tipo: 'reaviso_1', dias_referencia: 7, descricao: EVENTO_DESCRICOES.reaviso_1, icon: 'alert-circle' },
    { tipo: 'reaviso_2', dias_referencia: 15, descricao: EVENTO_DESCRICOES.reaviso_2, icon: 'message-circle' },
    { tipo: 'juridico', dias_referencia: 30, descricao: EVENTO_DESCRICOES.juridico, icon: 'gavel' },
  ]

  const handleReenviar = async (tipoEvento: TipoEventoRegua) => {
    try {
      // TODO: Implementar reenvio de notificação
      toast.success(`Notificação de ${tipoEvento} reenviada`)
      refetch()
    } catch (error) {
      toast.error('Erro ao reenviar notificação')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Régua de Cobrança</h3>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Timeline */}
      <div className="relative space-y-6">
        {/* Linha vertical */}
        <div className="absolute left-4 top-0 h-full w-0.5 bg-border" />

        {/* Eventos */}
        {eventos.map((evento, index) => {
          const Icon = EVENTO_ICONS[evento.tipo]
          const notificacoesEvento = eventosPorTipo[evento.tipo]
          const ultimaNotificacao = notificacoesEvento[notificacoesEvento.length - 1]

          // Determinar status do evento
          let statusEvento: 'agendado' | 'enviado' | 'entregue' | 'erro' = 'agendado'
          if (ultimaNotificacao) {
            statusEvento = ultimaNotificacao.status as any
          }

          const statusBadge = getNotificacaoStatusBadge(statusEvento)

          return (
            <div key={evento.tipo} className="relative flex gap-4">
              {/* Ícone */}
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  statusEvento === 'enviado' || statusEvento === 'entregue'
                    ? 'border-blue-500 bg-blue-50'
                    : statusEvento === 'erro'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4 text-foreground" />
              </div>

              {/* Conteúdo */}
              <div className="flex-1 pb-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">
                        D{evento.dias_referencia > 0 ? '+' : ''}
                        {evento.dias_referencia}
                      </h4>
                      <StatusBadge
                        variant={statusBadge.variant}
                        label={statusBadge.label}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {evento.descricao}
                    </p>

                    {/* Detalhes da última notificação */}
                    {ultimaNotificacao && (
                      <div className="mt-3 space-y-2 rounded-lg border bg-muted/50 p-3 text-sm">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const CanalIcon = getCanalIcon(ultimaNotificacao.canal)
                            return <CanalIcon className="h-4 w-4 text-muted-foreground" />
                          })()}
                          <span className="font-medium capitalize">
                            {ultimaNotificacao.canal}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">
                            {ultimaNotificacao.destinatario}
                          </span>
                        </div>

                        {ultimaNotificacao.data_envio && (
                          <p className="text-xs text-muted-foreground">
                            Enviado em:{' '}
                            {format(
                              new Date(ultimaNotificacao.data_envio),
                              "dd/MM/yyyy 'às' HH:mm",
                              { locale: ptBR }
                            )}
                          </p>
                        )}

                        {ultimaNotificacao.tentativas > 1 && (
                          <p className="text-xs text-orange-600">
                            {ultimaNotificacao.tentativas} tentativas de envio
                          </p>
                        )}

                        {ultimaNotificacao.erro_mensagem && (
                          <p className="text-xs text-red-600">
                            Erro: {ultimaNotificacao.erro_mensagem}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Botão de reenvio */}
                  {ultimaNotificacao && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReenviar(evento.tipo)}
                    >
                      Reenviar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
