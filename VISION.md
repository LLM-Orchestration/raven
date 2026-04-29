# Raven Vision

## Overview
Raven is designed to bridge the gap between LLM reasoning and concrete action by providing a robust, reproducible, and discoverable tool ecosystem. In the current landscape, LLMs are often limited by the pre-defined tools provided by their hosts. Raven empowers LLMs to expand their own capabilities autonomously.

## The "Raven Skill"
The Raven skill is the entry point for an LLM into the ecosystem. It provides the LLM with the ability to:
- **Query the Raven Registry**: Search for tools based on semantic descriptions and functional requirements.
- **Inspect Tool Skills**: Understand how to interface with a tool, its parameters, and its expected outputs.
- **Manage Dependencies**: Use Nix flakes to ensure that the tool's execution environment is perfectly reproduced, regardless of where it's running.

## Self-Fashioning Tool Lifecycle
Raven introduces the concept of "self-fashioning" tools. When an LLM encounters a problem that cannot be solved with existing tools, it can:
1. **Design**: Architect a new tool to solve the problem.
2. **Implement**: Write the code and the Nix flake configuration.
3. **Publish**: Commit and push the new tool to a GitHub repository.
4. **Register**: Add the new tool to the Raven ecosystem, making it available for itself and other agents.

This creates a positive feedback loop where the ecosystem grows more capable with every task performed.

## Why Nix Flakes?
Reproducibility is the cornerstone of reliable agentic behavior. By using Nix flakes, Raven ensures that:
- **Isolation**: Tools run in their own isolated environments, preventing dependency conflicts.
- **Reproducibility**: A tool created today will run exactly the same way a year from now, on any machine with Nix installed.
- **Portability**: Tools can be easily shared and executed across different operating systems and architectures.

Raven is not just a tool library; it's an evolutionary platform for AI agency.

## Near-term Milestones
The immediate focus is on building the MVP to demonstrate the core "self-fashioning" loop. See [DESIGN_MVP.md](./DESIGN_MVP.md) for the detailed technical plan.

Key milestones:
- **Registry Foundation**: Establishing the GitHub-backed tool registry.
- **Execution Engine**: Reliable Nix-based tool invocation.
- **Self-Fashioning**: Enabling LLMs to generate and publish new tools.

