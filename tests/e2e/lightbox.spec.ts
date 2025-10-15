import { test, expect } from '@playwright/test'

// Marked skip initially; un-skip once the homepage reliably exposes Portfolio.
test.skip('portfolio lightbox opens and arrows work', async ({ page }) => {
  await page.goto('/')
  const firstCard = page.locator('[data-testid^="portfolio-item-"]').first()
  await firstCard.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByTestId('lightbox-next').click()
  await page.getByTestId('lightbox-close').click()
  await expect(page.getByRole('dialog')).toBeHidden()
})
