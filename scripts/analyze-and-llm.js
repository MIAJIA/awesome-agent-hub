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
  return files.map(f => {
    const content = fs.readFileSync(path.join(DATA_DIR, f), 'utf-8');
    try { return JSON.parse(content); } catch { return null; }
  }).filter(Boolean);
}

async function main() {
  const category = process.argv[2] || 'payment';
  const agents = readAllAgents()
    // 不做归并，保留原始分类
    .filter(agent => Array.isArray(agent.category)
      ? agent.category.includes(category)
      : agent.category === category);

  if (agents.length === 0) {
    console.log(`No agents found for category: ${category}`);
    return;
  }

  // 取 star 数最多的前 10 个
  const topAgents = agents
    .filter(a => typeof a.stars === 'number')
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 10);

  // 组装 prompt
  const prompt = `
Here are several AI agent projects in the "${category}" category. Please analyze and summarize:
- What are the main trends in ${category} agents for AI?
- What is unique or innovative about these projects?
- What do their tech stacks and open source status reveal about the direction of agentic ${category}?
- What are the biggest challenges or opportunities you see from these examples?

${JSON.stringify(topAgents, null, 2)}
`;

  console.log('Calling GPT-4o for insights...');
  const messages = [
    { role: 'system', content: 'You are an expert AI industry analyst.' },
    { role: 'user', content: prompt }
  ];
  // node18+ fetch polyfill
  if (typeof fetch === 'undefined') global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const result = await callOpenAI(messages);
  console.log('\n--- LLM Insights ---\n');
  console.log(result);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
