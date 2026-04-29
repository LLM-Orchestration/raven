import { spawnSync } from 'node:child_process';

export async function execute(toolId: string, args: string[] = []) {
  const nixArgs = [
    'run',
    `github:${toolId}`,
    '--',
    ...args
  ];

  console.log(`Executing tool: ${toolId} with args: ${args.join(' ')}`);
  
  const result = spawnSync('nix', nixArgs, { stdio: 'inherit' });

  if (result.status !== 0) {
    throw new Error(`Execution failed with exit code ${result.status}`);
  }
}
