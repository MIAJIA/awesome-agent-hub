"use client"

import { TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react"
import ReactMarkdown from 'react-markdown'

const discussions = [

  {
    "topic_id": "langgraph-vs-autogen",
    "headline": "Open-source AI agent frameworks face off: LangGraph vs AutoGen vs CrewAI",
    "summary": "The community is actively comparing open-source **LLM agent frameworks** to determine which is best for various tasks. In one detailed rundown, users noted that **AutoGen** excels at autonomous code-writing with self-healing loops, whereas **CrewAI** is praised for its quick start and friendly developer experience:contentReference[oaicite:2]{index=2}. **LangGraph** offers more fine-grained control for complex, multi-tool workflows (great for retrieval-augmented tasks):contentReference[oaicite:3]{index=3}, though this comes at the cost of added complexity. Overall, developers are sharing hard-won insights on when to use each framework – and watching closely how they evolve.",
    "impact": "This debate shows a maturing landscape of agent development tools, with no one-size-fits-all solution. The fact that multiple frameworks are vying for mindshare indicates healthy experimentation in the open-source world. For practitioners, these comparisons are invaluable for picking the right tool for the job (e.g. coding assistant vs. data-heavy research agent). In the bigger picture, the community's feedback will likely shape these projects' direction, pushing them toward more specialized strengths and addressing weaknesses as real-world use cases emerge.",
    "tags": ["LangGraph", "AutoGen", "CrewAI", "AI agents"],
    "created_at": "2025-06-01",
    "mentions": [
      {
        "source": "reddit",
        "url": "https://www.reddit.com/r/LangChain/comments/1g6i7cj/my_thoughts_on_the_most_popular_frameworks_today/"
      }
    ]
  },
  {
    "topic_id": "agent-dev-pain-points",
    "headline": "Developers vent about current agent platforms, call for better frameworks",
    "summary": "A seasoned AI engineer sparked discussion by criticizing today's popular agent frameworks (like LangChain, LangGraph, AutoGen) as **bloated** and built on flawed assumptions:contentReference[oaicite:4]{index=4}. In a candid Reddit post, they describe repeatedly hitting walls in production – citing lack of output predictability and poor 'guardrails' – and have even created their own minimalist framework to solve these pain points. Others chimed in to agree that many agent SDKs feel over-engineered and hard to debug, although a few caution that rolling your own solution isn't a silver bullet either. The conversation highlights growing frustration among developers trying to productize LLM agents. The outcome of this debate will shape which tools become standard – either streamlined patterns like OpenAI's Swarm or more robust frameworks that can balance ease-of-use with reliability.",
    "impact": "These frank critiques matter because they come from developers in the trenches, revealing a gap between hype and reality for AI agents. The difficulty in controlling and maintaining complex agent chains is slowing down real-world adoption. This backlash could spur the next generation of tooling: expect to see frameworks put more emphasis on transparency, testing, and **developer experience**. In the end, solving these pain points will be critical for moving agent applications from neat demos to reliable, at-scale products.",
    "tags": ["developer experience", "frameworks", "AI agents", "productization"],
    "created_at": "2025-06-01",
    "mentions": [
      {
        "source": "reddit",
        "url": "https://www.reddit.com/r/AI_Agents/comments/1jsrmps/fed_up_with_the_state_of_ai_agent_platforms_here/"
      }
    ]
  },
  {
    "topic_id": "coding-agents",
    "headline": "Can autonomous coding agents deliver? Devs share mixed real-world results",
    "summary": "Hacker News users this week debated the effectiveness of letting AI 'agents' handle coding tasks. Many acknowledge that **LLM models** aren't drastically improving right now, but the tooling around them – giving models the ability to run code, test, and iteratively refine – is getting significantly better:contentReference[oaicite:5]{index=5}. Some engineers reported success using headless coding agents that turn high-level tickets into actual pull requests automatically:contentReference[oaicite:6]{index=6}. However, others cautioned that these autonomous coders still require close oversight: in practice they can be slower than a human and often produce convoluted solutions that need heavy cleanup:contentReference[oaicite:7]{index=7}.",
    "impact": "If AI agents can handle meaningful chunks of software development, it would be a paradigm shift in programming productivity. These early discussions suggest we're on the cusp – the tools are improving fast, but not yet trustworthy enough to replace human coders. The **implication** is that near-term, the best results come from human–AI collaboration, with developers setting tasks and reviewing outputs. The excitement around agent-assisted coding is driving companies (and open-source projects) to invest in better integration (IDE plugins, CI pipelines) and could soon redefine how software is built once reliability catches up with capability.",
    "tags": ["coding agents", "developer tools", "automation", "Hacker News"],
    "created_at": "2025-06-01",
    "mentions": [
      {
        "source": "hn",
        "url": "https://news.ycombinator.com/item?id=44127739"
      }
    ]
  },
  {
    "topic_id": "personal-ai-assistants",
    "headline": "The race for a usable personal AI assistant heats up across Reddit and Twitter",
    "summary": "Online forums buzzed with recommendations for AI personal assistant tools to offload daily chores and knowledge work. Enthusiasts touted new entrants like **CUDA**, which can handle emails, calendar management, social posts and even scrape web data for leads:contentReference[oaicite:8]{index=8}. Others suggested sticking with established ecosystems, for example leveraging Microsoft's **365 Copilot** to automate office workflows:contentReference[oaicite:9]{index=9}. The thread also saw multiple founders pitching their own apps (e.g. *Voilà*) promising to draft content, summarize meetings and orchestrate tasks via custom workflows:contentReference[oaicite:10]{index=10} – underscoring how crowded and vibrant this space has become.",
    "impact": "The flurry of 'which assistant is best?' discussion shows a real demand for a reliable AI sidekick in daily life and work. Yet the variety of answers also implies no solution has truly nailed it – a gap that startups and tech giants alike are racing to fill. For the AI agent ecosystem, this personal assistant use-case could be a **killer app** scenario: whichever product manages to seamlessly integrate into users' schedules, communications, and to-do lists will gain a huge edge. In the meantime, users are experimenting with multiple tools, which in turn drives rapid evolution and competition among AI assistant offerings.",
    "tags": ["personal assistant", "productivity", "AI agents", "automation"],
    "created_at": "2025-06-01",
    "mentions": [
      {
        "source": "reddit",
        "url": "https://www.reddit.com/r/ArtificialInteligence/comments/1d3p8lu/whats_the_best_ai_personal_assistant/"
      },
      {
        "source": "twitter",
        "url": "https://twitter.com/agaton/status/1924912924767740334"
      }
    ]
  },
  {
    "topic_id": "agent-production-viability",
    "headline": "Debate erupts over whether autonomous agents are production‑ready or just hype",
    "summary": "A spirited cross-platform discussion asks: has anyone actually deployed AI agents at scale? Many developers admit their **agent systems aren't ready for prime time**, citing persistent hallucinations, context loss, and mix-ups in factual info:contentReference[oaicite:11]{index=11}. In one popular thread, a creator working on a customer support agent confessed it *'doesn't feel production ready at all.'* A few teams claim partial success – for example, deploying a multi-agent pipeline for literature reviews and accounting tasks – but even they had to add *'a lot of scaffolding and verification'* to curb errors, and hallucinations remain *'not a 100% solved problem'*:contentReference[oaicite:12]{index=12}. Some experts advocate breaking tasks into many small, specialized agents to mitigate complexity and errors:contentReference[oaicite:7]{index=7}, but achieving seamless coordination remains challenging.",
    "impact": "This skepticism has big implications for the **agent ecosystem's near-term prospects**. If autonomous AI agents can't be trusted in real-world operations, businesses will be hesitant to invest, and the technology might remain a niche experiment. The dialogue highlights the need for better model reliability and perhaps **hybrid human-in-the-loop designs** before agents can truly take off commercially. It's telling that even well-funded startups struggled – for instance, Adept's founders ended up joining Big Tech to access greater resources:contentReference[oaicite:13]{index=13}:contentReference[oaicite:14]{index=14}. In short, achieving consistency and trust in agent behavior is now seen as the critical hurdle to clear for the next wave of deployment.",
    "tags": ["production", "hallucinations", "enterprise AI", "Adept", "reliability"],
    "created_at": "2025-06-01",
    "mentions": [
      {
        "source": "reddit",
        "url": "https://www.reddit.com/r/singularity/comments/1emfcw3/has_anyone_actually_deployed_ai_agents_in/"
      },
      {
        "source": "reddit",
        "url": "https://www.reddit.com/r/AI_Agents/comments/1kvw3kz/whats_the_most_painful_part_about_building_llm/"
      }
    ]
  },
]

const avatars = [
  { initials: "JD", color: "bg-cyan-500" },
  { initials: "KL", color: "bg-pink-500" },
  { initials: "MN", color: "bg-green-500" },
  { initials: "+5", color: "bg-orange-500" },
]

// 工具函数：清理 contentReference 等无效标记
function cleanSummaryText(input: string): string {
  // Remove all :contentReference[...] patterns
  let cleaned = input.replace(/:contentReference\[.*?\](\{index=\d+\})?/g, '')
  // Remove trailing punctuation and whitespace
  cleaned = cleaned.replace(/[\s:.,;]+$/, '')
  return cleaned.trim()
}

// 对 discussions 数据做一次预处理，summary/impact 清理，但 mentions 保持原始 url
const cleanedDiscussions = discussions.map(discussion => ({
  ...discussion,
  summary: cleanSummaryText(discussion.summary),
  impact: cleanSummaryText(discussion.impact),
  mentions: discussion.mentions ?? []
}))

function renderSummaryWithLinks(summary: string, mentions: { url: string, source: string }[]) {
  // Replace :contentReference[oaicite:X]{index=X} with anchor tags
  const regex = /:contentReference\[oaicite:(\d+)\]\{index=(\d+)\}/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match
  let refCount = 1
  while ((match = regex.exec(summary)) !== null) {
    const [fullMatch, oaiciteIdx, indexStr] = match
    const idx = parseInt(indexStr, 10)
    // Push preceding text
    if (match.index > lastIndex) {
      parts.push(summary.slice(lastIndex, match.index))
    }
    // Insert link if mention exists
    if (mentions && mentions[idx]) {
      parts.push(
        <a
          key={`ref-${idx}-${refCount++}`}
          href={mentions[idx].url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 underline hover:text-green-300 mx-1"
        >
          [ref]
        </a>
      )
    } else {
      parts.push(`[ref?]`)
    }
    lastIndex = match.index + fullMatch.length
  }
  // Push the rest
  if (lastIndex < summary.length) {
    parts.push(summary.slice(lastIndex))
  }
  // Optionally: remove trailing colon if present
  if (typeof parts[parts.length - 1] === 'string') {
    parts[parts.length - 1] = (parts[parts.length - 1] as string).replace(/[:\s]+$/, '')
  }
  return <>{parts}</>
}

export default function DiscussingSection() {
  return (
    <section id="discussing" className="py-20 bg-gray-800/30">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            What People Are Discussing
          </span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {cleanedDiscussions.map((discussion, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{discussion.headline}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {discussion.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-700/60 text-xs text-green-300 rounded-full">{tag}</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  <ReactMarkdown>{discussion.summary}</ReactMarkdown>
                </p>
                <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4 border-l-4 border-l-green-500">
                  <h4 className="text-green-400 font-medium mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Why it matters
                  </h4>
                  <p className="text-gray-300 text-sm">
                    <ReactMarkdown>{discussion.impact}</ReactMarkdown>
                  </p>
                </div>
                {discussion.mentions.length > 0 && (
                  <div className="mt-3 text-xs text-gray-400 flex flex-wrap items-center gap-2">
                    <span className="font-medium text-gray-500">References:</span>
                    {discussion.mentions.map((m, i) => (
                      <a
                        key={i}
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-400 hover:text-blue-300"
                      >
                        [{m.source}{discussion.mentions.length > 1 ? ` #${i + 1}` : ''}]
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
