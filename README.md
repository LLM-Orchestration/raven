# Raven

> **Self-Fashioning Tools for Agentic LLMs**

Raven is a robust, reproducible, and discoverable tool ecosystem designed to bridge the gap between Large Language Model (LLM) reasoning and concrete action. It empowers AI agents to not only use existing tools but to autonomously expand their own capabilities through a self-fashioning loop.

---

## Mission

Enable autonomous tool building and discovery for Agentic LLMs, using Nix flakes as the distribution mechanism for guaranteed reproducibility and GitHub as the decentralized discovery layer.

## Key Features

- **Unified Discovery**: Raven tools are fully integrated with the Gemini CLI skill ecosystem. They are discovered through GitHub topic searches (gemini-skill, raven-tool), allowing for infinite, decentralized scaling.
- **Self-Fashioning**: When an agent identifies a missing capability, it can architect, implement, and publish a new Raven tool as a standalone GitHub repository.
- **Nix-Powered Reproducibility**: Every Raven tool is a Nix flake. This ensures isolation, portability, and that a tool created today will run exactly the same way forever, on any machine with Nix installed.
- **Seamless Integration**: Once discovered, tools are executed directly using nix run, eliminating complex intermediate layers and dependency conflicts.

## Installation

### Requirements

To use Raven, you must have the following tools installed on your system:

- **Nix**: Required for reproducible tool execution. [Download Nix](https://nixos.org/download.html)
- **Bun**: The fast JavaScript runtime used by Raven. [Install Bun](https://bun.sh)
- **GitHub CLI (gh)**: Required for discovery and publishing tools. [Install GitHub CLI](https://cli.github.com/)

### Setup

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/LLM-Orchestration/raven.git
cd raven

# Install dependencies
bun install

# Link raven for global usage
bun link
```

Alternatively, if you have Nix installed, you can enter a pre-configured development environment:

```bash
nix develop
```

## Usage

Raven provides a set of commands to manage the tool ecosystem. After installation, the `raven` command will be available in your terminal.

### Search for Tools
Find available Raven tools on GitHub using keywords:
```bash
raven search "pdf"
```

### Sync Ecosystem
Discover and install all available Raven skills into your local environment:
```bash
raven sync
```

### Fashion a New Tool
Create a new standalone Raven tool as a GitHub repository. This command scaffolds a new project, initializes a Git repository, and prepares it for publication:
```bash
raven fashion <name> <description> <implementation_code>
```

### Maintenance
Update all installed skills to their latest versions to ensure you have the most recent fixes and features:
```bash
raven freshen
```

### Continuous Learning
Reflect on completed tasks and identify opportunities for creating new tools to fill capability gaps:
```bash
raven learning
```

## License

This project is licensed under the **GNU General Public License v3.0**. See the [LICENSE](./LICENSE) file for the full license text.

---

Copyright (C) 2026 Raven Contributors.
