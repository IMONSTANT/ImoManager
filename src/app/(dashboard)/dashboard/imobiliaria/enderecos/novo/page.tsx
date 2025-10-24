'use client'

import { EnderecoForm } from '@/components/imobiliaria/forms/endereco-form'

export default function NovoEnderecoPage() {
  return (
    <div className="flex flex-col gap-6 p-8 pt-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Novo Endereço</h1>
        <p className="text-muted-foreground mt-1">
          Cadastre um novo endereço no sistema
        </p>
      </div>

      <EnderecoForm />
    </div>
  )
}
