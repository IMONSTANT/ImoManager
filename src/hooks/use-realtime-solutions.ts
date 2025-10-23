'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeSolutions(organizationId: string) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  useEffect(() => {
    if (!organizationId) return

    const channel = supabase
      .channel(`solutions:${organizationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'solutions',
          filter: `organization_id=eq.${organizationId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['solutions', organizationId] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [organizationId, queryClient, supabase])
}
