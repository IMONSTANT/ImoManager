"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Users,
  LogOut,
  FileText,
  Home,
  UserCheck,
  UserX,
  Briefcase,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSidebarStore } from "@/store/sidebar-store"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  userEmail?: string
}

export function Sidebar({ className, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const { close } = useSidebarStore()

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Imobiliária",
      icon: Building2,
      href: "/dashboard/imobiliaria",
      active: pathname === "/dashboard/imobiliaria",
    },
  ]

  const imobiliariaRoutes = [
    {
      label: "Imóveis",
      icon: Home,
      href: "/dashboard/imobiliaria/imoveis",
      active: pathname?.startsWith("/dashboard/imobiliaria/imoveis"),
    },
    {
      label: "Contratos",
      icon: FileText,
      href: "/dashboard/imobiliaria/contratos",
      active: pathname?.startsWith("/dashboard/imobiliaria/contratos"),
    },
    {
      label: "Pessoas",
      icon: Users,
      href: "/dashboard/imobiliaria/pessoas",
      active: pathname?.startsWith("/dashboard/imobiliaria/pessoas"),
    },
    {
      label: "Locadores",
      icon: UserCheck,
      href: "/dashboard/imobiliaria/locadores",
      active: pathname?.startsWith("/dashboard/imobiliaria/locadores"),
    },
    {
      label: "Locatários",
      icon: UserX,
      href: "/dashboard/imobiliaria/locatarios",
      active: pathname?.startsWith("/dashboard/imobiliaria/locatarios"),
    },
    {
      label: "Empresas",
      icon: Briefcase,
      href: "/dashboard/imobiliaria/empresas",
      active: pathname?.startsWith("/dashboard/imobiliaria/empresas"),
    },
  ]

  const secondaryRoutes = [
    {
      label: "Soluções",
      icon: FileText,
      href: "/dashboard/solutions",
      active: pathname === "/dashboard/solutions",
    },
    {
      label: "Usuários Sistema",
      icon: Users,
      href: "/dashboard/users",
      active: pathname === "/dashboard/users",
    },
  ]

  return (
    <div className={cn("pb-12 min-h-screen bg-background border-r", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-6 px-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Beeing Rich
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={close}
                className="md:hidden h-8 w-8"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <Separator className="mb-4" />

          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={close}
                className={cn(
                  "flex items-center gap-x-3 text-sm font-medium transition-all px-3 py-3 rounded-lg group",
                  route.active
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <route.icon className={cn(
                  "h-5 w-5",
                  route.active ? "" : "group-hover:scale-110 transition-transform"
                )} />
                <span className="flex-1">{route.label}</span>
              </Link>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="px-3 mb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Gestão Imobiliária
            </p>
          </div>

          <div className="space-y-1">
            {imobiliariaRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={close}
                className={cn(
                  "flex items-center gap-x-3 text-sm font-medium transition-all px-3 py-2 rounded-lg",
                  route.active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50"
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-1">
            {secondaryRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={close}
                className={cn(
                  "flex items-center gap-x-3 text-sm font-medium transition-all px-3 py-2.5 rounded-lg",
                  route.active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50"
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </div>
        </div>

        <Separator />

        <div className="px-3 py-2">
          <div className="px-3 py-3 text-sm bg-muted rounded-lg mb-3">
            <p className="text-xs text-muted-foreground mb-1">Conectado como</p>
            <p className="font-medium truncate">{userEmail}</p>
          </div>
          <form action="/api/auth/signout" method="post">
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
