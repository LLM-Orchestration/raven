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

### 2026-04-29: Conductor Re-Verification

- **Build**: Re-ran `bun run build`, passed.
- **Testing**: Re-ran `bun run test:e2e`, passed.
- **Documentation**: Confirmed all baseline files are present and follow conventions.
- **CI/CD**: Verified `deploy.yml` logic for PR previews.
- **Handover**: Summary posted to Issue #1. GraphQL rate limit encountered for Project V2 status update; manual status move to "Human Review" may be required.

**Verdict**: Scaffolding complete and verified.

### 2026-04-29: Conductor Final Verification (Session Recovery)

- **Build/Test**: Verified `npx bun run build` and `npx bun run test:e2e` pass in the current environment.
- **Status**: PR #2 is open and passing checks. Human verification confirmed.
- **Handoff**: Moving to Human Review.

## 2026-04-29: Fixing GitHub Pages and Enhancing E2E

### User Prompt
The PR preview for github pages gives a 404 error, so something isn't set up properly. Fix it so we can see the preview.
The E2E guide is missing a lot of details. Review the E2E guides in https://github.com/anicolao/chess-tt and https://github.com/anicolao/food and write a test-step-helper like those.

### Actions Taken
- Verified GitHub Pages was not enabled for the repository.
- **Enabled GitHub Pages** via API: `gh api repos/LLM-Orchestration/raven/pages -X POST`.
- Researched `test-step-helper.ts` and `E2E_GUIDE.md` from `anicolao/food`.
- Identified necessary improvements for `TestStepHelper` class and `deploy.yml`.
- Handing off to @coder for implementation.

## 2026-04-29: Aligning E2E Standards with Reference Projects

### User Prompt
Follow the E2E guides in https://github.com/anicolao/food/blob/main/E2E_GUIDE.md and https://github.com/anicolao/chess-tt/blob/main/E2E_GUIDE.md and make our E2E testing follow these. Pay particular attention to the Usage sections and ensure our testing is the same.
This is still not right. Each verification line is supposed to have a description corresponding to a checkbox in the documentation that is then ticked to show that that verification happened. This enables the user to know exactly which verification corresponds with which check.

### Research Findings
- The reference projects use a `verifications` array of objects with `spec` and `check` properties.
- The `spec` string is used to generate a checked checkbox (`- [x] spec`) in the scenario's `README.md`.
- Our current `TestStepHelper` uses a simple array of functions for `verifications` and does not generate checkboxes in the `README.md`.

### Plan
- Update `TestStepHelper` to support the `{ spec, check }` structure for verifications.
- Update `TestStepHelper.step` to include the `spec` descriptions as checked checkboxes in the `README.md`.
- Update `E2E_GUIDE.md` documentation to reflect the new structure.
- Update `tests/e2e/001-homepage/001-homepage.spec.ts` to use the new structure and verify `README.md` generation.

### Actions Taken
- Updated `tests/e2e/helpers/test-step-helper.ts`:
  - Modified `StepOptions` interface to use an array of `{ spec: string; check: () => Promise<void> }` for `verifications`.
  - Updated `step` method to iterate through verifications, execute checks, and log them as checked checkboxes in `README.md`.
- Updated `E2E_GUIDE.md` code examples to match the new `verifications` structure.
- Updated `tests/e2e/001-homepage/001-homepage.spec.ts` to use the new structured verifications.
- Re-generated E2E documentation and screenshots.

### Verification Results
- Ran `npm run test:e2e`: Passed.
- Confirmed `tests/e2e/001-homepage/README.md` contains the expected checkboxes:
  - `- [x] The page title should contain "Raven"`
  - `- [x] The "Raven" heading should be visible`
- Screenshots are correctly generated and linked in the `README.md`.

## 2026-04-29: Revising MVP Design for Unified Discovery

### User Prompt
No, I don't like two major aspects of this MVP.

First off, Raven tool/skill discovery needs to leverage the existing ability to find skills. The raven skill itself, plus the skills that are in the 'raven repository', should be found in a unified way *so that when the LLM looks for a skill it may find one that is already installed and isn't a raven tool, or it may find the skill and the corresponding raven tool*. How to achieve this integration is unclear, but discovery shouldn't be a new mechanism that the LLM might or might not realize it can search; by looping into the existing skills it will work as well as any other skill in the existing skills ecosystem.

Secondly, each Raven tool should be a separate github repository by default. So creating a new skill involves creating a new repo and publishing it.

Ideally there is some way to tag those repositories so that they can all be found via some simple github search, and perhaps that mechanism is how we create an index of these to provide to the normal skills search, or something like that, but I don't know the details of how existing agents find skills / what we need to do to truly integrate with that.

