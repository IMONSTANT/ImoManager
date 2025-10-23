import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">User Management System</h1>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <Badge className="mb-4">Production Ready</Badge>
          <h2 className="mb-6 text-5xl font-bold tracking-tight">
            Complete User Management
            <br />
            <span className="text-blue-600">Built with Modern Stack</span>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Sistema completo de gestão de usuários com roles, organizações, autenticação segura,
            e muito mais. Construído seguindo as melhores práticas de desenvolvimento.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">Sign In</Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h3 className="mb-12 text-center text-3xl font-bold">Features Implementadas</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Autenticação Segura</CardTitle>
                  <CardDescription>Supabase Auth com proteção de rotas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Sign up / Sign in</li>
                    <li>✓ Email verification</li>
                    <li>✓ Password recovery</li>
                    <li>✓ Session management</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Multi-tenancy</CardTitle>
                  <CardDescription>Organizações com roles granulares</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Organizations</li>
                    <li>✓ Roles (Owner, Admin, Member)</li>
                    <li>✓ Row Level Security</li>
                    <li>✓ Permissions control</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Real-time Updates</CardTitle>
                  <CardDescription>Sincronização instantânea</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Supabase Realtime</li>
                    <li>✓ Live data sync</li>
                    <li>✓ Optimistic updates</li>
                    <li>✓ WebSocket support</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>CRUD Completo</CardTitle>
                  <CardDescription>Operações otimizadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ React Query hooks</li>
                    <li>✓ Infinite scroll</li>
                    <li>✓ Pagination</li>
                    <li>✓ Caching inteligente</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing & Payments</CardTitle>
                  <CardDescription>Stripe integrado</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ 3 planos disponíveis</li>
                    <li>✓ Checkout sessions</li>
                    <li>✓ Webhooks</li>
                    <li>✓ Subscription management</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Production Ready</CardTitle>
                  <CardDescription>Deploy confiável</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ CI/CD com GitHub Actions</li>
                    <li>✓ Monitoring (Sentry)</li>
                    <li>✓ Analytics (Vercel)</li>
                    <li>✓ Health checks</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h3 className="mb-8 text-3xl font-bold">Tecnologias Utilizadas</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary">Next.js 16</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary">Supabase</Badge>
              <Badge variant="secondary">TanStack Query</Badge>
              <Badge variant="secondary">Tailwind CSS</Badge>
              <Badge variant="secondary">shadcn/ui</Badge>
              <Badge variant="secondary">Stripe</Badge>
              <Badge variant="secondary">Vitest</Badge>
              <Badge variant="secondary">Playwright</Badge>
              <Badge variant="secondary">Sentry</Badge>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-blue-600 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h3 className="mb-4 text-4xl font-bold">Pronto para começar?</h3>
            <p className="mb-8 text-xl">Crie sua conta gratuitamente e explore todas as funcionalidades.</p>
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Criar Conta Grátis
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>User Management System - Built with ❤️ following production-ready practices</p>
          <p className="mt-2">Next.js 16 • Supabase • TypeScript • TailwindCSS</p>
        </div>
      </footer>
    </div>
  );
}
