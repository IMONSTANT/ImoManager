import { RegisterForm } from '@/components/auth/register-form'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Building2, Sparkles, LineChart, Target, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-accent/20 via-secondary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="max-w-md mx-auto space-y-8 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full">
              <Building2 className="h-5 w-5" />
              <span className="font-semibold">Beeing Rich</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
              Transforme Seus Investimentos Imobiliários
            </h1>
            <p className="text-xl text-muted-foreground">
              Junte-se a milhares de investidores inteligentes
            </p>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-lg bg-secondary/10 p-2.5">
                <Sparkles className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Análise Inteligente</h3>
                <p className="text-sm text-muted-foreground">
                  IA avançada para identificar as melhores oportunidades
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-lg bg-accent/10 p-2.5">
                <LineChart className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Valorização em Tempo Real</h3>
                <p className="text-sm text-muted-foreground">
                  Acompanhe a evolução do seu patrimônio 24/7
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-lg bg-primary/10 p-2.5">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">ROI Otimizado</h3>
                <p className="text-sm text-muted-foreground">
                  Maximize seus retornos com estratégias personalizadas
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-xl border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-accent" />
              <span className="font-semibold">Grátis para começar</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sem cartão de crédito. Acesso completo por 30 dias.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-3 text-center lg:text-left">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold tracking-tight">Crie sua conta</h2>
              <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
                Premium
              </Badge>
            </div>
            <p className="text-muted-foreground text-lg">
              Comece a investir com inteligência hoje mesmo
            </p>
          </div>

          <Card className="border-2 shadow-lg">
            <CardContent className="pt-6">
              <RegisterForm />
            </CardContent>
          </Card>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Já possui uma conta? </span>
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
