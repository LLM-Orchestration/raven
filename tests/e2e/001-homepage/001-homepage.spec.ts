import { test, expect } from '@playwright/test';
import { testStep } from '../helpers/test-step-helper';

test('homepage loads correctly', async ({ page }) => {
  await testStep(page, 'Navigate to homepage', 'tests/e2e/001-homepage/screenshots/000-initial-load.png', async () => {
    await page.goto('/');
  });

  await testStep(page, 'Check title and heading', 'tests/e2e/001-homepage/screenshots/001-content-check.png', async () => {
    await expect(page).toHaveTitle(/Raven/);
    await expect(page.getByRole('heading', { name: 'Raven' })).toBeVisible();
  });
});
