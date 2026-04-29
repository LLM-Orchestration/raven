#!/usr/bin/env bun
import { Command } from 'commander';
import { search_skills } from './search.js';
import { fashion } from './fashion.js';
import { execute } from './execute.js';

const program = new Command();

program
  .name('raven')
  .description('Raven - Tool building for Agentic LLMs')
  .version('0.1.0');

program
  .command('search')
  .description('Search for available skills on GitHub')
  .argument('[query]', 'Search term to filter results')
  .action(async (query: string) => {
    try {
      await search_skills(query);
    } catch (error: any) {
      console.error('Error searching skills:', error.message);
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
  .command('execute')
  .description('Execute a Raven tool directly from GitHub using Nix')
  .argument('<toolId>', 'The GitHub repository identifier (e.g., owner/repo)')
  .argument('[args...]', 'Optional arguments to pass to the tool')
  .action(async (toolId: string, args: string[]) => {
    try {
      await execute(toolId, args);
    } catch (error: any) {
      console.error('Error executing tool:', error.message);
      process.exit(1);
    }
  });

program.parse();
