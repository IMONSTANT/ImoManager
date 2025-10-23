import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { ContratosTable } from '@/components/imobiliaria/contratos-table'
import { Skeleton } from '@/components/ui/skeleton'

export default function ContratosPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contratos de Locação</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os contratos de locação de imóveis
          </p>
        </div>
        <Link href="/dashboard/imobiliaria/contratos/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Contrato
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contratos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os contratos de locação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <ContratosTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
