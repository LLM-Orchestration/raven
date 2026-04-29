# E2E Testing Guide

## Philosophy
E2E tests are the primary correctness signal for visible UI behavior. We prioritize reliability and documentability.

## Conventions
- **Playwright**: We use Playwright for all E2E tests.
- **Numbered Scenarios**: Tests are organized into numbered folders in `tests/e2e/`.
- **Step Helper**: Use the `testStep` helper to ensure every step is documented with a screenshot.
- **Zero-pixel Tolerance**: Visual snapshots must match exactly.
- **Deterministic**: Tests must not rely on arbitrary timeouts. Use Playwright's built-in waiting mechanisms.

## Folder Structure
```text
tests/e2e/
├── helpers/
│   └── test-step-helper.ts
└── 001-homepage/
    ├── 001-homepage.spec.ts
    ├── README.md
    └── screenshots/
        └── ...
```

## Running Tests
- `bun run test:e2e`: Run all tests.
- `bun run test:e2e:update-snapshots`: Run tests and update visual baselines.
