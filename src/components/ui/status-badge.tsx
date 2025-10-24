/**
 * STATUS BADGE COMPONENT
 *
 * Componente reutilizável para exibir badges de status coloridos
 * Utilizado em Parcelas, Cobranças, Notificações, etc
 */

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        gray: 'border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
        blue: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
        green:
          'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        red: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        orange:
          'border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
        yellow:
          'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
        purple:
          'border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
        outline: 'text-foreground border border-input bg-background',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Texto a ser exibido no badge
   */
  label: string
  /**
   * Ícone opcional (componente React)
   */
  icon?: React.ReactNode
}

/**
 * Badge de status reutilizável
 *
 * @example
 * ```tsx
 * <StatusBadge variant="green" label="Pago" />
 * <StatusBadge variant="red" label="Vencido" icon={<AlertCircle />} />
 * ```
 */
export function StatusBadge({
  label,
  icon,
  variant,
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon && <span className="mr-1 h-3 w-3">{icon}</span>}
      {label}
    </div>
  )
}

/**
 * Tipo helper para cores de status
 */
export type StatusColor = 'gray' | 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'purple'

/**
 * Helper para mapear status de parcela para cor
 */
export function getParcelaStatusBadge(status: string): {
  variant: StatusColor
  label: string
} {
  const statusMap: Record<string, { variant: StatusColor; label: string }> = {
    pendente: { variant: 'gray', label: 'Pendente' },
    emitido: { variant: 'blue', label: 'Emitido' },
    pago: { variant: 'green', label: 'Pago' },
    vencido: { variant: 'red', label: 'Vencido' },
    cancelado: { variant: 'orange', label: 'Cancelado' },
    estornado: { variant: 'yellow', label: 'Estornado' },
  }

  return statusMap[status] || { variant: 'gray', label: status }
}

/**
 * Helper para mapear status de cobrança para cor
 */
export function getCobrancaStatusBadge(status: string): {
  variant: StatusColor
  label: string
} {
  const statusMap: Record<string, { variant: StatusColor; label: string }> = {
    criada: { variant: 'gray', label: 'Preparando' },
    emitida: { variant: 'blue', label: 'Aguardando Pagamento' },
    paga: { variant: 'green', label: 'Confirmada' },
    vencida: { variant: 'red', label: 'Atrasada' },
    cancelada: { variant: 'orange', label: 'Cancelada' },
    estornada: { variant: 'yellow', label: 'Estornada' },
  }

  return statusMap[status] || { variant: 'gray', label: status }
}

/**
 * Helper para mapear status de notificação para cor
 */
export function getNotificacaoStatusBadge(status: string): {
  variant: StatusColor
  label: string
} {
  const statusMap: Record<string, { variant: StatusColor; label: string }> = {
    agendado: { variant: 'gray', label: 'Agendado' },
    enviado: { variant: 'blue', label: 'Enviado' },
    entregue: { variant: 'green', label: 'Entregue' },
    lido: { variant: 'green', label: 'Lido' },
    erro: { variant: 'red', label: 'Erro' },
    respondido: { variant: 'purple', label: 'Respondido' },
  }

  return statusMap[status] || { variant: 'gray', label: status }
}
