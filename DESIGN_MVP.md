# Raven MVP Design Document

## 1. Goal
The Raven MVP aims to demonstrate the core "self-fashioning" loop for Agentic LLMs: discovering existing tools, executing them reproducibly via Nix, and creating new tools when none satisfy the requirement.

## 2. Core Components

### 2.1 Raven Skill (The Interface)
The entry point for LLMs. It defines the functions available to the agent:
- `search(query: string)`: Searches the Raven Registry for tools matching the semantic description.
- `execute(toolId: string, args: any)`: Runs a tool using `nix run`.
- `fashion(name: string, description: string, implementation: string)`: Generates a new tool (Nix flake + implementation code) and pushes it to the registry.

### 2.2 Raven Registry (The Repository)
A central (or federated) GitHub repository acting as the source of truth for available tools.
- **Structure**: Each tool is a directory or a standalone repository containing a `flake.nix` and the tool's source code.
- **Metadata**: A `tools.json` or similar index file in the registry repository to facilitate searching.

### 2.3 Execution Engine
A lightweight wrapper around the Nix CLI.
- Uses `nix run github:owner/repo/tool-path` to execute tools.
- Ensures isolation and reproducibility by relying on Nix's dependency management.

### 2.4 Fashioning Workflow
The process of creating a new tool:
1. **Template Selection**: Use a set of Nix flake templates (e.g., Python, Node, Go).
2. **Code Generation**: LLM generates the tool's logic.
3. **Validation**: Basic syntax check (and ideally a `nix build` check).
4. **Publication**: Use `gh` CLI to create a new branch/PR or commit directly to the registry repository.

## 3. Data Model

```typescript
interface Tool {
  id: string; // unique identifier (e.g., "github:owner/repo/tool")
  name: string;
  description: string;
  skill: SkillDefinition; // How the LLM calls the tool
  requirements: string[]; // e.g., ["nix", "python"]
}

interface SkillDefinition {
  parameters: any; // JSON Schema
  returns: any; // JSON Schema
}
```

## 4. MVP User Flow (Agent Perspective)

1. **Requirement**: Agent needs to convert a PDF to Markdown.
2. **Search**: `raven.search("pdf to markdown converter")` -> Returns 0 results.
3. **Fashion**: `raven.fashion("pdf-to-md", "Converts PDF to MD", "python code using marker...")`.
    - Raven creates `tools/pdf-to-md/` directory.
    - Raven generates `flake.nix` with Python and necessary dependencies.
    - Raven pushes to GitHub.
4. **Use**: `raven.execute("pdf-to-md", { file: "input.pdf" })`.

## 5. Technical Stack
- **Runtime**: Bun (for the Raven CLI/Skill implementation).
- **Package Management**: Nix flakes.
- **Discovery/Registry**: GitHub (Repositories + `gh` CLI).
- **Testing**: Playwright (for E2E flows involving the UI/Dashboard).

## 6. Milestones
1. **Phase 1: Registry Structure & Discovery**: Define the Tool/Skill schema and implement `search`.
2. **Phase 2: Execution Engine**: Implement the `execute` function using Nix.
3. **Phase 3: Tool Creation (Fashioning)**: Implement the `fashion` workflow using templates and `gh` CLI.
4. **Phase 4: Web Dashboard**: Create a minimal Web UI to visualize the registry and tool execution logs.
