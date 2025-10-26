'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useContratosVencendo } from '@/hooks/useImobiliaria'
import { formatCurrency, formatDate } from '@/lib/utils/formatters'
import { AlertTriangle, FileText, Phone, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ContratosVencendo({ dias = 60 }: { dias?: number }) {
  const { data: contratos, isLoading, error } = useContratosVencendo(dias)

  if (isLoading) {
    return (
      <Card className="border-slate-800/50">
        <CardHeader className="space-y-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
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
      <Card className="border-red-900/50 bg-red-950/20">
        <CardContent className="flex items-center gap-3 p-6">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-200">
            Erro ao carregar contratos. Tente novamente.
          </p>
        </CardContent>
      </Card>
    )
  }

  const contratosPrioritarios = contratos?.filter(c => c.dias_restantes <= 30) || []
  const contratosAvisos = contratos?.filter(c => c.dias_restantes > 30) || []

  return (
    <Card className="border-slate-800/50 bg-slate-950/50">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2.5">
              {/* Refined alert icon with better colors */}
              <div className="relative">
                <AlertTriangle className="h-5 w-5 text-amber-500 fill-amber-500/10" />
              </div>
              <span className="text-foreground tracking-tight">Contratos Vencendo</span>
            </CardTitle>
            <CardDescription className="text-slate-400">
              {contratos?.length || 0} contrato(s) vencem nos próximos {dias} dias
            </CardDescription>
          </div>
          {contratos && contratos.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700 hover:bg-amber-500/10 hover:border-amber-600/50 hover:text-amber-400 transition-colors duration-200"
            >
              Ver Todos
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {!contratos || contratos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-slate-800/50 p-4 mb-4">
              <FileText className="h-8 w-8 text-slate-600" />
            </div>
            <p className="text-sm font-medium text-slate-300">
              Nenhum contrato vencendo nos próximos {dias} dias
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Ótimo! Todos os contratos estão em dia.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* SEÇÃO: Contratos Prioritários (≤ 30 dias) */}
            {contratosPrioritarios.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  {/* Refined pulsing indicator */}
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500/75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <h4 className="text-sm font-semibold text-red-400 tracking-tight">
                    Atenção Urgente
                  </h4>
                  <Badge variant="secondary" className="bg-red-950/50 text-red-300 border-red-900/50 text-xs font-medium">
                    {contratosPrioritarios.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {contratosPrioritarios.map((contrato) => (
                    <ContratoCard key={contrato.id} contrato={contrato} urgente />
                  ))}
                </div>
              </div>
            )}

            {/* SEÇÃO: Contratos para Acompanhamento (> 30 dias) */}
            {contratosAvisos.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  {/* Refined solid indicator */}
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
                  <h4 className="text-sm font-semibold text-amber-400 tracking-tight">
                    Acompanhamento
                  </h4>
                  <Badge variant="secondary" className="bg-amber-950/50 text-amber-300 border-amber-900/50 text-xs font-medium">
                    {contratosAvisos.length}
                  </Badge>
                </div>
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

  // Refined badge logic using only existing shadcn/ui variants
  const getBadgeProps = () => {
    if (diasRestantes <= 7) {
      return {
        variant: 'destructive' as const,
        className: 'bg-red-600 text-white border-0 font-semibold shadow-sm'
      }
    }
    if (diasRestantes <= 30) {
      return {
        variant: 'secondary' as const,
        className: 'bg-orange-600 text-white border-0 font-semibold shadow-sm'
      }
    }
    return {
      variant: 'secondary' as const,
      className: 'bg-amber-600/90 text-white border-0 font-semibold shadow-sm'
    }
  }

  // More contextual badge text
  const getBadgeText = () => {
    if (diasRestantes === 0) return 'Vence hoje'
    if (diasRestantes === 1) return 'Vence amanhã'
    if (diasRestantes <= 7) return `${diasRestantes} dias`
    if (diasRestantes <= 30) return `${diasRestantes} dias`
    return `${diasRestantes} dias`
  }

  // Refined card styling with better visual hierarchy
  const getCardStyles = () => {
    // EXTREMELY URGENT: 0-7 days (Red - Highest opacity for maximum attention)
    if (diasRestantes <= 7) {
      return cn(
        // Stronger dark background for urgency
        "bg-slate-900/70",
        // Bold red left border (4px accent)
        "border-l-4 border-l-red-500",
        // Subtle neutral borders
        "border-t border-r border-b border-slate-800",
        // Refined hover: subtle background shift + soft shadow
        "hover:bg-slate-900/80 hover:shadow-md hover:shadow-red-500/5",
        // Smooth transition
        "transition-all duration-200 ease-out",
        // Rounded corners
        "rounded-lg"
      )
    }

    // URGENT: 8-30 days (Orange - Medium-high opacity)
    if (diasRestantes <= 30) {
      return cn(
        // Medium dark background
        "bg-slate-900/55",
        // Orange left border (4px accent)
        "border-l-4 border-l-orange-500",
        // Subtle neutral borders
        "border-t border-r border-b border-slate-800",
        // Refined hover
        "hover:bg-slate-900/65 hover:shadow-md hover:shadow-orange-500/5",
        "transition-all duration-200 ease-out",
        "rounded-lg"
      )
    }

    // WARNING: > 30 days (Amber - Lower opacity for less urgency)
    return cn(
      // Lighter dark background
      "bg-slate-900/40",
      // Amber left border (4px accent)
      "border-l-4 border-l-amber-500",
      // Subtle neutral borders
      "border-t border-r border-b border-slate-800",
      // Refined hover
      "hover:bg-slate-900/50 hover:shadow-md hover:shadow-amber-500/5",
      "transition-all duration-200 ease-out",
      "rounded-lg"
    )
  }

  // Refined text colors with better contrast
  const getTenantNameColor = () => {
    if (diasRestantes <= 7) return "text-slate-50"
    if (diasRestantes <= 30) return "text-slate-100"
    return "text-slate-200"
  }

  // Refined icon colors
  const getIconColor = () => {
    if (diasRestantes <= 7) return "text-red-400"
    if (diasRestantes <= 30) return "text-orange-400"
    return "text-amber-400"
  }

  // Refined metadata colors
  const getMetadataColor = () => {
    if (diasRestantes <= 7) return "text-slate-400"
    if (diasRestantes <= 30) return "text-slate-400"
    return "text-slate-400"
  }

  const badgeProps = getBadgeProps()

  return (
    <div className={cn("p-5", getCardStyles())}>
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4 mb-3">
        {/* Left: Tenant info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2">
            {/* Tenant name with refined typography */}
            <h5 className={cn(
              "font-semibold text-base truncate",
              getTenantNameColor()
            )}>
              {contrato.locatario_nome}
            </h5>
            {/* Refined badge with better spacing */}
            <Badge
              variant={badgeProps.variant}
              className={cn("text-xs shrink-0", badgeProps.className)}
            >
              {getBadgeText()}
            </Badge>
          </div>

          {/* Metadata row with refined spacing */}
          <div className={cn(
            "flex items-center gap-4 text-xs",
            getMetadataColor()
          )}>
            <div className="flex items-center gap-1.5">
              <MapPin className={cn("h-3.5 w-3.5 shrink-0", getIconColor())} />
              <span className="font-medium">{contrato.codigo_imovel}</span>
            </div>
            {contrato.locatario_telefone && (
              <div className="flex items-center gap-1.5">
                <Phone className={cn("h-3.5 w-3.5 shrink-0", getIconColor())} />
                <span className="font-medium">{contrato.locatario_telefone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Financial info */}
        <div className="text-right shrink-0">
          {/* Value with success color (money is good!) */}
          <p className="text-base font-bold text-emerald-400 mb-0.5">
            {formatCurrency(contrato.valor)}
          </p>
          {/* Expiration date */}
          <p className="text-xs font-medium text-slate-500">
            {formatDate(contrato.data_fim_contrato)}
          </p>
        </div>
      </div>

      {/* Action Buttons for urgent contracts */}
      {urgente && (
        <div className={cn(
          "mt-4 pt-4 flex gap-3",
          // Refined border color based on urgency
          diasRestantes <= 7 && "border-t border-red-900/30",
          diasRestantes <= 30 && diasRestantes > 7 && "border-t border-orange-900/30"
        )}>
          {/* Contact Button - Outline style */}
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "flex-1 h-9 text-xs font-semibold transition-all duration-200",
              diasRestantes <= 7 && "border-red-800/50 text-red-300 hover:bg-red-950/40 hover:border-red-700 hover:text-red-200",
              diasRestantes <= 30 && diasRestantes > 7 && "border-orange-800/50 text-orange-300 hover:bg-orange-950/40 hover:border-orange-700 hover:text-orange-200"
            )}
          >
            <Phone className="h-3.5 w-3.5 mr-1.5" />
            Contatar
          </Button>

          {/* Renew Button - Primary action */}
          <Button
            size="sm"
            className={cn(
              "flex-1 h-9 text-xs font-semibold transition-all duration-200 shadow-sm",
              diasRestantes <= 7 && "bg-red-600 hover:bg-red-500 text-white",
              diasRestantes <= 30 && diasRestantes > 7 && "bg-orange-600 hover:bg-orange-500 text-white"
            )}
          >
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Renovar
          </Button>
        </div>
      )}
    </div>
  )
}
