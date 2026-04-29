# Raven Vision

## Overview
Raven is designed to bridge the gap between LLM reasoning and concrete action by providing a robust, reproducible, and discoverable tool ecosystem. Unlike traditional toolkits, Raven empowers LLMs to expand their own capabilities autonomously through a "self-fashioning" loop.

## Unified Skill Ecosystem
Raven is not a silo. It is built to integrate seamlessly with the Gemini CLI skill ecosystem. 
- **Discoverability**: Raven tools are skills. They are discovered through GitHub topic searches, allowing the ecosystem to scale infinitely without a central authority.
- **Direct Execution**: Once a tool is discovered and its instructions (`SKILL.md`) are read, the agent executes it directly using `nix run`. This eliminates the need for complex intermediate layers and ensures maximum reliability.

## Repository-Centric "Self-Fashioning"
The core innovation of Raven is the "self-fashioning" lifecycle. When an LLM encounters a problem that cannot be solved with existing tools, it can:
1. **Design**: Architect a new tool to solve the problem.
2. **Implement**: Write the code and the Nix flake configuration.
3. **Publish**: Create a new GitHub repository for the tool.
4. **Tag**: Add GitHub Topics (e.g., `gemini-skill`, `raven-tool`), making it discoverable to anyone in the ecosystem.

This turns the entire GitHub network into a dynamic, evolving library of AI expertise.

## Why Nix Flakes?
Reproducibility is the cornerstone of reliable agentic behavior. By using Nix flakes, Raven ensures that:
- **Isolation**: Tools run in their own isolated environments, preventing dependency conflicts.
- **Reproducibility**: A tool created today will run exactly the same way a year from now, on any machine with Nix installed.
- **Portability**: Tools can be easily shared and executed across different operating systems and architectures.

Raven is not just a tool library; it's an evolutionary platform for AI agency.

## Near-term Milestones
The immediate focus is on building the MVP to demonstrate the core "self-fashioning" loop. See [DESIGN_MVP.md](./DESIGN_MVP.md) for the detailed technical plan.
