# Raven

## Mission
Enable tool building for Agentic LLMs, using Nix flakes as the distribution mechanism and for discovery.

## Workflow
1. **Identify**: LLM identifies a need for a tool.
2. **Search**: LLM uses its "Raven skill" to search for existing tools.
3. **Reuse**: If found, it reuses it.
4. **Fashion**: If not found, it "fashions" a new tool as a Nix flake, publishes it to GitHub, and then uses it.

## Key Concept
Each Raven tool is a self-contained package containing a skill (for LLM discovery/use) and a Nix flake (for execution).

## Development Commands
- `nix develop`: Enter the development environment.
- `bun install`: Install dependencies.
- `bun run dev`: Start the development server.
- `bun run build`: Build the project for production.
- `bun run test:e2e`: Run E2E tests.
- `npm run commit -- <issue_number> "<message>"`: Create a formatted commit.

## Copyright
Copyright (c) 2026 Stefan Alexander. All rights reserved.
