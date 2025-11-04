import { test, expect } from '@playwright/test'

test.describe('Portfolio Flow', () => {
  test('filter + lightbox flow', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const portfolioSection = page.locator('#portfolio')
    await portfolioSection.scrollIntoViewIfNeeded()
    await expect(portfolioSection).toBeVisible()

    const bannersFilter = page.getByTestId('portfolio-filter-banners')
    await bannersFilter.waitFor({ state: 'visible' })
    await bannersFilter.click()

    const items = page.getByTestId(/portfolio-item-/)
    await expect(items).not.toHaveCount(0)

    await items.first().click()
    await expect(page.getByTestId('lightbox-stage')).toBeVisible()

    await page.getByTestId('lightbox-next').click()
    await page.keyboard.press('Escape')
    await expect(page.getByTestId('lightbox-stage')).toBeHidden()
  })
})
