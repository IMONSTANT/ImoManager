/**
 * Componente: UpcomingPayments
 *
 * Lista de boletos/parcelas a vencer nos próximos 7 dias
 */

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, DollarSign, Send, FileDown } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface ParcelaVencer {
  id: string
  numero_parcela: number
  valor_original: number
  data_vencimento: string
  status: string
  contrato: {
    codigo_contrato: string
    locatario: {
      nome: string
    }
  }
}

/**
 * Busca parcelas a vencer nos próximos 7 dias
 */
async function fetchParcelasAVencer(): Promise<ParcelaVencer[]> {
  const supabase = createClient()

  const hoje = new Date()
  const proximosDias = new Date()
  proximosDias.setDate(hoje.getDate() + 7)

  const { data, error } = await supabase
    .from('parcela')
    .select(`
      id,
      numero_parcela,
      valor_original,
      data_vencimento,
      status,
      contrato:contrato_id (
        codigo_contrato,
        locatario:locatario_id (
          pessoa:pessoa_id (nome)
        )
      )
    `)
    .in('status', ['pendente', 'emitido'])
    .gte('data_vencimento', hoje.toISOString())
    .lte('data_vencimento', proximosDias.toISOString())
    .order('data_vencimento', { ascending: true })
    .limit(20)

  if (error) {
    console.error('Erro ao buscar parcelas:', error)
    throw error
  }

  return data as any
}

/**
 * Formata data para exibição
 */
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  })
}

/**
 * Formata moeda
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(value)
}

/**
 * Calcula dias restantes até vencimento
 */
function getDiasRestantes(dataVencimento: string): number {
  const hoje = new Date()
  const vencimento = new Date(dataVencimento)
  const diffMs = vencimento.getTime() - hoje.getTime()
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return diffDias
}

/**
 * Badge de urgência baseado em dias restantes
 */
function UrgenciaBadge({ diasRestantes }: { diasRestantes: number }) {
  if (diasRestantes === 0) {
    return <Badge variant="destructive">Vence hoje</Badge>
  }
  if (diasRestantes === 1) {
    return <Badge variant="destructive">Vence amanhã</Badge>
  }
  if (diasRestantes <= 3) {
    return <Badge variant="secondary">Em {diasRestantes} dias</Badge>
  }
  return <Badge variant="outline">Em {diasRestantes} dias</Badge>
}

/**
 * Item de parcela
 */
function ParcelaItem({ parcela }: { parcela: any }) {
  const diasRestantes = getDiasRestantes(parcela.data_vencimento)

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">
            {parcela.contrato?.locatario?.pessoa?.nome || 'N/A'}
          </p>
          <UrgenciaBadge diasRestantes={diasRestantes} />
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(parcela.data_vencimento)}
          </span>
          <span>Parcela #{parcela.numero_parcela}</span>
          <span>{parcela.contrato?.codigo_contrato}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right mr-2">
          <p className="text-sm font-semibold">
            {formatCurrency(parcela.valor_original)}
          </p>
        </div>
        <Button variant="ghost" size="icon" title="Emitir 2ª via">
          <FileDown className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" title="Reenviar boleto">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

/**
 * Skeleton de item
 */
function ParcelaItemSkeleton() {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-3 w-[300px]" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-4 w-[80px]" />
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  )
}

export function UpcomingPayments() {
  const { data: parcelas, isLoading, isError, error } = useQuery({
    queryKey: ['parcelas-a-vencer'],
    queryFn: fetchParcelasAVencer,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchInterval: 1000 * 60 * 10 // Atualiza a cada 10 minutos
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Boletos a Vencer
        </CardTitle>
        <CardDescription>
          Próximos 7 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isError && (
          <div className="text-sm text-destructive">
            Erro ao carregar: {error?.message || 'Erro desconhecido'}
          </div>
        )}

        {isLoading && (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <ParcelaItemSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && !isError && parcelas && parcelas.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">Nenhum boleto a vencer nos próximos 7 dias</p>
          </div>
        )}

        {!isLoading && !isError && parcelas && parcelas.length > 0 && (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-1">
              {parcelas.map((parcela, index) => (
                <div key={parcela.id}>
                  <ParcelaItem parcela={parcela} />
                  {index < parcelas.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
