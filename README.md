# Raven 🐦‍⬛

> **Self-Fashioning Tools for Agentic LLMs**

Raven is a robust, reproducible, and discoverable tool ecosystem designed to bridge the gap between LLM reasoning and concrete action. It empowers AI agents to not only use existing tools but to autonomously expand their own capabilities through a "self-fashioning" loop.

---

## 🎯 Mission

Enable autonomous tool building and discovery for Agentic LLMs, using Nix flakes as the distribution mechanism for guaranteed reproducibility and GitHub as the decentralized discovery layer.

## ✨ Key Features

- **Unified Discovery**: Raven tools are fully integrated with the Gemini CLI skill ecosystem. They are discovered through GitHub topic searches (`gemini-skill`, `raven-tool`), allowing for infinite, decentralized scaling.
- **Self-Fashioning**: When an agent identifies a missing capability, it can architect, implement, and publish a new Raven tool as a standalone GitHub repository.
- **Nix-Powered Reproducibility**: Every Raven tool is a Nix flake. This ensures isolation, portability, and that a tool created today will run exactly the same way forever, on any machine with Nix.
- **Seamless Integration**: Once discovered, tools are executed directly using `nix run`, eliminating complex intermediate layers.

## 🚀 Installation

### Requirements

- **Nix**: Required for reproducible tool execution. [Install Nix](https://nixos.org/download.html)
- **Bun**: The fast JavaScript runtime used by Raven. [Install Bun](https://bun.sh)
- **GitHub CLI (gh)**: Required for discovery and publishing tools. [Install gh](https://cli.github.com/)

### Setup

```bash
# Clone the repository
git clone https://github.com/LLM-Orchestration/raven.git
cd raven

# Install dependencies
bun install

# Link raven for global usage
bun link
```

## 🛠 Usage

Raven provides a set of commands to manage the skill ecosystem:

### Search for Tools
Find available Raven tools on GitHub:
```bash
raven search "pdf"
```

### Sync Ecosystem
Discover and install all available Raven skills into your local environment:
```bash
raven sync
```

### Fashion a New Tool
Create a new standalone Raven tool as a GitHub repository:
```bash
raven fashion <name> <description> <implementation_code>
```

### Maintenance
Update all installed skills to their latest versions:
```bash
raven freshen
```

### Continuous Learning
Reflect on completed tasks and identify opportunities for new tools:
```bash
raven learning
```

## 📜 License

This project is licensed under the **GNU General Public License v3.0**. See the [LICENSE](./LICENSE) file for details.

---

Copyright (C) 2026 Raven Contributors.
