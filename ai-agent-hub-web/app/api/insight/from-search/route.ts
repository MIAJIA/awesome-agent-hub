import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
// The API key will be automatically picked up from the OPENAI_API_KEY environment variable
const openai = new OpenAI();

// Define the expected Agent structure (can be imported from a shared types file later)
interface Agent {
  name: string;
  slug: string;
  description: string;
  highlight?: string;
  tags: string[];
  purpose?: string;
  stack: string[];
  limitations?: string;
  useful_links: string[];
}

interface RequestBody {
  searchTerm: string;
  agents: Agent[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as RequestBody;
    const { searchTerm, agents } = body;

    if (!searchTerm || !agents) {
      return NextResponse.json(
        { error: 'Missing searchTerm or agents in request body' },
        { status: 400 }
      );
    }
    if (agents.length === 0) {
      return NextResponse.json(
        { error: 'No agents provided to analyze for insights.' },
        { status: 400 }
      );
    }

    console.log(`[API /api/insight/from-search] Received searchTerm: "${searchTerm}"`);
    console.log(`[API /api/insight/from-search] Received ${agents.length} agents for LLM analysis.`);

    // --- Constructing the prompt for the LLM ---
    let agentSummaries = agents
      .slice(0, 10) // Limit to first 10 agents to manage prompt size/cost
      .map(agent => (
        `  - Name: ${agent.name}\n` +
        `    Description: ${agent.description ? agent.description.substring(0, 150) + '...' : 'N/A'}\n` +
        `    Highlight: ${agent.highlight ? agent.highlight.substring(0, 100) + '...' : 'N/A'}\n` +
        `    Purpose: ${agent.purpose ? agent.purpose.substring(0, 100) + '...' : 'N/A'}\n` +
        `    Stack: ${agent.stack.join(', ')}\n` +
        `    Limitations: ${agent.limitations ? agent.limitations.substring(0, 100) + '...' : 'N/A'}\n` +
        `    Useful Links: ${agent.useful_links.join(', ')}\n` +
        `    Tags: ${agent.tags.join(', ')}`
      )).join('\n\n');

    if (agents.length > 10) {
      agentSummaries += `\n\n  ... and ${agents.length - 10} more agents.`
    }

    const systemPrompt = `You are an expert AI assistant providing insights about AI agents based on user search queries and a list of matching agents. Your goal is to synthesize information and highlight relevant patterns or unique aspects.`;

    const userPrompt = `A user searched for: "${searchTerm}"

The following AI agents (summarized) matched their search:
${agentSummaries}

Please generate a concise (4-6 sentences) and relevant insight based *only* on the provided search term and agent summaries. The insight should focus on:
1. Common themes, capabilities, or technologies observed among these specific agents that directly relate to "${searchTerm}".
2. Any standout features or unique approaches relevant to "${searchTerm}" found in one or more of these agents.
3. Limitations of the agents.
4. Potential trends or patterns if discernible from this limited set of agents concerning "${searchTerm}".
5. Highlight both recurring patterns across agents and any notable outliers in terms of purpose, stack, or limitations related to "${searchTerm}".
6. Techical infrastructure and tools used by the agents.

Do not invent information not present in the agent summaries. The insight should be directly helpful and actionable for someone searching for "${searchTerm}". Output only the generated insight text.`;

    // --- Calling OpenAI API ---
    console.log("[API /api/insight/from-search] Sending request to OpenAI...");
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 150, // Adjust as needed
      temperature: 0.7, // Adjust for creativity vs. factuality
      n: 1, // Number of completions to generate
    });

    const llmResponse = chatCompletion.choices[0]?.message?.content?.trim();

    if (!llmResponse) {
      console.error("[API /api/insight/from-search] LLM returned an empty response.");
      return NextResponse.json(
        { error: 'LLM returned an empty response.' },
        { status: 500 }
      );
    }

    console.log("[API /api/insight/from-search] Received response from OpenAI.");

    const insightData = {
      title: `AI-Powered Insights for: "${searchTerm}"`,
      generatedText: llmResponse,
      // Keywords and confidenceScore could be requested from LLM in a more complex prompt, or derived.
      // For now, we'll keep it simple.
      keywords: [searchTerm],
      modelUsed: 'gpt-3.5-turbo'
    };

    return NextResponse.json(insightData, { status: 200 });

  } catch (error) {
    console.error('[API /api/insight/from-search] Error:', error);
    let errorMessage = 'Internal Server Error';
    let errorDetails = {};

    if (error instanceof OpenAI.APIError) {
      errorMessage = `OpenAI API Error: ${error.status} ${error.name}`;
      errorDetails = {
        type: error.type,
        code: error.code,
        param: error.param,
        openaiMessage: error.message
      };
      console.error('[API /api/insight/from-search] OpenAI API Error Details:', errorDetails);
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: 'Failed to generate insight', details: errorMessage, detailedError: errorDetails },
      { status: 500 }
    );
  }
}