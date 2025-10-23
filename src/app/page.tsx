import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, FileText, Home, Briefcase, TrendingUp, Shield, Clock, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold tracking-tight sm:text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Beeing Rich
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/register">
                <span className="hidden sm:inline">Começar Agora</span>
                <span className="sm:hidden">Começar</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent px-4 py-16 sm:py-24 lg:py-32">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
          <div className="container mx-auto text-center relative z-10">
            <Badge className="mb-6 text-xs sm:text-sm shadow-md animate-slide-down">
              Sistema Completo de Gestão Imobiliária
            </Badge>
            <h2 className="mb-6 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl animate-slide-up">
              Transforme a Gestão da sua
              <br className="hidden sm:block" />
              <span className="sm:ml-2"></span>
              <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                Imobiliária
              </span>
            </h2>
            <p className="mx-auto mb-10 max-w-3xl text-base text-muted-foreground sm:text-lg lg:text-xl px-4 leading-relaxed">
              Centralize o controle de imóveis, contratos, locadores e locatários em uma única plataforma moderna.
              Automatize processos, reduza erros e tome decisões baseadas em dados.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 px-4">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base sm:text-lg shadow-lg" asChild>
                <Link href="/register">Experimente Grátis</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base sm:text-lg" asChild>
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 sm:mb-16 text-center">
              <h3 className="mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold">Tudo que você precisa em um só lugar</h3>
              <p className="mx-auto max-w-2xl text-base sm:text-lg text-gray-600">
                Recursos poderosos para gerenciar todos os aspectos do seu negócio imobiliário
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="group hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 border-2">
                <CardHeader>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors duration-300">
                    <Home className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2">Gestão de Imóveis</CardTitle>
                  <CardDescription>Controle completo do seu portfólio</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>Cadastro detalhado de propriedades</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>Fotos e documentos anexados</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>Status e disponibilidade em tempo real</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>Histórico completo de movimentações</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 transition-all hover:border-blue-200 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Locadores e Locatários</CardTitle>
                  <CardDescription>Cadastro unificado de pessoas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                      Perfis completos com documentação
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                      Histórico de contratos e pagamentos
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                      Contatos e comunicação centralizada
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                      Análise de crédito e confiabilidade
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 transition-all hover:border-blue-200 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Contratos Inteligentes</CardTitle>
                  <CardDescription>Automatize e organize contratos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                      Criação rápida de contratos
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                      Alertas de vencimento automáticos
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                      Renovações e reajustes facilitados
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                      Armazenamento seguro de documentos
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 transition-all hover:border-blue-200 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                    <Briefcase className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl">Gestão de Empresas</CardTitle>
                  <CardDescription>Multi-empresas em uma plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                      Múltiplas empresas/filiais
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                      Separação de dados por empresa
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                      Relatórios consolidados
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                      Permissões granulares por empresa
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 transition-all hover:border-blue-200 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-xl">Alertas e Notificações</CardTitle>
                  <CardDescription>Nunca perca prazos importantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
                      Contratos próximos do vencimento
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
                      Pagamentos em atraso
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
                      Documentos para renovação
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
                      Notificações personalizáveis
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 transition-all hover:border-blue-200 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                    <BarChart3 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-xl">Relatórios e Analytics</CardTitle>
                  <CardDescription>Dados para decisões inteligentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      Dashboard com métricas em tempo real
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      Relatórios financeiros detalhados
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      Análise de ocupação e vacância
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      Exportação de dados (PDF, Excel)
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 sm:mb-16 text-center">
              <h3 className="mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold">Por que escolher a Beeing Rich?</h3>
              <p className="mx-auto max-w-2xl text-base sm:text-lg text-gray-600">
                Vantagens que fazem a diferença no dia a dia da sua imobiliária
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h4 className="mb-3 text-xl font-bold">Aumente sua Produtividade</h4>
                <p className="text-gray-600">
                  Automatize tarefas repetitivas e economize até 70% do tempo gasto com processos manuais.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h4 className="mb-3 text-xl font-bold">Segurança e Confiabilidade</h4>
                <p className="text-gray-600">
                  Seus dados protegidos com criptografia de ponta e backups automáticos diários.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="mb-3 text-xl font-bold">Suporte Especializado</h4>
                <p className="text-gray-600">
                  Equipe dedicada para ajudar você e seus clientes com qualquer dúvida ou necessidade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 py-12 sm:py-16 lg:py-20 text-white">
          <div className="absolute inset-0 bg-grid-white/[0.05]" />
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="mb-4 text-2xl font-bold sm:text-4xl lg:text-5xl">Comece a transformar sua imobiliária hoje</h3>
            <p className="mb-8 text-base sm:text-lg lg:text-xl opacity-90">
              Junte-se a centenas de imobiliárias que já confiam na nossa plataforma.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 px-4">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto h-12 px-8 text-base sm:text-lg font-semibold" asChild>
                <Link href="/register">Criar Conta Grátis</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 border-2 border-white bg-transparent px-8 text-base sm:text-lg font-semibold text-white hover:bg-white hover:text-blue-600"
                asChild
              >
                <Link href="/login">Fazer Login</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm sm:text-base text-gray-600">
          <p className="font-medium">Beeing Rich - Sistema Completo de Gestão Imobiliária</p>
          <p className="mt-2 text-xs sm:text-sm">Desenvolvido com tecnologia de ponta para o mercado imobiliário</p>
        </div>
      </footer>
    </div>
  );
}
