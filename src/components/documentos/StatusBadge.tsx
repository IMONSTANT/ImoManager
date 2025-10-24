/**
 * Componente: StatusBadge
 * Badge de status do documento com cores e ícones
 */

import { Badge } from '@/components/ui/badge'
import { FileText, Send, Clock, CheckCircle, X, AlertCircle } from 'lucide-react'
import type { DocumentoStatus } from '@/lib/types/documento'

interface StatusBadgeProps {
  status: DocumentoStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    rascunho: {
      label: 'Rascunho',
      variant: 'secondary' as const,
      icon: FileText,
      color: 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    },
    gerado: {
      label: 'Gerado',
      variant: 'default' as const,
      icon: FileText,
      color: 'bg-blue-100 text-blue-800 hover:bg-blue-100'
    },
    enviado: {
      label: 'Enviado',
      variant: 'default' as const,
      icon: Send,
      color: 'bg-purple-100 text-purple-800 hover:bg-purple-100'
    },
    parcialmente_assinado: {
      label: 'Parc. Assinado',
      variant: 'default' as const,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
    },
    assinado: {
      label: 'Assinado',
      variant: 'default' as const,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-800 hover:bg-green-100'
    },
    cancelado: {
      label: 'Cancelado',
      variant: 'destructive' as const,
      icon: X,
      color: 'bg-red-100 text-red-800 hover:bg-red-100'
    },
    expirado: {
      label: 'Expirado',
      variant: 'destructive' as const,
      icon: AlertCircle,
      color: 'bg-orange-100 text-orange-800 hover:bg-orange-100'
    },
  }

  const { label, icon: Icon, color } = config[status]

  return (
    <Badge className={`gap-1.5 ${color} ${className || ''}`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}
