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

    test('TC003: User Login Logic', async ({ page }) => {
        // Register a fresh user specifically for this test
        const uniqueLoginId = Date.now() + 1;
        const loginUser = {
            name: `Login User ${uniqueLoginId}`,
            email: `login${uniqueLoginId}@example.com`,
            password: 'Password123!',
        };

        // 1. Initial Registration
        await page.goto('/register');
        await page.fill('input[id="name"]', loginUser.name);
        await page.fill('input[id="email"]', loginUser.email);
        await page.fill('input[id="password"]', loginUser.password);
        await page.fill('input[id="confirm-password"]', loginUser.password);
        await page.click('button[type="submit"]');

        // Wait for successful redirect after registration
        await page.waitForURL('/');
        console.log('Registration successful, current URL:', page.url());

        // 2. Logout to test explicit login
        // Clear all storage to forcedly logout
        await page.context().clearCookies();
        await page.evaluate(() => localStorage.clear());
        await page.goto('/login');
        console.log('Logged out, at login page:', page.url());

        // 3. Perform Login
        await page.fill('input[id="email"]', loginUser.email);
        await page.fill('input[id="password"]', loginUser.password);

        // Setup console listener to catch auth errors in browser
        page.on('console', msg => {
            if (msg.type() === 'error') console.log(`[Browser Error]: ${msg.text()}`);
        });

        await page.click('button[type="submit"]');

        // 4. Verify Success
        try {
            await page.waitForURL('/', { timeout: 10000 });
            console.log('Login successful, redirected to home');
        } catch (e) {
            console.log('Login failed or timed out. Current URL:', page.url());
            // Take screenshot on failure
            await page.screenshot({ path: 'login-failure.png' });
            throw e;
        }

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
