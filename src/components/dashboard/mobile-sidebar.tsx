"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useSidebarStore } from "@/store/sidebar-store"
import { useEffect } from "react"

interface MobileSidebarProps {
  userEmail?: string
}

export function MobileSidebar({ userEmail }: MobileSidebarProps) {
  const { isOpen, toggle, close } = useSidebarStore()

  // Fecha a sidebar quando a tela aumenta para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        close()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isOpen, close])

  // Previne scroll do body quando sidebar está aberta
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <>
      {/* Header Mobile com botão */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b z-40 flex items-center px-4 shadow-sm">
        <Button
          variant="outline"
          size="icon"
          onClick={toggle}
          className="h-9 w-9 bg-background hover:bg-accent"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="ml-4 flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-white"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h1 className="text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Beeing Rich
          </h1>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 animate-in fade-in"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Mobile */}
      <aside
        className={`
          md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-background border-r
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar userEmail={userEmail} />
      </aside>
    </>
  )
}
