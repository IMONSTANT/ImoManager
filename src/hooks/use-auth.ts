'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { LoginInput, RegisterInput } from '@/lib/validations/auth'

export function useAuth() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const signIn = async (data: LoginInput) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword(data)
      if (error) throw error
      router.push('/dashboard')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (data: RegisterInput) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { name: data.name },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
      router.push('/verify-email')
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return { signIn, signUp, signOut, loading }
}
