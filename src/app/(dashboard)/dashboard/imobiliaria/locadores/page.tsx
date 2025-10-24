import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { LocadoresTable } from '@/components/imobiliaria/locadores-table'
import { Skeleton } from '@/components/ui/skeleton'

export default function LocadoresPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Locadores</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os locadores (proprietários de imóveis)
          </p>
        </div>
        <Link href="/dashboard/imobiliaria/locadores/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Locador
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Locadores</CardTitle>
          <CardDescription>
            Visualize todos os proprietários de imóveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <LocadoresTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
