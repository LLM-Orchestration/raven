import { spawnSync } from 'node:child_process';
import { search_skills } from './search.ts';

export async function sync() {
  console.log('Searching for skills...');
  const repos = await search_skills();
  console.log(`Found ${repos.length} skills. Syncing...`);

  for (const repo of repos) {
    console.log(`Adding skill: ${repo.fullName}`);
    const result = spawnSync('npx', ['skills-cli', 'add', `https://github.com/${repo.fullName}.git`], {
      stdio: 'inherit',
    });

    if (result.status !== 0) {
      console.warn(`Failed to add skill ${repo.fullName}.`);
    }
  }
}

export async function freshen() {
  console.log('Freshening installed skills...');
  const result = spawnSync('npx', ['skills-cli', 'update'], {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error('Failed to freshen skills.');
  }
}
