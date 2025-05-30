const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

function readAllAgents() {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  const agents = files.map(f => {
    const content = fs.readFileSync(path.join(DATA_DIR, f), 'utf-8');
    try {
      return JSON.parse(content);
    } catch (e) {
      return null;
    }
  }).filter(Boolean);
  return agents;
}

function analyzeCategory(agents, category) {
  // 支持 finance 归并到 payment
  const normalized = agents.map(agent => ({
    ...agent,
    category: agent.category === 'finance' ? 'payment' : agent.category
  }));
  const filtered = normalized.filter(agent => {
    if (Array.isArray(agent.category)) {
      return agent.category.includes(category);
    }
    return agent.category === category;
  });
  if (filtered.length === 0) {
    console.log(`No agents found for category: ${category}`);
    return;
  }
  const stacks = {};
  const tags = {};
  const licenses = {};
  const languages = {};
  let openSource = 0;
  let prodReady = 0;
  let aiBuildsAi = 0;
  let maxStars = 0;
  let superstar = null;
  let multiStack = 0;
  let multiTag = 0;
  let starSum = 0;

  filtered.forEach(agent => {
    // stack
    if (Array.isArray(agent.stack)) {
      agent.stack.forEach(s => {
        stacks[s] = (stacks[s] || 0) + 1;
      });
      if (agent.stack.length > 1) multiStack++;
    }
    // tags
    if (Array.isArray(agent.tags)) {
      agent.tags.forEach(t => {
        tags[t] = (tags[t] || 0) + 1;
      });
      if (agent.tags.length > 3) multiTag++;
    }
    // license
    if (agent.license) {
      licenses[agent.license] = (licenses[agent.license] || 0) + 1;
    }
    // language
    if (agent.language) {
      languages[agent.language] = (languages[agent.language] || 0) + 1;
    }
    // open source
    if (agent.open_source) openSource++;
    // prod ready
    if (agent.status === 'production') prodReady++;
    // AI builds AI
    if ((agent.purpose && /agent|AI|tool/i.test(agent.purpose) && /agent|AI|tool/i.test(agent.description)) || (agent.tags && agent.tags.join(' ').toLowerCase().includes('agent'))) aiBuildsAi++;
    // stars
    if (typeof agent.stars === 'number') {
      starSum += agent.stars;
      if (agent.stars > maxStars) {
        maxStars = agent.stars;
        superstar = agent;
      }
    }
  });

  const avgStars = (starSum / filtered.length).toFixed(1);

  // 输出
  console.log(`--- Insights for category: ${category} ---`);
  console.log(`Total agents: ${filtered.length}`);
  console.log(`Average stars: ${avgStars}`);
  console.log(`Most starred agent: ${superstar ? superstar.name + ' (' + maxStars + ' stars)' : 'N/A'}`);
  if (superstar) {
    console.log(`Superstar agent repo: ${superstar.repository}`);
    console.log(`Highlight: ${superstar.highlight || superstar.description}`);
  }
  console.log('\nTop 3 Tech Stacks:');
  Object.entries(stacks).sort((a,b)=>b[1]-a[1]).slice(0,3).forEach(([s, n])=>console.log(`  ${s}: ${n}`));
  console.log('\n--- End of Insights ---');
}

// 用法: node analyze-agents-by-category.js payment
const agents = readAllAgents();
const category = process.argv[2] || 'payment';
analyzeCategory(agents, category);