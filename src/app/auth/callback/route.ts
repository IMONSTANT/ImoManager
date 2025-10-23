import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const supabase = await createClient()

    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirect to the page the user was trying to access or dashboard
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // If there's an error, redirect to error page
  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
}
