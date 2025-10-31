import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Homepage E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/PrintPerfect|Paras Graphics/i);
  });

  test('should display header navigation', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /services/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /portfolio/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /contact/i })).toBeVisible();
  });

  test('should display hero section', async ({ page }) => {
    const hero = page.locator('[data-testid="hero-section"], section').first();
    await expect(hero).toBeVisible();
    
    // Check for CTA buttons
    const uploadButton = page.getByRole('button', { name: /upload file/i });
    const whatsappButton = page.getByRole('link', { name: /whatsapp/i });
    
    await expect(uploadButton.or(whatsappButton)).toBeVisible();
  });

  test('should display services grid', async ({ page }) => {
    const servicesSection = page.locator('#services, [data-testid="services-section"]');
    await expect(servicesSection).toBeVisible();
    
    // Wait for services to load
    await page.waitForSelector('[data-testid^="service-card"]', { timeout: 10000 });
    
    const serviceCards = page.locator('[data-testid^="service-card"]');
    const count = await serviceCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display portfolio section', async ({ page }) => {
    const portfolioSection = page.locator('#portfolio, [data-testid="portfolio-section"]');
    await expect(portfolioSection).toBeVisible();
    
    // Wait for portfolio items
    await page.waitForSelector('[data-testid^="portfolio-item"]', { timeout: 10000 });
    
    const portfolioItems = page.locator('[data-testid^="portfolio-item"]');
    const count = await portfolioItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate using scroll', async ({ page }) => {
    // Scroll to services
    await page.locator('#services').scrollIntoViewIfNeeded();
    await expect(page.locator('#services')).toBeInViewport();
    
    // Scroll to portfolio
    await page.locator('#portfolio').scrollIntoViewIfNeeded();
    await expect(page.locator('#portfolio')).toBeInViewport();
    
    // Scroll to contact
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('#contact')).toBeInViewport();
  });

  test('should have no accessibility violations', async ({ page }) => {
    await checkA11y(page);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check mobile menu exists (if implemented)
    const mobileMenuButton = page.locator('[aria-label*="menu"], button[class*="mobile"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      // Menu should be visible after click
    }
  });

  test('should load all critical resources', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Check for critical CSS
    const styles = await page.locator('link[rel="stylesheet"], style').count();
    expect(styles).toBeGreaterThan(0);
    
    // Check for JavaScript
    const scripts = await page.locator('script').count();
    expect(scripts).toBeGreaterThan(0);
  });
});
