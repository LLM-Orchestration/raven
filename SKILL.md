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

### sync()
Discovers and installs all available Raven skills from GitHub.
- Raven will search for repositories tagged with `gemini-skill` or `raven-tool` and install them locally using `skills-cli`.

### freshen()
Updates all installed Raven skills to their latest versions.
- This should be run as a pre-step before using other CLIs to ensure your skill definitions are current.

### raven_learning()
Trigger this skill after completing any complex task to review what you learned and consider fashioning new tools.
- Reflect on the steps taken and identify repetitive or complex actions that could be automated by a new Raven tool.
- Propose a name, description, and implementation for a new tool if appropriate.

## How to Build a Conforming Skill

To create a skill that Raven can discover and use, follow these requirements:

1.  **Repository Structure**:
    - `SKILL.md`: (Required) Contains the agent instructions and metadata.
    - `flake.nix`: (Required) Defines the reproducible execution environment using Nix.
    - `tool.ts` (or other): The implementation of the tool's logic.
2.  **SKILL.md Format**:
    - Must start with YAML frontmatter:
      ```yaml
      ---
      name: your-skill-name
      description: A clear description of what the skill does.
      ---
      ```
    - Should include a "Usage" section with the `nix run` command.
3.  **flake.nix Format**:
    - Use `pkgs.writeShellApplication` to create an executable.
    - Ensure it can run via `nix run github:owner/repo`.
4.  **GitHub Topics**:
    - Tag the repository with `gemini-skill` and `raven-tool` to make it discoverable.
