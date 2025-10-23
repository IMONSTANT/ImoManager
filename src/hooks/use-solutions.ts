'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

type Solution = Database['public']['Tables']['solutions']['Row']
type CreateSolutionInput = Database['public']['Tables']['solutions']['Insert']
type UpdateSolutionInput = Database['public']['Tables']['solutions']['Update']

type TypedSupabaseClient = SupabaseClient<Database>

export function useSolutions(organizationId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['solutions', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('solutions')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!organizationId
  })
}

export function useCreateSolution() {
  const queryClient = useQueryClient()
  const supabase: TypedSupabaseClient = createClient()

  return useMutation({
    mutationFn: async (input: CreateSolutionInput) => {
      const { data, error } = await (supabase.from('solutions') as any)
        .insert(input)
        .select()
        .single()

      if (error) throw error
      return data as Solution
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solutions', data.organization_id] })
    }
  })
}

export function useUpdateSolution() {
  const queryClient = useQueryClient()
  const supabase: TypedSupabaseClient = createClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateSolutionInput & { id: string }) => {
      const { data, error } = await (supabase.from('solutions') as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Solution
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solutions'] })
      queryClient.invalidateQueries({ queryKey: ['solution', data.id] })
    }
  })
}

export function useDeleteSolution() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('solutions')
        .delete()
        .eq('id', id)

      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solutions'] })
    }
  })
}
