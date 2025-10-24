import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll, expect } from 'vitest'
import { server } from './mocks/server'
import * as matchers from '@testing-library/jest-dom/matchers'

// Setup environment variables for tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123'
process.env.STRIPE_SECRET_KEY = 'sk_test_123'
process.env.NEXT_PUBLIC_URL = 'http://localhost:3000'

// =====================================================
// POLYFILLS para Radix UI e testes
// =====================================================

// PointerCapture API (necessário para Radix UI Select/Popover)
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = function() { return false }
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = function() {}
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = function() {}
}

// scrollIntoView API (necessário para Radix UI Select navegação)
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function() {}
}

// ResizeObserver API (necessário para alguns componentes Radix UI)
if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

// IntersectionObserver API
if (typeof global.IntersectionObserver === 'undefined') {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any
}

// matchMedia (para componentes responsivos)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
})

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// MSW Setup
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => {
  server.resetHandlers()
  cleanup()
})
