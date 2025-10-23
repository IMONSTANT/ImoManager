import { test, expect } from '@playwright/test'

test.describe('Solutions CRUD', () => {
  test('should navigate to solutions page', async ({ page }) => {
    await page.goto('/dashboard/solutions')

    await expect(page.getByRole('heading', { name: /solutions/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /new solution/i })).toBeVisible()
  })

  test('should open create solution dialog', async ({ page }) => {
    await page.goto('/dashboard/solutions')

    await page.click('button:has-text("New Solution")')

    await expect(page.getByRole('heading', { name: /create new solution/i })).toBeVisible()
    await expect(page.getByLabel(/title/i)).toBeVisible()
    await expect(page.getByLabel(/description/i)).toBeVisible()
    await expect(page.getByLabel(/category/i)).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('/dashboard/solutions')

    await page.click('button:has-text("New Solution")')
    await page.click('button[type="submit"]')

    await expect(page.getByText(/title.*required/i)).toBeVisible()
    await expect(page.getByText(/category.*required/i)).toBeVisible()
  })

  test('should close dialog on cancel', async ({ page }) => {
    await page.goto('/dashboard/solutions')

    await page.click('button:has-text("New Solution")')
    await expect(page.getByRole('heading', { name: /create new solution/i })).toBeVisible()

    await page.click('button:has-text("Cancel")')
    await expect(page.getByRole('heading', { name: /create new solution/i })).not.toBeVisible()
  })
})
