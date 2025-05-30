const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DATA_DIR = path.join(__dirname, '../data');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function callOpenAI(messages) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      max_tokens: 1024,
      temperature: 0.7
    })
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.choices[0].message.content;
}

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

function analyze(agents) {
  const total = agents.length;
  const categories = {};
  const stacks = {};
  const tags = {};
  const licenses = {};
  const languages = {};
  let openSource = 0;
  let prodReady = 0;
  let aiBuildsAi = 0;
  let maxStars = 0;
  let superstar = null;
  let multiCategory = 0;
  let multiStack = 0;
  let multiTag = 0;
  let starSum = 0;

  agents.forEach(agent => {
    // category
    if (Array.isArray(agent.category)) {
      agent.category.forEach(cat => {
        categories[cat] = (categories[cat] || 0) + 1;
      });
      multiCategory++;
    } else {
      categories[agent.category] = (categories[agent.category] || 0) + 1;
    }
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

  // 头部效应
  const avgStars = (starSum / total).toFixed(1);

  // 输出
  console.log('--- AI Agent Industry Insights ---');
  console.log(`Total agents: ${total}`);
  console.log(`Open source: ${openSource} (${((openSource/total)*100).toFixed(1)}%)`);
  console.log(`Production ready: ${prodReady} (${((prodReady/total)*100).toFixed(1)}%)`);
  console.log(`Multi-category agents: ${multiCategory}`);
  console.log(`Multi-stack agents: ${multiStack}`);
  console.log(`Multi-tag (>=4) agents: ${multiTag}`);
  console.log(`Average stars: ${avgStars}`);
  console.log(`Most starred agent: ${superstar ? superstar.name + ' (' + maxStars + ' stars)' : 'N/A'}`);
  console.log(`AI builds AI/tool/agent: ${aiBuildsAi}`);
  console.log('\nTop 5 Categories:');
  Object.entries(categories).sort((a,b)=>b[1]-a[1]).slice(0,5).forEach(([cat, n])=>console.log(`  ${cat}: ${n}`));
  console.log('\nTop 5 Tech Stacks:');
  Object.entries(stacks).sort((a,b)=>b[1]-a[1]).slice(0,5).forEach(([s, n])=>console.log(`  ${s}: ${n}`));
  console.log('\nTop 5 Tags:');
  Object.entries(tags).sort((a,b)=>b[1]-a[1]).slice(0,5).forEach(([t, n])=>console.log(`  ${t}: ${n}`));
  console.log('\nTop 5 Licenses:');
  Object.entries(licenses).sort((a,b)=>b[1]-a[1]).slice(0,5).forEach(([l, n])=>console.log(`  ${l}: ${n}`));
  console.log('\nTop 5 Languages:');
  Object.entries(languages).sort((a,b)=>b[1]-a[1]).slice(0,5).forEach(([lang, n])=>console.log(`  ${lang}: ${n}`));
  if (superstar) {
    console.log(`\nSuperstar agent repo: ${superstar.repository}`);
    console.log(`Highlight: ${superstar.highlight || superstar.description}`);
  }
  console.log('\n--- End of Insights ---');
}

async function trendingLLM() {
  const agents = readAllAgents().filter(a => a.last_updated);
  const sorted = agents.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated)).slice(0, 10);
  const prompt = `\nHere are the 10 most recently updated AI agent projects. Please analyze and summarize:\n- What are the trending topics, technologies, or approaches in the latest AI agent development?\n- What do these updates reveal about the direction of the agent industry?\n- Are there any surprising or innovative patterns among these trending agents?\n\n${JSON.stringify(sorted, null, 2)}\n`;
  const messages = [
    { role: 'system', content: 'You are an expert AI industry analyst.' },
    { role: 'user', content: prompt }
  ];
  if (typeof fetch === 'undefined') global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const result = await callOpenAI(messages);
  console.log('\n--- Trending LLM Insights ---\n');
  console.log(result);
}

async function trendingLLMByCategory(category) {
  const agents = readAllAgents().filter(a => a.last_updated && (
    Array.isArray(a.category) ? a.category.includes(category) : a.category === category
  ));
  const sorted = agents.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated)).slice(0, 10);
  if (sorted.length === 0) {
    console.log(`No agents found for category: ${category}`);
    return;
  }
  const prompt = `\nHere are the 10 most recently updated AI agent projects in the "${category}" category. Please analyze and summarize:\n- What are the trending topics, technologies, or approaches in the latest AI agent development for this category?\n- What do these updates reveal about the direction of the agent industry in this field?\n- Are there any surprising or innovative patterns among these trending agents?\n\n${JSON.stringify(sorted, null, 2)}\n`;
  const messages = [
    { role: 'system', content: 'You are an expert AI industry analyst.' },
    { role: 'user', content: prompt }
  ];
  if (typeof fetch === 'undefined') global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const result = await callOpenAI(messages);
  console.log(`\n--- Trending LLM Insights for category: ${category} ---\n`);
  console.log(result);
}

// 用法: node analyze-agents.js trending [category]
if (process.argv[2] === 'trending') {
  const category = process.argv[3];
  if (category) {
    trendingLLMByCategory(category).catch(e => { console.error(e); process.exit(1); });
  } else {
    trendingLLM().catch(e => { console.error(e); process.exit(1); });
  }
  return;
}

const agents = readAllAgents();
analyze(agents);