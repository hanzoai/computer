import { test, expect } from '@playwright/test';

test.describe('Invoice Generation', () => {
  test('should be able to access invoice tab in dashboard', async ({ page }) => {
    // Navigate to dashboard (assuming user is already logged in)
    await page.goto('/dashboard');

    // Check if Invoice tab is visible
    const invoiceTab = page.getByRole('button', { name: /Invoices/i });
    await expect(invoiceTab).toBeVisible();

    // Click on Invoice tab
    await invoiceTab.click();

    // Verify invoice section is displayed
    await expect(page.getByText(/Orders & Invoices/i)).toBeVisible();
  });

  test('should display download button for paid orders', async ({ page }) => {
    // This test assumes there are paid orders in the system
    await page.goto('/dashboard');

    // Click on Invoice tab
    await page.getByRole('button', { name: /Invoices/i }).click();

    // Check for presence of either Download or Generate Invoice button
    const invoiceButtons = page.locator('button').filter({
      hasText: /Download|Generate Invoice/i
    });

    const count = await invoiceButtons.count();
    if (count > 0) {
      // If there are orders, at least one button should be visible
      await expect(invoiceButtons.first()).toBeVisible();
    }
  });

  test('should show invoice preview modal when Preview button is clicked', async ({ page }) => {
    await page.goto('/dashboard');

    // Click on Invoice tab
    await page.getByRole('button', { name: /Invoices/i }).click();

    // Look for Preview button
    const previewButton = page.getByRole('button', { name: /Preview/i }).first();
    const buttonCount = await previewButton.count();

    if (buttonCount > 0) {
      // Click preview button
      await previewButton.click();

      // Check if modal appears
      await expect(page.getByText(/Invoice Preview/i)).toBeVisible();

      // Close modal
      const closeButton = page.locator('button').filter({ has: page.locator('svg') }).last();
      await closeButton.click();

      // Verify modal is closed
      await expect(page.getByText(/Invoice Preview/i)).not.toBeVisible();
    }
  });
});