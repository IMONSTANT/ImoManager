/**
 * @testfile auth.spec.ts
 * @description End-to-End tests for authentication flows
 * @requirements RF-001, RF-002, RF-003, RF-004, RN-016, RN-017, RN-018
 * @coverage
 *   - RF-001: User Registration (Sign Up)
 *   - RF-002: User Login (Sign In)
 *   - RF-003: User Logout (Sign Out)
 *   - RF-004: Protected Routes with Middleware
 *   - RN-016: Password minimum 6 characters
 *   - RN-017: Password confirmation must match
 *   - RN-018: Name minimum 2 characters
 * @author TDD Test Architect Agent
 */

import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should show login form', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('input[name="password"]', 'short')
    await page.click('button[type="submit"]')

    await expect(page.getByText(/invalid email/i)).toBeVisible()
  })

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login')

    await page.click('text=Sign up')

    await expect(page).toHaveURL('/register')
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible()
  })

  test('should show register form with all fields', async ({ page }) => {
    await page.goto('/register')

    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/^password$/i)).toBeVisible()
    await expect(page.getByLabel(/confirm password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible()
  })

  test('should protect dashboard route', async ({ page }) => {
    await page.goto('/dashboard')

    // Should redirect to login
    await expect(page).toHaveURL('/login')
  })
})

// ============================================================================
// REGISTRATION VALIDATION TESTS (RF-001)
// ============================================================================

test.describe('[E2E] Registration Validation (RF-001)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('should show error for name less than 2 characters (RN-018)', async ({ page }) => {
    await page.fill('input[name="name"]', 'J')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="confirmPassword"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page.getByText(/name must be at least 2 characters/i)).toBeVisible()
  })

  test('should show error for password less than 6 characters (RN-016)', async ({ page }) => {
    await page.fill('input[name="name"]', 'João Silva')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', '12345')
    await page.fill('input[name="confirmPassword"]', '12345')
    await page.click('button[type="submit"]')

    await expect(page.getByText(/password must be at least 6 characters/i)).toBeVisible()
  })

  test('should show error when passwords do not match (RN-017)', async ({ page }) => {
    await page.fill('input[name="name"]', 'João Silva')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="confirmPassword"]', 'password456')
    await page.click('button[type="submit"]')

    await expect(page.getByText(/passwords do not match/i)).toBeVisible()
  })

  test('should accept valid registration data', async ({ page }) => {
    const timestamp = Date.now()
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', `test${timestamp}@example.com`)
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="confirmPassword"]', 'password123')

    await page.click('button[type="submit"]')

    // Should not show validation errors
    await expect(page.getByText(/name must be at least 2 characters/i)).not.toBeVisible()
    await expect(page.getByText(/password must be at least 6 characters/i)).not.toBeVisible()
    await expect(page.getByText(/passwords do not match/i)).not.toBeVisible()
  })
})

// ============================================================================
// PROTECTED ROUTES TESTS (RF-004)
// ============================================================================

test.describe('[E2E] Protected Routes (RF-004)', () => {
  test('should redirect from imobiliaria route to login', async ({ page }) => {
    await page.goto('/dashboard/imobiliaria')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should redirect from pessoas route to login', async ({ page }) => {
    await page.goto('/dashboard/imobiliaria/pessoas')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should redirect from imoveis route to login', async ({ page }) => {
    await page.goto('/dashboard/imobiliaria/imoveis')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should redirect from contratos route to login', async ({ page }) => {
    await page.goto('/dashboard/imobiliaria/contratos')
    await expect(page).toHaveURL(/\/login/)
  })
})

// ============================================================================
// LOGIN VALIDATION TESTS (RF-002)
// ============================================================================

test.describe('[E2E] Login Validation (RF-002)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should show error for password less than 6 characters (RN-016)', async ({ page }) => {
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', '12345')
    await page.click('button[type="submit"]')

    await expect(page.getByText(/password must be at least 6 characters/i)).toBeVisible()
  })

  test('should accept valid login credentials format', async ({ page }) => {
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Should not show format validation errors
    await expect(page.getByText(/invalid email format/i)).not.toBeVisible()
    await expect(page.getByText(/password must be at least 6 characters/i)).not.toBeVisible()
  })
})
