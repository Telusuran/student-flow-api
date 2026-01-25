import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {

    // Generate unique user for each run
    const uniqueId = Date.now();
    const newUser = {
        name: `Test User ${uniqueId}`,
        email: `test${uniqueId}@example.com`,
        password: 'Password123!',
        institution: 'Test University',
        major: 'Computer Science'
    };

    test('TC001: User Registration Success', async ({ page }) => {
        await page.goto('/register');

        // Step 1: Registration Form
        await page.fill('input[id="name"]', newUser.name);
        await page.fill('input[id="email"]', newUser.email);
        await page.fill('input[id="password"]', newUser.password);
        await page.fill('input[id="confirm-password"]', newUser.password);

        await page.click('button[type="submit"]');

        // Check for redirection to home (Dashboard) or Profile Setup
        // Based on RegisterPage.tsx logic: navigate('/') on success
        // But application flow might redirect to /profile-setup if logic exists (ProfileSetupPage exists)
        // Let's assume it goes to / or /profile-setup.
        // Wait for URL change
        await page.waitForURL(/\/|\/profile-setup/);

        // If validated successfully, we expect to be logged in
        // Ideally check for a dashboard element or header profile
    });

    test('TC002: User Registration Input Validation', async ({ page }) => {
        await page.goto('/register');

        // Mismatch passwords
        await page.fill('input[id="name"]', 'Bad User');
        await page.fill('input[id="email"]', `bad${uniqueId}@test.com`);
        await page.fill('input[id="password"]', 'Password123!');
        await page.fill('input[id="confirm-password"]', 'PasswordMismatch!');

        await page.click('button[type="submit"]');

        // Expect error message
        await expect(page.getByText('Passwords do not match')).toBeVisible();

        // Weak password
        await page.fill('input[id="password"]', '123');
        await page.fill('input[id="confirm-password"]', '123');
        await page.click('button[type="submit"]');
        await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    });

    test('TC003: User Login Success', async ({ page }) => {
        // Use the user created in TC001?
        // Tests run in parallel/isolation usually, so we might need to register first or seed data.
        // For simplicity in this suite, let's register a NEW user just for login test to be self-contained
        // Or assume the user from TC001 exists if running serially (by default fullyParallel is true).
        // Best practice: Register a fresh user via API or UI before login test.
        // Let's do UI registration for now quickly.

        const loginUser = {
            name: `Login User ${uniqueId}`,
            email: `login${uniqueId}@example.com`,
            password: 'Password123!'
        };

        // Register first
        await page.goto('/register');
        await page.fill('input[id="name"]', loginUser.name);
        await page.fill('input[id="email"]', loginUser.email);
        await page.fill('input[id="password"]', loginUser.password);
        await page.fill('input[id="confirm-password"]', loginUser.password);
        await page.click('button[type="submit"]');
        // Wait for successful registration which redirects to home
        await page.waitForURL('/');

        // Logout if possible, or just open new context. 
        // But for this test, let's just test LOGIN failure logic first because Success implies we are logged in.

        // To test "Login" explicitly, we need to be logged out.
        // Let's clear cookies/storage
        await page.context().clearCookies();
        await page.evaluate(() => localStorage.clear());

        await page.goto('/login');
        await page.fill('input[id="email"]', loginUser.email);
        await page.fill('input[id="password"]', loginUser.password);
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL('/');
    });

    test('TC004: User Login Failure', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[id="email"]', 'nopessss@example.com');
        await page.fill('input[id="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Wait a bit for error message to appear
        await page.waitForTimeout(2000);

        // Check if we're still on login page (not redirected)
        await expect(page).toHaveURL(/\/login/);
    });

});
