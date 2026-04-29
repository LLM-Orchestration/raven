---
name: raven
description: Orchestrates the discovery, and creation of decentralized agent skills via GitHub and Nix.
---

# Raven

Raven is a "self-fashioning" skill that allows you to discover existing tools in the ecosystem and create new tools when none satisfy your requirements.

## Available Tools

### search_skills(query?: string)
Searches for available skills on GitHub tagged with `gemini-skill` or `raven-tool`.
- `query`: Optional search term to filter results.
- Returns a list of repository IDs (e.g., "owner/repo") and their descriptions.

### get_skill_details(toolId: string)
Fetches the full instructions (`SKILL.md`) for a specific tool from its GitHub repository.
- `toolId`: The GitHub repository identifier (e.g., "owner/repo").
- Use this to understand how to execute the tool after finding it via `search_skills`.

### fashion(name: string, description: string, implementation: string)
Creates a new standalone Raven tool as a GitHub repository.
- `name`: The name of the tool (e.g., "pdf-to-md").
- `description`: A clear description for the `SKILL.md`.
- `implementation`: The code or logic for the tool (e.g., a Bun script or Python script).
- Raven will automatically generate the `SKILL.md` with execution instructions, a `flake.nix`, and tag the repository correctly.
