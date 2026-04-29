---
name: raven
description: Orchestrates the discovery, execution, and creation of decentralized agent skills via GitHub and Nix.
---

# Raven

Raven is a "self-fashioning" skill that allows you to discover existing tools in the ecosystem, execute them reproducibly, and create new tools when none satisfy your requirements.

## Available Tools

### search_skills(query?: string)
Searches for available skills on GitHub.
- `query`: Optional search term to filter results.
- Returns a list of repositories tagged with `gemini-skill` or `raven-tool`, including their names and descriptions.

### fashion(name: string, description: string, implementation: string)
Creates a new standalone Raven tool as a GitHub repository.
- `name`: The name of the tool (e.g., "pdf-to-md").
- `description`: A clear description for the `SKILL.md`.
- `implementation`: The code or logic for the tool (e.g., a Bun script or Python script).
- Raven will automatically generate the `SKILL.md`, `flake.nix`, and tag the repository correctly.

### execute(toolId: string, args?: string[])
Executes a Raven tool directly from GitHub using Nix.
- `toolId`: The GitHub repository identifier (e.g., "owner/repo").
- `args`: Optional arguments to pass to the tool.
