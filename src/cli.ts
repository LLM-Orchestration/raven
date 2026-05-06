#!/usr/bin/env bun
import { Command } from 'commander';
import { spawnSync } from 'node:child_process';
import { search_skills, get_skill_details } from './search.ts';
import { fashion } from './fashion.ts';
import { sync, freshen } from './sync.ts';

const program = new Command();

program
  .name('raven')
  .description('Raven - Tool building for Agentic LLMs')
  .version('0.1.0')
  .enablePositionalOptions();

program
  .command('search')
  .description('Search for available skills on GitHub')
  .argument('[query]', 'Search term to filter results')
  .action(async (query: string) => {
    try {
      const skills = await search_skills(query);
      console.log(JSON.stringify(skills, null, 2));
    } catch (error: any) {
      console.error('Error searching skills:', error.message);
      process.exit(1);
    }
  });

program
  .command('get-details')
  .description('Get the SKILL.md content for a specific tool')
  .argument('<toolId>', 'The GitHub repository identifier (e.g., owner/repo)')
  .action(async (toolId: string) => {
    try {
      const details = await get_skill_details(toolId);
      console.log(details);
    } catch (error: any) {
      console.error('Error getting skill details:', error.message);
      process.exit(1);
    }
  });

program
  .command('fashion')
  .description('Create a new standalone Raven tool as a GitHub repository')
  .argument('<name>', 'The name of the tool')
  .argument('<description>', 'A clear description for the SKILL.md')
  .argument('<implementation>', 'The code or logic for the tool')
  .action(async (name: string, description: string, implementation: string) => {
    try {
      await fashion(name, description, implementation);
    } catch (error: any) {
      console.error('Error fashioning tool:', error.message);
      process.exit(1);
    }
  });

program
  .command('sync')
  .description('Discover and install all available Raven skills from GitHub')
  .action(async () => {
    try {
      await sync();
    } catch (error: any) {
      console.error('Error syncing skills:', error.message);
      process.exit(1);
    }
  });

program
  .command('freshen')
  .description('Update all installed Raven skills to their latest versions')
  .action(async () => {
    try {
      await freshen();
    } catch (error: any) {
      console.error('Error freshening skills:', error.message);
      process.exit(1);
    }
  });

program
  .command('run')
  .description('Run a command after freshening skills')
  .argument('<command...>', 'The command and arguments to run')
  .passThroughOptions()
  .action(async (args: string[]) => {
    try {
      await freshen();
      const [cmd, ...cmdArgs] = args;
      const result = spawnSync(cmd, cmdArgs, { stdio: 'inherit' });
      process.exit(result.status ?? 0);
    } catch (error: any) {
      console.error('Error running command:', error.message);
      process.exit(1);
    }
  });

program
  .command('learning')
  .description('Review what you learned and consider fashioning new tools')
  .action(() => {
    console.log(`
Reflect on the task you just completed.
1. What were the most complex or repetitive steps?
2. Could any of these steps be automated by a new Raven tool?
3. If yes, consider using 'raven fashion' to create a new tool.

A conforming Raven tool needs:
- A SKILL.md with frontmatter (name, description).
- A flake.nix for reproducible execution via Nix.
- GitHub topics: gemini-skill, raven-tool.
    `);
  });

program.parse();
