'use client'

import { use } from 'react'
import { useEndereco } from '@/hooks/useImobiliaria'
import { EnderecoForm } from '@/components/imobiliaria/forms/endereco-form'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface EditarEnderecoPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditarEnderecoPage({ params }: EditarEnderecoPageProps) {
  const { id } = use(params)
  const enderecoId = parseInt(id)
  const { data: endereco, isLoading } = useEndereco(enderecoId)

  return (
    <div className="flex flex-col gap-6 p-8 pt-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Endereço</h1>
        <p className="text-muted-foreground mt-1">
          Atualize as informações do endereço
        </p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : !endereco ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Endereço não encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <EnderecoForm initialData={endereco} enderecoId={enderecoId} />
      )}
    </div>
  )
}
