import { test, expect } from '@playwright/test';
import { TestStepHelper } from '../helpers/test-step-helper';

test('homepage loads correctly', async ({ page }, testInfo) => {
  const helper = new TestStepHelper(page, testInfo);
  helper.setMetadata('Homepage', 'As a user, I want to see the homepage to understand what Raven is.');

  await helper.step({
    description: 'Navigate to homepage',
    action: async () => {
      await page.goto('/');
    },
    verifications: [
      {
        spec: 'The page title should contain "Raven"',
        check: async () => {
          await expect(page).toHaveTitle(/Raven/);
        }
      }
    ]
  });

  await helper.step({
    description: 'Check heading',
    action: async () => {
      // No specific action needed, just checking visibility
    },
    verifications: [
      {
        spec: 'The "Raven" heading should be visible',
        check: async () => {
          await expect(page.getByRole('heading', { name: 'Raven' })).toBeVisible();
        }
      }
    ]
  });

  await helper.generateDocs();
});
