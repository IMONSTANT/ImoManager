import { Metadata } from 'next'
import { ImoveisTable } from '@/components/imobiliaria/imoveis-table'

export const metadata: Metadata = {
  title: 'Imóveis - Sistema Imobiliário',
  description: 'Gerencie seu portfólio de imóveis'
}

export default function ImoveisPage() {
  return (
    <div className="flex flex-col gap-6 p-8 pt-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gestão de Imóveis
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie seu portfólio completo de imóveis para locação
        </p>
      </div>

      <ImoveisTable />
    </div>
  )
}
