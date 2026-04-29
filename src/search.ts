import { spawnSync } from 'node:child_process';

export async function search_skills(query: string = '') {
  const searchForTopic = (topic: string) => {
    const fullQuery = query ? `${query} topic:${topic}` : `topic:${topic}`;
    const args = [
      'search',
      'repos',
      fullQuery,
      '--json', 'fullName,description',
    ];
    const result = spawnSync('gh', args, { encoding: 'utf-8' });
    if (result.status !== 0) {
      throw new Error(`gh search failed for topic ${topic}: ${result.stderr}`);
    }
    return JSON.parse(result.stdout);
  };

  const geminiSkills = searchForTopic('gemini-skill');
  const ravenTools = searchForTopic('raven-tool');

  // Merge and deduplicate
  const allRepos = [...geminiSkills, ...ravenTools];
  const uniqueRepos = Array.from(new Map(allRepos.map(repo => [repo.fullName, repo])).values());

  if (uniqueRepos.length === 0) {
    console.log('No skills found matching your query.');
    return;
  }

  console.log('Available Skills:\n');
  uniqueRepos.forEach((repo: any) => {
    console.log(`- ${repo.fullName}: ${repo.description || 'No description'}`);
    console.log('');
  });
}
