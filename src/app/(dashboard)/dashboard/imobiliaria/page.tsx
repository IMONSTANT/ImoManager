import { Metadata } from 'next'
import { DashboardStats } from '@/components/imobiliaria/dashboard-stats'
import { ContratosVencendo } from '@/components/imobiliaria/contratos-vencendo'
import { Building2, FileText, Users, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sistema Imobiliário - Dashboard',
  description: 'Gerencie imóveis, contratos e locações'
}

export default function ImobiliariaDashboard() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sistema Imobiliário
          </h1>
          <p className="text-muted-foreground mt-1">
            Visão geral e métricas do sistema de gestão de imóveis
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/imobiliaria/imoveis/novo">
              <Building2 className="mr-2 h-4 w-4" />
              Novo Imóvel
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/imobiliaria/contratos/novo">
              <FileText className="mr-2 h-4 w-4" />
              Novo Contrato
            </Link>
          </Button>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <DashboardStats />

      {/* Grid Layout */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Contratos Vencendo */}
        <div className="lg:col-span-2">
          <ContratosVencendo dias={60} />
        </div>

        {/* Menu de Acesso Rápido */}
        <div className="space-y-4">
          <QuickAccessCard
            title="Imóveis"
            description="Gerencie seu portfólio"
            icon={Building2}
            href="/dashboard/imobiliaria/imoveis"
            iconColor="text-blue-600"
          />
          <QuickAccessCard
            title="Contratos"
            description="Contratos de locação"
            icon={FileText}
            href="/dashboard/imobiliaria/contratos"
            iconColor="text-indigo-600"
          />
          <QuickAccessCard
            title="Pessoas"
            description="Locadores e locatários"
            icon={Users}
            href="/dashboard/imobiliaria/pessoas"
            iconColor="text-green-600"
          />
          <QuickAccessCard
            title="Empresas"
            description="Empresas clientes"
            icon={Briefcase}
            href="/dashboard/imobiliaria/empresas"
            iconColor="text-purple-600"
          />
        </div>
      </div>
    </div>
  )
}

function QuickAccessCard({
  title,
  description,
  icon: Icon,
  href,
  iconColor
}: {
  title: string
  description: string
  icon: any
  href: string
  iconColor: string
}) {
  return (
    <Link href={href} className="block group">
      <div className="rounded-lg border bg-card p-4 hover:shadow-md hover:border-primary transition-all">
        <div className="flex items-center gap-3">
          <div className={`rounded-lg bg-primary/10 p-2.5 ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <svg
            className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  )
}
