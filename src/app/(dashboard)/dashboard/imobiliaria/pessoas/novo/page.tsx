import { Metadata } from 'next'
import { PessoaForm } from '@/components/imobiliaria/forms/pessoa-form'

export const metadata: Metadata = {
  title: 'Nova Pessoa - Sistema Imobiliário',
}

export default function NovaPessoaPage() {
  return (
    <div className="flex flex-col gap-6 p-8 pt-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nova Pessoa</h1>
        <p className="text-muted-foreground mt-1">Cadastre uma nova pessoa no sistema</p>
      </div>
      <PessoaForm />
    </div>
  )
}
