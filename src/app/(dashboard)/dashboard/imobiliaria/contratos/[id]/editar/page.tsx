'use client'

import { useParams, useRouter } from 'next/navigation'
import { ContratoForm } from '@/components/imobiliaria/forms/contrato-form'
import { useContrato } from '@/hooks/useImobiliaria'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function EditarContratoPage() {
  const params = useParams()
  const router = useRouter()
  const contratoId = params.id ? parseInt(params.id as string) : null

  const { data: contrato, isLoading, error } = useContrato(contratoId)

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !contrato) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-destructive">Erro</h2>
          <p className="text-muted-foreground mt-1">Não foi possível carregar o contrato</p>
        </div>
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-2 p-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm">
              Contrato não encontrado ou erro ao carregar dados.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Editar Contrato de Locação</h2>
        <p className="text-muted-foreground mt-1">
          Atualize os dados do contrato {contrato.numero_contrato || `#${contrato.id}`}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Contrato</CardTitle>
          <CardDescription>
            Atualize as informações necessárias para o contrato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContratoForm
            initialData={contrato}
            contratoId={contratoId!}
            onSuccess={() => router.push('/dashboard/imobiliaria/contratos')}
          />
        </CardContent>
      </Card>
    </div>
  )
}
