import { test, expect } from '@playwright/test'

// These tests target pages and routes that do not yet exist.
// They will fail RED until Plans 01 and 02 create the /get-started page and
// the homepage CTA button that links to it.

test.describe('Onboarding flow', () => {
  // ONBRD-01: Homepage CTA navigates to the onboarding form
  test('homepage Get Started button navigates to /get-started', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Click the primary "Get Started" CTA on the homepage
    await page.getByRole('link', { name: /get started/i }).first().click()

    await expect(page).toHaveURL(/\/get-started/)
  })

  // ONBRD-01: The /get-started route renders the onboarding form
  test('/get-started page renders the onboarding form', async ({ page }) => {
    await page.goto('http://localhost:3000/get-started')

    // The multi-step form should be visible — look for a heading or form element
    const form = page.locator('form')
    await expect(form).toBeVisible()
  })
})

test.describe('Mobile responsiveness', () => {
  // ONBRD-10: Form is usable on a small mobile viewport
  test('form is usable at 375px viewport width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }) // iPhone SE
    await page.goto('http://localhost:3000/get-started')

    // The form should be visible without requiring horizontal scroll
    const form = page.locator('form')
    await expect(form).toBeVisible()

    // Confirm no horizontal overflow — body scroll width should not exceed viewport
    const overflow = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth
    })
    expect(overflow).toBe(false)
  })
})
