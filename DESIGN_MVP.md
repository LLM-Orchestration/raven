# Raven MVP Design Document

## 1. Goal
The Raven MVP aims to demonstrate the core "self-fashioning" loop for Agentic LLMs: discovering existing tools, executing them reproducibly via Nix, and creating new tools when none satisfy the requirement.

Crucially, Raven is designed to integrate seamlessly with the existing Gemini CLI skill discovery mechanism, ensuring that "Raven tools" are found and used in the same unified way as any other skill in the ecosystem.

## 2. Core Architecture

### 2.1 Unified Skill Discovery
Raven tools do not use a proprietary search mechanism. Instead, they leverage the Gemini CLI's standard skill discovery process:
- **`SKILL.md`**: Every Raven tool is a repository containing a `SKILL.md` file at its root, with YAML frontmatter defining its `name` and `description`.
- **Unified Indexing**: The Gemini CLI (or a Raven-specific extension) discovers these tools by searching GitHub for repositories tagged with specific topics (e.g., `gemini-skill`, `raven-tool`).
- **Prompt Injection**: Discovered tools are injected into the LLM's system prompt as available skills, alongside built-in and locally installed skills.
- **On-Demand Activation**: When the LLM calls `activate_skill(name: "tool-name")`, the environment resolves the GitHub repository, prepares the environment via Nix, and activates the skill's instructions.

### 2.2 Repository-Centric Tooling
Each Raven tool is a separate, standalone GitHub repository by default.
- **Isolation**: Each tool has its own dependencies, versioning, and lifecycle.
- **Distribution**: Tools are shared and discovered via GitHub.
- **Metadata**: GitHub Topics are used for indexing and categorization.

### 2.3 The Raven Skill (The Orchestrator)
The `raven` skill itself acts as the entry point for management functions:
- `fashion(name: string, description: string, implementation: string)`: Generates a new GitHub repository for a tool, populates it with `SKILL.md` and `flake.nix`, and applies the necessary topic tags.
- `execute(toolId: string, args: any)`: A fallback mechanism for explicit tool execution if standard skill activation is not applicable.

### 2.4 Execution Engine (Nix Flakes)
Nix remains the foundation for reproducibility:
- Each tool repository contains a `flake.nix`.
- The execution environment is deterministic and isolated.
- The `gemini` runtime handles the `nix run` invocation during skill activation or execution.

## 3. Data Model

### 3.1 Tool Repository Structure
```text
raven-tool-repo/
├── SKILL.md      # LLM instructions & metadata (Required)
├── flake.nix     # Reproducible environment (Required)
├── flake.lock    # Pinning dependencies
├── tool.ts       # Implementation (e.g., Node, Python, or Go)
└── README.md     # Human-readable documentation
```

### 3.2 Skill Metadata (SKILL.md YAML Frontmatter)
```yaml
---
name: pdf-to-md
description: Converts PDF documents to Markdown format using the 'marker' library.
---
```

## 4. MVP User Flow (Agent Perspective)

1. **Requirement**: Agent needs to convert a PDF to Markdown.
2. **Discovery**: The agent identifies `pdf-to-md` in its `Available Agent Skills` list (populated by the unified indexer).
3. **Activation**: Agent calls `activate_skill(name: "pdf-to-md")`.
4. **Execution**: The agent follows the newly loaded instructions in the `pdf-to-md` `SKILL.md` to perform the conversion.
5. **Fashioning (if missing)**:
    - If no suitable skill is found, the agent calls `raven.fashion(...)`.
    - Raven creates a new repo `username/pdf-to-md` with the generated implementation.
    - Raven tags the repo with `raven-tool`.
    - The new skill becomes discoverable for the next session (or immediately if indexed).

## 5. Technical Stack
- **Runtime**: Bun (for Raven skill) and Nix (for tool execution).
- **Discovery**: GitHub Search API (via `gh` CLI).
- **Packaging**: Nix Flakes.
- **Integration**: Gemini CLI Skill standard (`SKILL.md`).

## 6. Milestones
1. **Phase 1: Discovery Integration**: Implement the GitHub Topic searcher and hook it into the local skill indexer.
2. **Phase 2: Tool Template**: Define the standard repository template including `SKILL.md` and `flake.nix`.
3. **Phase 3: Execution Logic**: Ensure the runtime can execute Nix-backed skills during `activate_skill`.
4. **Phase 4: Fashioning (Self-Creation)**: Implement the repository creation, template population, and tagging workflow using the `gh` CLI.
