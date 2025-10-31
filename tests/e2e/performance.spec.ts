import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
    console.log(`Page loaded in ${loadTime}ms`);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Measure Largest Contentful Paint (LCP)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        
        setTimeout(() => resolve(0), 5000);
      });
    });
    
    console.log(`LCP: ${lcp}ms`);
    
    // LCP should be under 2.5 seconds (2500ms)
    expect(Number(lcp)).toBeLessThan(2500);
  });

  test('should lazy load images', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to portfolio section
    const portfolioSection = page.locator('#portfolio');
    await portfolioSection.scrollIntoViewIfNeeded();
    
    // Wait for images to start loading
    await page.waitForTimeout(1000);
    
    const images = page.locator('img[loading="lazy"]');
    const count = await images.count();
    
    console.log(`Found ${count} lazy-loaded images`);
    expect(count).toBeGreaterThan(0);
  });

  test('should have optimized bundle size', async ({ page }) => {
    const response = await page.goto('/');
    
    // Get all JavaScript files
    const jsRequests: any[] = [];
    page.on('response', (response) => {
      if (response.url().endsWith('.js')) {
        jsRequests.push(response);
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    console.log(`Total JS files loaded: ${jsRequests.length}`);
    
    // Should have code splitting (multiple JS files)
    expect(jsRequests.length).toBeGreaterThan(1);
  });

  test('should cache static assets', async ({ page }) => {
    // First visit
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const cachedRequests: string[] = [];
    
    // Second visit - check for cached resources
    page.on('response', (response) => {
      if (response.fromCache()) {
        cachedRequests.push(response.url());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    console.log(`Cached resources: ${cachedRequests.length}`);
    
    // Some resources should be cached
    expect(cachedRequests.length).toBeGreaterThan(0);
  });

  test('should use WebP images', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const images = await page.locator('img').all();
    const imageSrcs = await Promise.all(
      images.map(img => img.getAttribute('src'))
    );
    
    const webpImages = imageSrcs.filter(src => src?.includes('.webp') || src?.includes('fm=webp'));
    
    console.log(`WebP images: ${webpImages.length}/${imageSrcs.length}`);
    
    // At least some images should be WebP
    expect(webpImages.length).toBeGreaterThan(0);
  });
});
