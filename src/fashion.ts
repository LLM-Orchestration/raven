import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import yaml from 'js-yaml';

export async function fashion(name: string, description: string, implementation: string) {
  const tmpDir = mkdtempSync(join(tmpdir(), `raven-tool-${name}-`));
  console.log(`Scaffolding tool in: ${tmpDir}`);

  try {
    // 1. SKILL.md
    const skillContent = `---
name: ${name}
description: ${description}
---

# ${name}

${description}
`;
    writeFileSync(join(tmpDir, 'SKILL.md'), skillContent);

    // 2. tool.ts
    writeFileSync(join(tmpDir, 'tool.ts'), implementation);

    // 3. flake.nix
    const flakeContent = `{
  description = "${description}";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        packages.default = pkgs.writeShellApplication {
          name = "${name}";
          runtimeInputs = [ pkgs.bun ];
          text = ''
            bun run \${./tool.ts} "$@"
          '';
        };
      });
}
`;
    writeFileSync(join(tmpDir, 'flake.nix'), flakeContent);

    // 4. Git init and commit
    const run = (cmd: string, args: string[], cwd: string) => {
      const result = spawnSync(cmd, args, { cwd, encoding: 'utf-8' });
      if (result.status !== 0) {
        throw new Error(`Command failed: ${cmd} ${args.join(' ')}\n${result.stderr}`);
      }
      return result.stdout;
    };

    run('git', ['init'], tmpDir);
    // Set local config to avoid "Author identity unknown" errors
    try {
      run('git', ['config', 'user.name', 'Raven Agent'], tmpDir);
      run('git', ['config', 'user.email', 'raven@agentic.ai'], tmpDir);
    } catch (e) {
      // Ignore if config fails (might be already set globally)
    }
    run('git', ['add', '.'], tmpDir);
    run('git', ['commit', '-m', 'Initial commit from Raven'], tmpDir);

    // 5. GitHub repo create
    console.log(`Creating GitHub repository: ${name}`);
    // We use --public by default as per DESIGN_MVP.md
    run('gh', ['repo', 'create', name, '--public', '--source=.', '--push', '--description', description], tmpDir);

    // 6. Tag with topics
    console.log('Adding discovery topics...');
    // We need to get the full name (owner/name) to edit topics
    const fullName = run('gh', ['repo', 'view', '--json', 'nameWithOwner', '-q', '.nameWithOwner'], tmpDir).trim();
    run('gh', ['repo', 'edit', fullName, '--add-topic', 'gemini-skill', '--add-topic', 'raven-tool'], tmpDir);

    console.log(`Successfully fashioned tool: ${fullName}`);
  } catch (error) {
    console.error('Fashioning failed, cleaning up...');
    rmSync(tmpDir, { recursive: true, force: true });
    throw error;
  }
}
