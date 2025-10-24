/**
 * Componente: DocumentoCard
 * Card visual para seleção de tipo de documento
 */

import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { DocumentoTipo } from '@/lib/types/documento'

interface DocumentoCardProps {
  tipo: DocumentoTipo
  titulo: string
  descricao: string
  icon: LucideIcon
  selecionado?: boolean
  onClick: () => void
}

export function DocumentoCard({
  tipo,
  titulo,
  descricao,
  icon: Icon,
  selecionado = false,
  onClick,
}: DocumentoCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        selecionado
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 hover:border-blue-300'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={`rounded-lg p-3 ${
              selecionado ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'
            }`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-mono font-semibold ${
                selecionado ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {tipo}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{titulo}</h3>
            <p className="text-sm text-gray-600">{descricao}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
