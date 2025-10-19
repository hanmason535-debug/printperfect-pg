import { test, expect } from '@playwright/test'

test.describe('Services Flow', () => {
  test('services render and clicking a service opens WhatsApp', async ({ page, context }) => {
    await page.goto('/')

    // Find the services grid
    const servicesGrid = page.locator('#services')
    await servicesGrid.scrollIntoViewIfNeeded()
    await expect(servicesGrid).toBeVisible()

    const serviceCards = servicesGrid.locator('[data-testid^="services-card-"]')
    await expect(serviceCards.first()).toBeVisible()

    // Clicking the first service card should open a new page
    const [newPage] = await Promise.all([context.waitForEvent('page'), serviceCards.first().click()])

    await newPage.waitForLoadState('domcontentloaded')
    await expect(newPage).toHaveURL(/(wa\.me|api\.whatsapp\.com)/)
  })
})
