import { Metadata } from 'next'
import { ImovelForm } from '@/components/imobiliaria/forms/imovel-form'

export const metadata: Metadata = {
  title: 'Novo Imóvel - Sistema Imobiliário',
}

export default function NovoImovelPage() {
  return (
    <div className="flex flex-col gap-6 p-8 pt-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Novo Imóvel</h1>
        <p className="text-muted-foreground mt-1">Cadastre um novo imóvel no sistema</p>
      </div>
      <ImovelForm />
    </div>
  )
}
