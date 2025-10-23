"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  Wallet,
  BarChart3,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  userEmail?: string
}

export function Sidebar({ className, userEmail }: SidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Meus Imóveis",
      icon: Building2,
      href: "/dashboard/properties",
      active: pathname === "/dashboard/properties",
      badge: "12",
    },
    {
      label: "Investimentos",
      icon: TrendingUp,
      href: "/dashboard/investments",
      active: pathname === "/dashboard/investments",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/dashboard/analytics",
      active: pathname === "/dashboard/analytics",
    },
    {
      label: "Carteira",
      icon: Wallet,
      href: "/dashboard/portfolio",
      active: pathname === "/dashboard/portfolio",
    },
  ]

  const secondaryRoutes = [
    {
      label: "Usuários",
      icon: Users,
      href: "/dashboard/users",
      active: pathname === "/dashboard/users",
    },
    {
      label: "Configurações",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
  ]

  return (
    <div className={cn("pb-12 min-h-screen bg-card border-r", className)}>
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
            <ThemeToggle />
          </div>
          <Separator className="mb-4" />

          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
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
                {route.badge && (
                  <Badge variant="secondary" className="ml-auto h-5 px-2 text-xs">
                    {route.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-1">
            {secondaryRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
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
          <div className="px-3 py-3 text-sm bg-muted/50 rounded-lg mb-3">
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
