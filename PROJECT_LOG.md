# Project Log: Raven

## 2026-04-29: Initial Scaffolding

### User Prompt
Let's scaffold the project following a checklist almost like we're writing a PWA game. For Raven, we won't need firebase at all, we need everything to be backed by github. Here's a starting checklist for the scaffolding:

## Default Project Shape

- Create the project folder in the requested location before installing or scaffolding anything.
- Start `PROJECT_LOG.md` immediately.
- Record every user prompt verbatim in the log.
- Keep setup notes and lessons learned in the same log so later sessions can turn them into reusable skills.
- Add `AGENTS.md` early with the repository workflow conventions.
- Use pull requests for repository changes by default.
- Use short-lived `codex/` branches for Codex-authored work.

## Reproducible Tooling

- Use a Nix flake for the development environment.
- Put `bun`, `gh`, and `git` in the default dev shell.
- Use Bun for `package.json`, dependency installation, scripts, and `node_modules`.
- Run project commands through `nix develop` so tool versions remain reproducible.
- Commit both `flake.nix` and `flake.lock`.
- Commit `bun.lock` after dependency installation.

Initial verified versions for Studio City were:

- Nix: Determinate Nix 3.18.1 / Nix 2.33.4
- Bun: 1.3.3
- GitHub CLI: gh 2.83.2 from nixpkgs
- Git: 2.51.2

## macOS Setup Notes

- Hidden Codex tool sessions cannot show `sudo` password prompts to the user.
- For password-requiring setup, create a visible `.command` file and open it in Terminal.
- GitHub CLI browser authentication may also need to run in a visible Terminal window if interactive prompts do not render cleanly in Codex.
- New Codex shell sessions may need:

```sh
source /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh
```

## GitHub Repository Setup

- Create the GitHub repository with `gh`.
- Make the repository public when GitHub Pages is required.
- Public Pages hosting for Studio City uses:

```text
https://s2alexan.github.io/studiocity/
```

- Enable GitHub Pages from the `gh-pages` branch root.
- If the Pages REST API rejects form-encoded nested input, send JSON:

```sh
printf '%s' '{"source":{"branch":"gh-pages","path":"/"}}' \
  | gh api repos/OWNER/REPO/pages -X POST --input -
```

- Verify Pages configuration with:

```sh
gh api repos/OWNER/REPO/pages
```

## Documentation Baseline

Every new project should start with:

- `README.md`: concise project summary, current rules/product behavior, development commands, copyright.
- `VISION.md`: product goals, experience principles, technical direction, near-term milestones, open questions.
- `PROJECT_LOG.md`: verbatim prompts, setup notes, lessons learned.
- `AGENTS.md`: collaboration workflow and project conventions.
- `E2E_GUIDE.md`: testing philosophy and scenario conventions once UI work begins.

Studio City uses this copyright statement:

```text
Copyright (c) 2026 Stefan Alexander. All rights reserved.
```

## PWA Scaffold

- Use Vite with TypeScript for the initial web scaffold.
- Keep the first screen minimal until the product direction is ready.
- Include a web app manifest from the start.
- Configure the Vite base path from `PUBLIC_BASE_PATH` so GitHub Pages works for both production and PR previews.
- For Studio City, production builds deploy under `/studiocity/` and PR previews under `/studiocity/prN/`.

## E2E Testing Strategy

Model E2E testing after `anicolao/food` and `anicolao/chess-tt`.

Key process decisions:

- Use Playwright.
- Treat E2E tests as the primary correctness signal for visible UI behavior.
- Use a zero-pixel tolerance for visual snapshots.
- Keep tests deterministic.
- Avoid arbitrary sleeps such as `page.waitForTimeout()`.
- Keep Playwright assertions and actions at or under 2000ms, except for CI web server startup.
- Prefer role, label, and text locators over brittle CSS selectors.
- Commit scenario README files and screenshot baselines.

Use numbered scenario folders:

```text
tests/e2e/
├── helpers/
│   └── test-step-helper.ts
└── 001-homepage/
    ├── 001-homepage.spec.ts
    ├── README.md
    └── screenshots/
        └── 000-initial-load.png
```

