'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useContratosVencendo } from '@/hooks/useImobiliaria'
import { formatCurrency, formatDate } from '@/lib/utils/formatters'
import { AlertTriangle, FileText, Phone, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

export function ContratosVencendo({ dias = 60 }: { dias?: number }) {
  const { data: contratos, isLoading, error } = useContratosVencendo(dias)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center gap-2 p-6">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <p className="text-sm text-destructive">
            Erro ao carregar contratos. Tente novamente.
          </p>
        </CardContent>
      </Card>
    )
  }

  const contratosPrioritarios = contratos?.filter(c => c.dias_restantes <= 30) || []
  const contratosAvisos = contratos?.filter(c => c.dias_restantes > 30) || []

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Contratos Vencendo
            </CardTitle>
            <CardDescription>
              {contratos?.length || 0} contrato(s) vencem nos próximos {dias} dias
            </CardDescription>
          </div>
          {contratos && contratos.length > 0 && (
            <Button variant="outline" size="sm">
              Ver Todos
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!contratos || contratos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              Nenhum contrato vencendo nos próximos {dias} dias
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Ótimo! Todos os contratos estão em dia.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Contratos Prioritários (≤ 30 dias) */}
            {contratosPrioritarios.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-600"></span>
                  Atenção Urgente ({contratosPrioritarios.length})
                </h4>
                <div className="space-y-3">
                  {contratosPrioritarios.map((contrato) => (
                    <ContratoCard key={contrato.id} contrato={contrato} urgente />
                  ))}
                </div>
              </div>
            )}

            {/* Contratos para Acompanhamento (> 30 dias) */}
            {contratosAvisos.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-600"></span>
                  Acompanhamento ({contratosAvisos.length})
                </h4>
                <div className="space-y-3">
                  {contratosAvisos.map((contrato) => (
                    <ContratoCard key={contrato.id} contrato={contrato} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ContratoCard({
  contrato,
  urgente = false
}: {
  contrato: any
  urgente?: boolean
}) {
  const diasRestantes = contrato.dias_restantes

  const getBadgeVariant = () => {
    if (diasRestantes <= 7) return 'destructive'
    if (diasRestantes <= 30) return 'default'
    return 'secondary'
  }

  const getBadgeText = () => {
    if (diasRestantes === 0) return 'Vence hoje'
    if (diasRestantes === 1) return 'Vence amanhã'
    if (diasRestantes <= 7) return `${diasRestantes} dias`
    if (diasRestantes <= 30) return `${diasRestantes} dias`
    return `${diasRestantes} dias`
  }

  return (
    <div className={`rounded-lg border p-4 hover:bg-accent transition-colors ${
      urgente ? 'border-red-200 bg-red-50' : 'bg-background'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h5 className="font-medium text-sm">{contrato.locatario_nome}</h5>
            <Badge variant={getBadgeVariant()} className="text-xs">
              {getBadgeText()}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{contrato.codigo_imovel}</span>
            </div>
            {contrato.locatario_telefone && (
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>{contrato.locatario_telefone}</span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-green-600">
            {formatCurrency(contrato.valor)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(contrato.data_fim_contrato)}
          </p>
        </div>
      </div>

      {urgente && (
        <div className="mt-3 pt-3 border-t border-red-200 flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 h-8">
            <Phone className="h-3 w-3 mr-1" />
            Contatar
          </Button>
          <Button size="sm" className="flex-1 h-8">
            <FileText className="h-3 w-3 mr-1" />
            Renovar
          </Button>
        </div>
      )}
    </div>
  )
}
