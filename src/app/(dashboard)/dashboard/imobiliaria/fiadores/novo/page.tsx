import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FiadorForm } from '@/components/imobiliaria/forms/fiador-form'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NovoFiadorPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/imobiliaria/fiadores">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Novo Fiador</h2>
          <p className="text-muted-foreground mt-1">
            Cadastre um novo fiador no sistema
          </p>
        </div>
      </div>

      <FiadorForm />
    </div>
  )
}
