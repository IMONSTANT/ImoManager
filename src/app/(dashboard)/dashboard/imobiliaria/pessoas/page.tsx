import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { PessoasTable } from '@/components/imobiliaria/pessoas-table'
import { Skeleton } from '@/components/ui/skeleton'

export default function PessoasPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pessoas</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie todas as pessoas cadastradas no sistema
          </p>
        </div>
        <Link href="/dashboard/imobiliaria/pessoas/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Pessoa
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pessoas</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as pessoas cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <PessoasTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
