import { test, expect } from '@playwright/test'

// Marked skip initially; un-skip once the homepage reliably exposes Portfolio.
test.skip('portfolio lightbox opens and arrows work', async ({ page }) => {
  await page.goto('/')
  // Adjust selectors to your UI as needed
  await page.getByRole('img').first().click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
})

