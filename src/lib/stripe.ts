import Stripe from 'stripe'
import { STRIPE_SECRET_KEY, STRIPE_PRO_PRICE_ID, STRIPE_ENTERPRISE_PRICE_ID } from '@/lib/env'

// Only initialize Stripe if secret key is available
export const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
      typescript: true
    })
  : null

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: ['5 solutions', 'Basic templates', 'Community support']
  },
  pro: {
    name: 'Pro',
    price: 29,
    priceId: STRIPE_PRO_PRICE_ID || '',
    features: ['Unlimited solutions', 'All templates', 'Priority support', 'API access']
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    priceId: STRIPE_ENTERPRISE_PRICE_ID || '',
    features: ['Everything in Pro', 'Custom integrations', 'Dedicated support', 'SLA']
  }
}
