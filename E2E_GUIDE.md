# E2E Testing Guide

## Philosophy
E2E tests are the primary correctness signal for visible UI behavior. We prioritize reliability, documentability, and visual consistency.

### Zero-Pixel Tolerance
We use a zero-pixel tolerance for visual snapshots. Any deviation in the rendered UI, no matter how small, is considered a failure unless it is explicitly accepted by updating the baseline snapshots. This ensures that UI regressions are caught immediately.

## Conventions
- **Playwright**: We use Playwright for all E2E tests.
- **Numbered Scenarios**: Tests are organized into numbered folders in `tests/e2e/`.
- **Unified Step Pattern**: Use the `TestStepHelper` class to ensure every step is documented with a screenshot and the UI is stabilized before snapshots are taken.

## TestStepHelper
The `TestStepHelper` class provides a structured way to write tests:
- **Automatic Numbering**: Steps are numbered sequentially.
- **Stabilization**: Each step automatically waits for network idleness and image loading before taking a screenshot.
- **Automated Documentation**: A `README.md` is generated for each scenario, showing the steps and corresponding screenshots.

### Usage Example
```typescript
test('example scenario', async ({ page }, testInfo) => {
  const helper = new TestStepHelper(page, testInfo);
  
  await helper.step('Navigate to page', async () => {
    await page.goto('/target');
  });

  await helper.step('Perform action', async () => {
    await page.click('button#action');
  });

  await helper.finish();
});
```

## Folder Structure
```text
tests/e2e/
├── helpers/
│   └── test-step-helper.ts
└── 001-homepage/
    ├── 001-homepage.spec.ts
    ├── README.md
    └── screenshots/
        └── 000-navigate-to-homepage.png
        └── 001-perform-action.png
```

## Running Tests
- `bun run test:e2e`: Run all tests.
- `bun run test:e2e:update-snapshots`: Run tests and update visual baselines and scenario READMEs.
