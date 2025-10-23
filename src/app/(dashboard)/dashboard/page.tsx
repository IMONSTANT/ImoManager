import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, TrendingUp, DollarSign, Target, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch some stats
  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const stats = [
    {
      title: 'Valor Total da Carteira',
      value: 'R$ 2.4M',
      description: 'Patrimônio imobiliário total',
      icon: DollarSign,
      trend: '+18.2%',
      trendUp: true,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Imóveis Ativos',
      value: '12',
      description: 'Propriedades em portfólio',
      icon: Building2,
      trend: '+2 este mês',
      trendUp: true,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'ROI Médio',
      value: '24.5%',
      description: 'Retorno sobre investimento',
      icon: TrendingUp,
      trend: '+5.3% vs. ano passado',
      trendUp: true,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Ocupação',
      value: '94%',
      description: 'Taxa de ocupação média',
      icon: Target,
      trend: '+2.1% este mês',
      trendUp: true,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ]

  const recentProperties = [
    { name: 'Apartamento Vila Mariana', type: 'Residencial', value: 'R$ 850K', status: 'Valorizado', change: '+12%', up: true },
    { name: 'Sala Comercial Faria Lima', type: 'Comercial', value: 'R$ 1.2M', status: 'Estável', change: '+2%', up: true },
    { name: 'Cobertura Jardins', type: 'Premium', value: 'R$ 2.8M', status: 'Valorizado', change: '+18%', up: true },
  ]

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Imobiliário</h2>
          <p className="text-muted-foreground mt-1">
            Visão geral dos seus investimentos e propriedades
          </p>
        </div>
        <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30 px-4 py-2">
          <Activity className="h-4 w-4 mr-2" />
          Última atualização: Agora
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              <div className="flex items-center mt-2">
                {stat.trendUp ? (
                  <ArrowUpRight className="h-4 w-4 text-accent mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-destructive mr-1" />
                )}
                <span className={`text-xs font-medium ${stat.trendUp ? 'text-accent' : 'text-destructive'}`}>
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-2">
          <CardHeader>
            <CardTitle>Evolução do Portfólio</CardTitle>
            <CardDescription>
              Valorização dos seus imóveis nos últimos 12 meses
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-lg border-2 border-dashed">
              <div className="text-center space-y-2">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Gráfico de evolução será exibido aqui
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-2">
          <CardHeader>
            <CardTitle>Propriedades em Destaque</CardTitle>
            <CardDescription>
              Imóveis com melhor performance recente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProperties.map((property, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="mt-1 rounded-lg bg-primary/10 p-2">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-none truncate">
                      {property.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {property.type}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-primary">{property.value}</span>
                      <Badge variant="outline" className={property.up ? 'border-accent text-accent' : 'border-destructive text-destructive'}>
                        {property.change}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