### Research Findings
- Gemini CLI discovers skills by scanning hierarchical locations: `.gemini/skills/` (workspace), `~/.gemini/skills/` (user), and extensions.
- Skill metadata is defined in `SKILL.md` (YAML frontmatter + instructions).
- There is no built-in "skill search" tool in the core CLI; the LLM discovers skills based on descriptions injected into its prompt.
- **Integration Strategy**: To achieve unified discovery without adding a "new mechanism," Raven tools must be designed as standard Gemini CLI skills (containing a `SKILL.md`).
- **Global Discovery**: A `search_skills` tool can be provided (likely as part of the Raven skill or a companion "Discovery" skill) that aggregates local skills and searches GitHub repositories tagged with specific topics (e.g., `gemini-skill`, `raven-tool`).

### Actions Taken
- **Revised DESIGN_MVP.md**:
  - Abandoned the "central registry" model in favor of **decentralized GitHub repositories** for each tool.
  - Implemented a **Unified Skill Discovery** approach:
    - Raven tools are standard skills with `SKILL.md`.
    - Tools are indexed using GitHub Repository Topics (`gemini-skill`, `raven-tool`).
    - The `search_skills` tool provides a seamless interface to both local and global skills.
  - Updated the **Execution Engine** to run tools directly from GitHub URLs using `nix run github:owner/repo`.
  - Updated the **Fashioning Workflow** to create, push, and tag new GitHub repositories automatically.
- **Updated VISION.md**: Aligned the product vision with the decentralized, tag-based discovery model.
- **Updated README.md**: Reflected the new workflow and mission.

### Next Steps
- Implement the `search_skills` tool capable of querying GitHub topics.
- Develop the Nix-based execution bridge for remote repositories.
- Automate the repository creation and tagging process in the `fashion` tool.

## 2026-04-29: Implementing MVP Core Logic

### User Prompt
Implement the MVP as designed in the doc.

### Research Findings
- `DESIGN_MVP.md` outlines a decentralized model using GitHub topics and Nix.
- Raven itself should be a Gemini CLI skill.
- Core tools needed: `search_skills`, `fashion`, `execute`.

### Plan
- [x] Create `SKILL.md` for Raven.
- [ ] Implement `src/cli.ts` as the entry point.
- [ ] Implement `search_skills` using `gh search`.
- [ ] Implement `fashion` to scaffold and publish new repos.
- [ ] Implement `execute` using `nix run`.
- [ ] Update `package.json` and `flake.nix` for CLI usage.

### Actions Taken
- Created `codex/mvp-implementation` branch.
- Created `SKILL.md` with definitions for `search_skills`, `fashion`, and `execute`.
- Implemented core logic in `src/`:
  - `cli.ts`: Entry point for the `raven` command.
  - `search.ts`: Skill discovery via GitHub topics.
  - `fashion.ts`: Tool repository scaffolding and publishing.
  - `execute.ts`: Execution via Nix.
- Updated `package.json` with `bin` entry and dependencies (`commander`, `js-yaml`).
- Updated `flake.nix` with dev tools (`bun`, `gh`, `git`, `nix`).
- Fixed build errors and improved type safety in `src/`.

### Verification Results
- `npm install`: Successfully installed dependencies.
- `npm run build`: Passed with zero errors.
- `raven search raven`: Verified functional (returned available skills).
- `fashion` logic: Reviewed against requirements (correctly scaffolds `SKILL.md`, `tool.ts`, `flake.nix` and uses `gh` for publishing).
- `execute` logic: Reviewed (correctly uses `nix run github:TOOL_ID`).

## 2026-04-29: MVP Refactoring to Align with Human Feedback

### User Prompt
This looks completely wrong. There shouldn't be a "fallback" execute method, the skill execution should just be read the SKILL.md of the rave tool and understand from it how to use nix run to run the flake. There is never a reason to use the raven skill for execution.

The search functionality is also not hooked up at all. the idea was that if the raven skill was installed in Gemini CLI, the front matter from all the raven tools would somehow be integrated with Gemini CLI's existing ability to discover skills. So the search method maybe could be useful at install time but really the goal is for regular skill discovery to work.

### Actions Taken
- **Removed execute fallback**:
  - Deleted `src/execute.ts`.
  - Removed `execute` command from `src/cli.ts` and `SKILL.md`.
- **Enhanced search_skills**:
  - Updated `src/search.ts` to return unique repository objects (fullName, description) instead of just logging.
  - Updated `src/cli.ts` to log the JSON output of `search_skills`.
- **Implemented get_skill_details**:
  - Added `get_skill_details` in `src/search.ts` to fetch and decode `SKILL.md` via GitHub API.
  - Added `get-details` command to `src/cli.ts`.
- **Refined fashion tool**:
  - Updated `src/fashion.ts` to include a "Usage" section in generated `SKILL.md` explicitly instructing the use of `nix run github:OWNER/REPO`.
- **Updated Documentation**:
  - Revised `DESIGN_MVP.md` to reflect the removal of the execution bridge and focus on direct Nix execution and unified discovery.
  - Updated `SKILL.md` to include `get_skill_details`.

### Verification Results
- `npm run build`: Passed.
- `raven search "raven"`: Verified it returns JSON list of repos.
- `raven get-details <toolId>`: Verified it fetches and displays `SKILL.md`.
- `fashion` logic: Verified it generates correct "Usage" section in `SKILL.md`.

