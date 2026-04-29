#!/usr/bin/env bun
import { Command } from 'commander';
import { search_skills, get_skill_details } from './search.js';
import { fashion } from './fashion.js';

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

program.parse();
