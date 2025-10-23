import { LoginForm } from '@/components/auth/login-form'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Building2, TrendingUp, BarChart3, Shield } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-primary/20 via-accent/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="max-w-md mx-auto space-y-8 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
              <Building2 className="h-5 w-5" />
              <span className="font-semibold">Beeing Rich</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Plataforma Imobiliária Premium
            </h1>
            <p className="text-xl text-muted-foreground">
              Gestão completa de investimentos e propriedades
            </p>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-lg bg-accent/10 p-2.5">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Análise de Investimentos</h3>
                <p className="text-sm text-muted-foreground">
                  Insights detalhados para maximizar seus retornos
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-lg bg-secondary/10 p-2.5">
                <BarChart3 className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Dashboard Completo</h3>
                <p className="text-sm text-muted-foreground">
                  Acompanhe todo seu portfólio em tempo real
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-lg bg-primary/10 p-2.5">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Segurança Premium</h3>
                <p className="text-sm text-muted-foreground">
                  Seus dados protegidos com criptografia de ponta
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-3 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Bem-vindo de volta</h2>
            <p className="text-muted-foreground text-lg">
              Acesse sua conta para gerenciar seus investimentos
            </p>
          </div>

          <Card className="border-2 shadow-lg">
            <CardContent className="pt-6">
              <LoginForm />
            </CardContent>
          </Card>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Não tem uma conta? </span>
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Cadastre-se gratuitamente
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
