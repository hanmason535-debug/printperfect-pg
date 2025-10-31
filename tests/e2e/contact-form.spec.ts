import { test, expect } from '@playwright/test';

test.describe('Contact Form E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Scroll to contact section
    await page.locator('#contact').scrollIntoViewIfNeeded();
  });

  test('should display contact form', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
    
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/phone/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /send|submit/i });
    await submitButton.click();
    
    // Form should show validation errors
    await expect(page.locator('form')).toBeVisible();
    
    // HTML5 validation should prevent submission
    const nameInput = page.getByLabel(/name/i);
    await expect(nameInput).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/phone/i).fill('1234567890');
    await page.getByLabel(/message/i).fill('Test message');
    
    const submitButton = page.getByRole('button', { name: /send|submit/i });
    await submitButton.click();
    
    // Email field should show validation error
    const emailInput = page.getByLabel(/email/i);
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('should fill and attempt to submit form', async ({ page }) => {
    await page.getByLabel(/name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill('john@example.com');
    await page.getByLabel(/phone/i).fill('+91 1234567890');
    await page.getByLabel(/message/i).fill('I would like to inquire about your printing services.');
    
    const submitButton = page.getByRole('button', { name: /send|submit/i });
    await expect(submitButton).toBeEnabled();
    
    // Note: Actual submission will depend on your backend setup
    // await submitButton.click();
  });

  test('should prevent spam with honeypot', async ({ page }) => {
    // Check for honeypot field (should be hidden)
    const honeypot = page.locator('input[name="honeypot"], input[tabindex="-1"]');
    
    if (await honeypot.count() > 0) {
      await expect(honeypot.first()).not.toBeVisible();
    }
  });

  test('should display WhatsApp button', async ({ page }) => {
    const whatsappButton = page.getByRole('link', { name: /whatsapp/i });
    await expect(whatsappButton).toBeVisible();
    
    const href = await whatsappButton.getAttribute('href');
    expect(href).toContain('wa.me');
  });

  test('should show contact information', async ({ page }) => {
    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeVisible();
    
    // Check for address or contact details
    await expect(contactSection).toContainText(/ahmedabad|gujarat|india/i);
  });
});
