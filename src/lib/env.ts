import { z } from 'zod'

// Client-side environment variables (available in browser)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_URL is required'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  NEXT_PUBLIC_URL: z.string().optional().default('http://localhost:3000'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
})

// Server-side environment variables (NOT available in browser)
const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRO_PRICE_ID: z.string().optional(),
  STRIPE_ENTERPRISE_PRICE_ID: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

type ClientEnv = z.infer<typeof clientEnvSchema>
type ServerEnv = z.infer<typeof serverEnvSchema>

function validateClientEnv(): ClientEnv {
  try {
    const env = clientEnvSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    })
    return env
  } catch (error) {
    handleValidationError(error, 'client')
    throw error
  }
}

function validateServerEnv(): ServerEnv {
  try {
    const env = serverEnvSchema.parse({
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID,
      STRIPE_ENTERPRISE_PRICE_ID: process.env.STRIPE_ENTERPRISE_PRICE_ID,
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
      NODE_ENV: process.env.NODE_ENV || 'development',
    })
    return env
  } catch (error) {
    handleValidationError(error, 'server')
    throw error
  }
}

function handleValidationError(error: unknown, context: 'client' | 'server') {
  if (error instanceof z.ZodError) {
    const missingVars = error.issues.map(err => {
      return `  - ${err.path.join('.')}: ${err.message}`
    }).join('\n')

    console.error(`\n❌ Invalid ${context} environment variables:\n`)
    console.error(missingVars || 'Unknown validation error')
    console.error('\n📝 Please check your environment variables configuration.')
    console.error('📄 See .env.example for reference.\n')

    // Only throw in development to prevent production from breaking
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`${context} environment validation failed`)
    }
  }
}

// Validate client environment on module load
const clientEnv = validateClientEnv()

// Validate server environment only on server-side
const serverEnv = typeof window === 'undefined' ? validateServerEnv() : ({} as ServerEnv)

// Export client variables (safe for browser)
export const NEXT_PUBLIC_SUPABASE_URL = clientEnv.NEXT_PUBLIC_SUPABASE_URL
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const NEXT_PUBLIC_URL = clientEnv.NEXT_PUBLIC_URL
export const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
export const NEXT_PUBLIC_SENTRY_DSN = clientEnv.NEXT_PUBLIC_SENTRY_DSN

// Export server variables (only available server-side)
export const SUPABASE_SERVICE_ROLE_KEY = serverEnv.SUPABASE_SERVICE_ROLE_KEY!
export const STRIPE_SECRET_KEY = serverEnv.STRIPE_SECRET_KEY
export const STRIPE_WEBHOOK_SECRET = serverEnv.STRIPE_WEBHOOK_SECRET
export const STRIPE_PRO_PRICE_ID = serverEnv.STRIPE_PRO_PRICE_ID
export const STRIPE_ENTERPRISE_PRICE_ID = serverEnv.STRIPE_ENTERPRISE_PRICE_ID
export const UPSTASH_REDIS_REST_URL = serverEnv.UPSTASH_REDIS_REST_URL
export const UPSTASH_REDIS_REST_TOKEN = serverEnv.UPSTASH_REDIS_REST_TOKEN
export const NODE_ENV = serverEnv.NODE_ENV || 'development'
