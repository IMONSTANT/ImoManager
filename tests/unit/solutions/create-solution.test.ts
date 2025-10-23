import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCreateSolution } from '@/hooks/use-solutions'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useCreateSolution', () => {
  it('should create a solution successfully', async () => {
    const { result } = renderHook(() => useCreateSolution(), { wrapper: createWrapper() })

    const newSolution = {
      title: 'Test Solution',
      description: 'Test description',
      category: 'tech',
      organization_id: 'org-123',
      created_by: 'user-123'
    }

    result.current.mutate(newSolution)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('should handle validation errors', async () => {
    const { result } = renderHook(() => useCreateSolution(), { wrapper: createWrapper() })

    result.current.mutate({ title: '' } as any)

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
