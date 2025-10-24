import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

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
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent px-4 py-16 sm:py-24 lg:py-32 min-h-[calc(100vh-4rem)]">
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
      </main>
    </div>
  );
}
