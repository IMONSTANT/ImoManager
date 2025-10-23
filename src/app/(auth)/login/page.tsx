import { LoginForm } from '@/components/auth/login-form'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Building2, TrendingUp, BarChart3, Shield } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-primary/10 via-accent to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
        <div className="max-w-md mx-auto space-y-8 relative z-10 animate-fade-in">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 bg-primary/10 text-primary px-4 py-2.5 rounded-full shadow-sm border border-primary/20">
              <Building2 className="h-5 w-5" />
              <span className="font-semibold text-sm">Beeing Rich</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent leading-tight">
              Plataforma Imobiliária Premium
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Gestão completa de investimentos e propriedades com tecnologia de ponta
            </p>
          </div>
          <Separator />
          <div className="space-y-5">
            <div className="flex items-start gap-4 group">
              <div className="mt-1 rounded-xl bg-gradient-to-br from-success/10 to-success/5 p-3 group-hover:from-success/20 group-hover:to-success/10 transition-colors duration-300">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Análise de Investimentos</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Insights detalhados para maximizar seus retornos
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 group">
              <div className="mt-1 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 p-3 group-hover:from-secondary/20 group-hover:to-secondary/10 transition-colors duration-300">
                <BarChart3 className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Dashboard Completo</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Acompanhe todo seu portfólio em tempo real
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 group">
              <div className="mt-1 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-3 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors duration-300">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Segurança Premium</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Seus dados protegidos com criptografia de ponta
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="space-y-3 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Bem-vindo de volta</h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Acesse sua conta para gerenciar seus investimentos
            </p>
          </div>

          <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="pt-6">
              <LoginForm />
            </CardContent>
          </Card>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Não tem uma conta? </span>
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
            >
              Cadastre-se gratuitamente
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
