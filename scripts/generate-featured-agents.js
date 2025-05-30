// scripts/generate-featured-agents.js

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const README_PATH = path.join(__dirname, '..', 'README.md');

function loadAgents() {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  return files.map(file => {
    const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
    return { ...data, __file: file };
  });
}

function groupAndSortAgents(agents) {
  const grouped = {};
  for (const agent of agents) {
    const cat = agent.category || 'uncategorized';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(agent);
  }
  for (const cat in grouped) {
    grouped[cat].sort((a, b) => b.stars - a.stars);
    grouped[cat] = grouped[cat].slice(0, 3);
  }
  return grouped;
}

function generateMarkdownBlock(category, agents) {
  const header = `### 🗂 ${category}`;
  const blocks = agents.map(agent => {
    const name = agent.name || agent.slug || '(Unnamed)';
    const repo = agent.repository || '#';
    const stars = agent.stars || 0;
    const description = (agent.description || '').trim();
    const highlight = (agent.highlight || '—').trim();
    const limitation = (agent.limitations || '—').trim();

    return `#### [${name}](${repo}) ★ ${stars} stars
> ${description}

- **Highlight**: ${highlight}
- **Limitation**: ${limitation}`;
  });
  return `${header}\n\n${blocks.join('\n\n')}`;
}

function generateFeaturedMarkdown(groupedAgents) {
  const blocks = Object.entries(groupedAgents).map(
    ([category, agents]) => generateMarkdownBlock(category, agents)
  );
  return `<!-- featured-start -->\n## 🌟 Featured Agents by Category\n\n${blocks.join('\n\n')}\n\n<!-- featured-end -->`;
}

function updateReadme(markdownBlock) {
  let readme = fs.readFileSync(README_PATH, 'utf-8');
  const regex = /<!-- featured-start -->([\s\S]*?)<!-- featured-end -->/;
  if (regex.test(readme)) {
    readme = readme.replace(regex, markdownBlock);
  } else {
    readme += `\n\n${markdownBlock}`;
  }
  fs.writeFileSync(README_PATH, readme, 'utf-8');
  console.log('✅ README.md updated with featured agents.');
}

function main() {
  const agents = loadAgents();
  const grouped = groupAndSortAgents(agents);
  const markdown = generateFeaturedMarkdown(grouped);
  updateReadme(markdown);
}

main();