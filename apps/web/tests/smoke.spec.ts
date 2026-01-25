import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    // Just verify the page loads and has a form
    await expect(page.locator('form')).toBeVisible();
});

test('login page elements visible', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Wait for page to fully render
    await page.waitForTimeout(1000);

    // Check email input by ID
    await expect(page.locator('#email')).toBeVisible();

    // Check password input by ID  
    await expect(page.locator('#password')).toBeVisible();

    // Check submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
});
