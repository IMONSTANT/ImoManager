# Environment Variables Setup Guide

## Overview

This application validates all required environment variables at startup to ensure everything is configured correctly before running.

## Quick Setup

1. **Copy the example file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your credentials** in `.env.local`

3. **Restart the development server**:
   ```bash
   npm run dev
   ```

## Required Variables

### Supabase (Required)

These are **mandatory** for the application to run:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**How to get these:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select existing
3. Go to Project Settings > API
4. Copy the values:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### App Configuration (Optional)

```env
NEXT_PUBLIC_URL=http://localhost:3000
```

Defaults to `http://localhost:3000` if not set.

### Stripe (Optional - for billing features)

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
```

**Note**: Billing features will be disabled if not configured.

### Sentry (Optional - for error monitoring)

```env
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

### Upstash Redis (Optional - for rate limiting)

```env
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

## Validation

The application will:

1. ✅ **Validate on startup** - Check all environment variables
2. ❌ **Fail fast** - Stop if required variables are missing
3. 📝 **Show helpful errors** - Tell you exactly what's missing
4. 🔒 **Type-safe** - All variables are validated with Zod

## Error Messages

If you see an error like:

```
❌ Invalid environment variables:

  - NEXT_PUBLIC_SUPABASE_URL: Required
  - NEXT_PUBLIC_SUPABASE_ANON_KEY: NEXT_PUBLIC_SUPABASE_ANON_KEY is required

📝 Please check your .env.local file and ensure all required variables are set.
📄 See .env.example for reference.
```

This means you need to:
1. Check your `.env.local` file exists
2. Ensure all required variables are filled in
3. Restart your dev server

## Testing

To verify your environment is configured correctly:

```bash
# This will validate and show any errors
npm run dev
```

If successful, you'll see:
```
✓ Ready in 2.3s
○ Local:        http://localhost:3000
```

## Security Notes

- ⚠️ **Never commit** `.env.local` to git
- ✅ `.env.example` is safe to commit (no secrets)
- 🔒 Service role keys should **only** be used server-side
- 🌐 Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser

## Troubleshooting

### "Module not found: Can't resolve '@/lib/env'"

Run: `npm install` to ensure all dependencies are installed.

### "Environment validation failed"

Check the console output - it will tell you exactly which variables are missing or invalid.

### Variables not loading

1. Restart your dev server
2. Make sure the file is named `.env.local` (not `.env.local.txt`)
3. Check there are no extra spaces around the `=` sign

## Production Deployment

For Vercel deployment:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# ... add all other required variables
```

Then deploy:
```bash
vercel --prod
```
