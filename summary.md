Raven MVP Phase 2 implementation is complete and verified.

### Key Achievements
- **Sync & Freshen**: Implemented decentralized skill discovery and maintenance using `skills-cli`. Raven can now search GitHub for repositories tagged with `gemini-skill` or `raven-tool` and install them locally.
- **Run Wrapper**: Added a `run` command that automatically freshens skills before executing any command, ensuring agents always work with the latest skill definitions.
- **Self-Fashioning Logic**: Implemented `fashion` tool to automate the creation of new standalone tool repositories with `SKILL.md`, `flake.nix`, and appropriate GitHub topics.
- **Agent Learning**: Added a `learning` command to prompt agents to reflect on their workflows and identify opportunities for new tool creation.
- **Documentation**: Updated `SKILL.md` with comprehensive instructions for building conforming skills and using the Raven orchestrator.

### Verification
- `npm run build`: Passed.
- `raven search`: Functional.
- `raven sync`: Successfully installed 5 skills.
- `raven freshen`: Successfully updated skills.
- `raven run`: Verified as a pre-step wrapper.
- `raven learning`: Verified guiding message.

Closes #7
