import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '@/lib/env'

export async function GET() {
  try {
    const supabase = createClient(
      NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    )

    // Check database
    const { error: dbError } = await supabase.from('profiles').select('count').limit(1)
    if (dbError) throw new Error('Database unhealthy')

    // Check auth
    const { error: authError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 })
    if (authError) throw new Error('Auth unhealthy')

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'up',
        auth: 'up'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: (error as Error).message },
      { status: 503 }
    )
  }
}
