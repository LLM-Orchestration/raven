# E2E Testing Guide

This project follows a strict E2E testing standard to ensure visual consistency, determinism, and high-quality documentation.

## Core Principles

### 1. Zero-Pixel Tolerance
We use software rendering to ensure that screenshots are identical across all environments (local, CI, etc.). Any pixel difference is considered a failure.

### 2. Determinism
Tests must be deterministic. We use fixed-size viewports, disable animations where possible, and wait for UI stabilization before taking screenshots.

### 3. Unified Step Pattern
All test steps must follow a unified pattern:
- **Action**: Perform the UI action.
- **Stabilization**: Wait for network idle, images to load, and animations to finish (max 2000ms).
- **Verification**: Execute assertions to verify the state.
- **Documentation**: A numbered screenshot is automatically taken and added to the scenario's README.md.

### 4. 2000ms Timeout Rule
All stabilization waits (network, images, animations) must have a maximum timeout of 2000ms. This prevents tests from hanging and ensures fast feedback.

## Usage

### Test Structure

Each E2E test should be located in its own directory under `tests/e2e/`, named with a three-digit prefix (e.g., `tests/e2e/001-homepage/`).

### Writing a Test

Use the `TestStepHelper` to manage steps and documentation.

```typescript
import { test, expect } from '@playwright/test';
import { TestStepHelper } from '../helpers/test-step-helper';

test('scenario title', async ({ page }, testInfo) => {
  const helper = new TestStepHelper(page, testInfo);
  helper.setMetadata('Feature Name', 'User Story Description');

  await helper.step({
    description: 'Navigate to page',
    action: async () => {
      await page.goto('/');
    },
    verifications: [
      {
        spec: 'The page title should contain "Expected Title"',
        check: async () => {
          await expect(page).toHaveTitle(/Expected Title/);
        }
      }
    ]
  });

  await helper.step({
    description: 'Click a button',
    action: async () => {
      await page.getByRole('button', { name: 'Click Me' }).click();
    },
    verifications: [
      {
        spec: 'The success message should be visible',
        check: async () => {
          await expect(page.getByText('Success')).toBeVisible();
        }
      }
    ]
  });

  await helper.generateDocs();
});
```

### Running Tests

```bash
npm run test:e2e
```

This will run the tests and update the `README.md` and screenshots in each scenario directory.
