# Agents

This document defines the collaboration workflow and project conventions for the Raven project.

## Personas

### @conductor
The high-level orchestrator. Responsible for:
- Translating user requirements into actionable tasks for @coder.
- Managing project documentation (AGENTS.md, PROJECT_LOG.md).
- Final verification of work before merging.
- Creating Pull Requests.

### @coder
The implementation expert. Responsible for:
- Implementing features and fixes in the source code.
- Writing tests (E2E with Playwright).
- Setting up and maintaining the development environment (Nix, Bun).
- Fixing CI/CD issues.

## Workflow Conventions

### Branching
- Use pull requests for repository changes by default.
- Use short-lived `codex/` branches for Codex-authored work.
- The next agent handoff must manage the `branch:` label to ensure the next runner starts in the correct Git context.

### Commits
- Use `npm run commit -- <issue_number> "<message>"` for all commits.
- This ensures consistency and links commits to issues.

### Handoffs
- Handoffs between agents are performed using the `handoff.sh` script.
- The script handles label updates and comments to trigger the next agent.

### Verification
- All changes must pass the verification checklist defined in `PROJECT_LOG.md` before being merged.
- E2E tests are the primary correctness signal for visible UI behavior.

## Documentation
- `README.md`: Concise project summary and development commands.
- `VISION.md`: Product goals and technical direction.
- `PROJECT_LOG.md`: Verbatim prompts and setup notes.
- `AGENTS.md`: This document.
- `E2E_GUIDE.md`: Testing philosophy and conventions.
