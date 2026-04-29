import { test, expect } from '@playwright/test';
import { TestStepHelper } from '../helpers/test-step-helper';

test('homepage loads correctly', async ({ page }, testInfo) => {
  const helper = new TestStepHelper(page, testInfo);

  await helper.step('Navigate to homepage', async () => {
    await page.goto('/');
  });

  await helper.step('Check title and heading', async () => {
    await expect(page).toHaveTitle(/Raven/);
    await expect(page.getByRole('heading', { name: 'Raven' })).toBeVisible();
  });

  await helper.finish();
});
