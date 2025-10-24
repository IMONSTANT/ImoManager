'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Dados considerados frescos por 30 segundos (boa performance sem perder atualização)
        staleTime: 30 * 1000,
        // Mantém dados no cache por 5 minutos após não serem mais usados
        gcTime: 5 * 60 * 1000,
        // Não refetch ao focar na janela (melhora UX)
        refetchOnWindowFocus: false,
        // Retry apenas 1 vez em caso de erro
        retry: 1,
        // Não refetch ao reconectar (evita requests desnecessários)
        refetchOnReconnect: false,
      },
      mutations: {
        // Retry apenas 1 vez para mutations
        retry: 1,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
