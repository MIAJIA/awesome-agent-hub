import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function callOpenAI(messages: any[]) {
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
  const llmContent = data.choices[0].message.content;
  console.log('Raw LLM Output:\n', llmContent);
  return llmContent;
}

function readAgentsByCategory(category: string) {
  const files = readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  const agents = files.map(f => {
    const content = readFileSync(join(DATA_DIR, f), 'utf-8');
    try { return JSON.parse(content); } catch { return null; }
  }).filter(Boolean);
  return agents.filter((a: any) => Array.isArray(a.category) ? a.category.includes(category) : a.category === category);
}

interface Insight {
  title: string;
  trends: { title: string; description: string }[];
  innovations: { project: string; innovation: string; description: string }[];
  challenges: string[];
  opportunities: string[];
}

function parseInsightFromLLM(text: string): Insight {
  try {
    const match = text.match(/```json\n([\s\S]*?)\n```/);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse LLM JSON output. Raw text:\n', text);
    return { title: 'Error parsing LLM output', trends: [], innovations: [], challenges: [], opportunities: [] };
  }
}

export async function GET(req: NextRequest, { params }: { params: { category: string } }) {
  const { category } = params;
  if (!OPENAI_API_KEY) return NextResponse.json({ error: 'No OpenAI API key' }, { status: 500 });
  const agents = readAgentsByCategory(category);
  if (!agents.length) return NextResponse.json({ error: 'No agents found for this category' }, { status: 404 });
  // 取 star 数最多的前 10 个
  const topAgents = agents.filter((a: any) => typeof a.stars === 'number').sort((a: any, b: any) => b.stars - a.stars).slice(0, 10);
  const prompt = `Here are several AI agent projects in the "${category}" category. Please analyze and summarize. Output your answer as a JSON object with the following structure: { "title": "string", "trends": [{ "title": "string", "description": "string" }], "innovations": [{ "project": "string", "innovation": "string", "description": "string" }], "challenges": ["string"], "opportunities": ["string"] }\n\n${JSON.stringify(topAgents, null, 2)}`;
  const messages = [
    { role: 'system', content: 'You are an expert AI industry analyst. Always output your answer as a valid JSON object, following the structure specified in the user prompt.' },
    { role: 'user', content: prompt }
  ];
  try {
    const llmText = await callOpenAI(messages);
    const insight = parseInsightFromLLM(llmText);
    return NextResponse.json(insight);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}