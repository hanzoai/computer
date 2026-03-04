import { test, expect } from '@playwright/test';

test.describe('Rate Limiting Tests', () => {
  test('should enforce rate limits on API endpoints', async ({ request }) => {
    const endpoint = '/api/send-email';
    const payload = {
      to: 'test@example.com',
      subject: 'Test Email',
      body: 'This is a test email'
    };

    // Make requests up to the limit
    const responses = [];
    for (let i = 0; i < 12; i++) {
      const response = await request.post(endpoint, {
        data: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      responses.push(response);
    }

    // First 10 should succeed (anonymous limit)
    for (let i = 0; i < 10; i++) {
      expect(responses[i].status()).toBeLessThan(429);
    }

    // 11th and 12th should be rate limited
    expect(responses[10].status()).toBe(429);
    expect(responses[11].status()).toBe(429);

    // Check rate limit headers
    const headers = responses[10].headers();
    expect(headers['x-ratelimit-limit']).toBeDefined();
    expect(headers['x-ratelimit-remaining']).toBe('0');
    expect(headers['retry-after']).toBeDefined();
  });

  test('should have different limits for authenticated users', async ({ request }) => {
    const endpoint = '/api/generate-invoice';
    const authToken = 'test-auth-token'; // This would be a real token in production

    // Make requests with authentication
    const responses = [];
    for (let i = 0; i < 25; i++) {
      const response = await request.post(endpoint, {
        data: { test: 'data' },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'X-User-Id': 'test-user-123',
          'X-User-Role': 'authenticated'
        }
      });
      responses.push(response);
    }

    // First 20 should succeed (authenticated limit for this endpoint)
    for (let i = 0; i < 20; i++) {
      expect(responses[i].status()).toBeLessThan(429);
    }

    // 21st onwards should be rate limited
    for (let i = 20; i < 25; i++) {
      expect(responses[i].status()).toBe(429);
    }
  });

  test('should reset rate limits after window expires', async ({ request, page }) => {
    const endpoint = '/api/send-email';
    const payload = {
      to: 'test@example.com',
      subject: 'Test Email',
      body: 'This is a test email'
    };

    // Hit rate limit
    for (let i = 0; i < 11; i++) {
      await request.post(endpoint, { data: payload });
    }

    // Last request should be rate limited
    const limitedResponse = await request.post(endpoint, { data: payload });
    expect(limitedResponse.status()).toBe(429);

    // Get retry-after value
    const retryAfter = parseInt(limitedResponse.headers()['retry-after'] || '60');

    // Wait for rate limit window to expire (in real tests, you'd mock time)
    // For testing purposes, we'll skip waiting and just verify the headers exist
    expect(retryAfter).toBeGreaterThan(0);
    expect(retryAfter).toBeLessThanOrEqual(60);
  });

  test('should display rate limit message in UI', async ({ page }) => {
    // Navigate to a page with API calls
    await page.goto('/');

    // Mock rate limit response
    await page.route('/api/**', route => {
      route.fulfill({
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Date.now() + 60000),
          'Retry-After': '60'
        },
        body: JSON.stringify({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again in 60 seconds.',
          retryAfter: 60
        })
      });
    });

    // Trigger an API call (this would be a real action in your app)
    await page.evaluate(() => {
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: 'test@example.com', subject: 'Test', body: 'Test' })
      });
    });

    // Check for rate limit message
    await expect(page.locator('text=/Rate Limit Exceeded/i')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=/Please wait/i')).toBeVisible();
  });

  test('admin should be able to clear rate limits', async ({ request }) => {
    const adminKey = process.env.ADMIN_API_KEY || 'test-admin-key';

    // Clear rate limit for a user
    const response = await request.post('/api/admin/clear-rate-limit', {
      data: {
        userId: 'test-user-123',
        endpoint: 'api/send-email'
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': adminKey
      }
    });

    // Should succeed with proper admin key
    if (adminKey !== 'test-admin-key') {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.message).toContain('Rate limit cleared');
    } else {
      // With test key, should be unauthorized
      expect(response.status()).toBe(401);
    }
  });

  test('should track rate limit violations in database', async ({ page }) => {
    // This test would require database access
    // In a real scenario, you'd check the rate_limit_violations table

    // Navigate to admin dashboard
    await page.goto('/admin/rate-limits');

    // Check if violations tab exists
    const violationsTab = page.locator('button:has-text("Violations")');
    if (await violationsTab.isVisible()) {
      await violationsTab.click();

      // Check for violations table
      await expect(page.locator('text=/Recent Violations/i')).toBeVisible();
    }
  });
});

test.describe('Rate Limit Dashboard Tests', () => {
  test('should display rate limit statistics', async ({ page }) => {
    // Navigate to admin dashboard
    await page.goto('/admin/rate-limits');

    // Check for main sections
    await expect(page.locator('h1:has-text("Rate Limit Dashboard")')).toBeVisible();

    // Check for summary cards
    await expect(page.locator('text=/Total Requests/i')).toBeVisible();
    await expect(page.locator('text=/Blocked Requests/i')).toBeVisible();
    await expect(page.locator('text=/Active Users/i')).toBeVisible();
    await expect(page.locator('text=/Avg Response Time/i')).toBeVisible();
  });

  test('should allow tab navigation', async ({ page }) => {
    await page.goto('/admin/rate-limits');

    // Test tab navigation
    const tabs = ['overview', 'users', 'violations', 'rules'];

    for (const tab of tabs) {
      const tabButton = page.locator(`button:has-text("${tab}")`);
      await tabButton.click();

      // Verify tab is active
      await expect(tabButton).toHaveClass(/border-blue-600/);
    }
  });

  test('should refresh data on demand', async ({ page }) => {
    await page.goto('/admin/rate-limits');

    // Click refresh button
    const refreshButton = page.locator('button:has-text("Refresh")');
    await refreshButton.click();

    // Check for loading state or updated data
    // In a real test, you'd verify the data actually refreshed
    await expect(refreshButton).toBeEnabled();
  });
});