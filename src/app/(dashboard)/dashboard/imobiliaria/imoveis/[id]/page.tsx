import { Metadata } from 'next'
import { ImovelDetails } from '@/components/imobiliaria/imovel-details'

export const metadata: Metadata = {
  title: 'Detalhes do Imóvel - Sistema Imobiliário',
  description: 'Visualize as informações completas do imóvel'
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ImovelDetailsPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="flex flex-col gap-6 p-8 pt-6">
      <ImovelDetails imovelId={parseInt(id)} />
    </div>
  )
}