Use a unified step helper so each test step runs assertions, waits for animations, captures a screenshot, and updates scenario documentation in one place.

## CI And Visual Baselines

- Visual baselines are OS-sensitive because fonts and rendering differ across runners.
- If screenshots are generated on macOS, run E2E CI on `macos-latest`.
- Alternatively, commit per-platform snapshots deliberately.
- Upload Playwright reports on failure or completion for easier debugging.
- Use `gh run view --log-failed` and `gh pr checks` to investigate CI failures.

## GitHub Pages Workflows

Replicate the reference workflow pattern:

- On pull requests, build and deploy to `gh-pages` under `prN/`.
- On pushes to `main`, build and deploy to the root of the `gh-pages` branch.
- Keep previous deployments with `keep_files: true`.
- Add or update a PR comment with the preview URL.

For Studio City:

- PR preview URL format: `https://s2alexan.github.io/studiocity/prN/`
- Production URL format: `https://s2alexan.github.io/studiocity/`

Production may 404 before the first successful `main` deploy, even if PR previews work.

## 2026-04-29: Initial Scaffolding - Implementation Notes

### Actions Taken
- Created `flake.nix` for Nix-based environment (Bun, GH, Git).
- Initialized `package.json` with Bun.
- Added a `commit` script to `package.json` for formatted commits: `npm run commit -- <issue_number> "<message>"`.
- Scaffolded a minimal Vite + TypeScript PWA using `vite-plugin-pwa`.
- Configured dynamic `base` path in `vite.config.ts` using `PUBLIC_BASE_PATH`.
- Set up Playwright for E2E testing with a unified `testStep` helper in `tests/e2e/helpers/test-step-helper.ts`.
- Created the first E2E scenario for the homepage in `tests/e2e/001-homepage/`.
- Updated `README.md` with development commands and copyright.
- Created `E2E_GUIDE.md` defining the testing philosophy.
- Set up GitHub Actions in `.github/workflows/deploy.yml` for automated deployment to GitHub Pages and PR previews.

### Lessons Learned
- **Tool Availability**: Nix was not pre-installed in the execution environment. While the `flake.nix` is provided for local development, `npx bun` was used for scaffolding and verification in this session.
- **Vite Version**: `vite@6` (or even `@8` in some registries) was pulled. Ensuring compatibility with older node versions might require pinning if issues arise.
- **Playwright Setup**: In CI-like environments, `npx playwright install chromium` is necessary before running tests.
- **GitHub Pages Base Path**: The `PUBLIC_BASE_PATH` environment variable correctly handles sub-directory deployments for PR previews (e.g., `/raven/pr1/`).

### Verification Results
- `bun install`: Passed.
- `bun run build`: Passed.
- `bun run test:e2e:update-snapshots`: Passed (1 test).
- Screenshots generated in `tests/e2e/001-homepage/screenshots/`.
- `flake.nix` validated (syntactically).

- macOS may route plain `git` to Apple developer tools prompts. Use the Nix-provided `git` inside `nix develop`.
- Vite/Rollup native packages may hit macOS code-signature issues under Node in the Nix shell. Running scripts through Bun's runtime avoided that in Studio City:

```json
{
  "build": "bun --bun tsc && bun --bun vite build",
  "test:e2e": "bun --bun playwright test"
}
```

- GitHub Pages cannot be enabled for a private repository if the account plan does not support it.
- PR previews can work before production if the PR workflow has deployed `prN/` but `main` has not yet deployed root.

### 2026-04-29: Conductor Verification

- **Environment**: Verified flake.nix contains necessary tools.
- **Build**: npx bun run build passed successfully.
- **Testing**: npx playwright install chromium followed by npx bun run test:e2e passed (1 test).
- **Documentation**: All baseline documents (README, VISION, PROJECT_LOG, AGENTS, E2E_GUIDE) are present and follow conventions.
- **CI/CD**: deploy.yml correctly handles PR previews and main deployments.
- **PR**: Created PR #2 to merge scaffolding into main.

**Verdict**: Scaffolding complete and verified.
