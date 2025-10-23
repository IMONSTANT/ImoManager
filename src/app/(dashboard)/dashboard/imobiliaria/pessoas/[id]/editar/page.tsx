'use client'

import { useParams, useRouter } from 'next/navigation'
import { PessoaForm } from '@/components/imobiliaria/forms/pessoa-form'
import { usePessoa } from '@/hooks/useImobiliaria'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function EditarPessoaPage() {
  const params = useParams()
  const router = useRouter()
  const pessoaId = params.id ? parseInt(params.id as string) : null

  const { data: pessoa, isLoading, error } = usePessoa(pessoaId)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-8 pt-6">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !pessoa) {
    return (
      <div className="flex flex-col gap-6 p-8 pt-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-destructive">Erro</h1>
          <p className="text-muted-foreground mt-1">Não foi possível carregar a pessoa</p>
        </div>
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-2 p-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm">
              Pessoa não encontrada ou erro ao carregar dados.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-8 pt-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Pessoa</h1>
        <p className="text-muted-foreground mt-1">
          Atualize as informações de {pessoa.nome}
        </p>
      </div>
      <PessoaForm
        initialData={pessoa}
        pessoaId={pessoaId!}
        onSuccess={() => router.push('/dashboard/imobiliaria/pessoas')}
      />
    </div>
  )
}
