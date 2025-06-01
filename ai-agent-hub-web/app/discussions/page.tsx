"use client"

import React from "react"

import { useState } from "react"
import {
  MessageSquare,
  TrendingUp,
  ExternalLink,
  Search,
  Calendar,
  Hash,
  Twitter,
  Globe,
  Users,
  ArrowUpRight,
  Flame,
  Eye,
  ArrowUp,
  ArrowDown,
  Zap,
  Link2,
  User,
} from "lucide-react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

// 定义讨论帖子的类型
interface DiscussionPost {
  id: string
  source: "reddit" | "hn" | "twitter"
  platform_label: string
  url: string
  title: string
  content: string
  author: string
  created_at: string
  engagement: {
    score: number
    comments: number
    upvotes: number
    downvotes: number
  }
  tags: string[]
  platform_specific?: {
    subreddit?: string
    post_type?: string
  }
  // 额外字段用于UI展示
  category?: string
  trending?: boolean
  trendingScore?: number
  summary?: string
  impact?: string
}

// 模拟讨论数据
const discussions: DiscussionPost[] = [
  {
    id: "reddit-post-123456",
    source: "reddit",
    platform_label: "Reddit",
    url: "https://www.reddit.com/r/AutoGPT/comments/xyz",
    title: "Is anyone using CrewAI in production?",
    content:
      "I've been testing CrewAI for a workflow-based agent orchestration task and I'm impressed with the flexibility it offers compared to other frameworks. The agent role system is intuitive and the task delegation works well for complex workflows. However, I'm concerned about production readiness - has anyone deployed CrewAI in a production environment? What challenges did you face with reliability, error handling, and scaling? Any insights on monitoring and observability would be helpful too.",
    author: "agent_explorer",
    created_at: "2024-06-01T14:22:00Z",
    engagement: {
      score: 153,
      comments: 22,
      upvotes: 160,
      downvotes: 7,
    },
    tags: ["crewai", "production", "multi-agent", "orchestration", "workflows"],
    platform_specific: {
      subreddit: "AutoGPT",
      post_type: "text",
    },
    category: "frameworks",
    trending: true,
    trendingScore: 95,
    summary:
      "The community is discussing production deployment experiences with CrewAI, focusing on reliability, error handling, and scaling challenges. Early adopters report success with smaller workloads but note concerns about monitoring and observability tools which are still maturing.",
    impact:
      "As organizations move from experimentation to production with agent orchestration frameworks, these insights help teams prepare for real-world deployment challenges and set appropriate expectations for operational readiness.",
  },
  {
    id: "hn-post-789012",
    source: "hn",
    platform_label: "Hacker News",
    url: "https://news.ycombinator.com/item?id=789012",
    title: "Vector DBs vs Graph Databases for Agent Memory",
    content:
      "I'm building an agent system that needs to maintain complex memory structures. Currently evaluating whether to use a vector database (Pinecone, Weaviate) or a graph database (Neo4j). Vector DBs seem better for semantic search but graph DBs might be better for relationship modeling. What's your experience?",
    author: "memory_architect",
    created_at: "2024-05-28T09:15:00Z",
    engagement: {
      score: 142,
      comments: 47,
      upvotes: 142,
      downvotes: 0,
    },
    tags: ["memory", "vector-db", "graph-db", "architecture", "performance"],
    platform_specific: {
      post_type: "ask",
    },
    category: "infrastructure",
    trending: false,
    trendingScore: 78,
    summary:
      "Developers are debating optimal memory architectures for AI agents, with vector databases (Pinecone, Weaviate) competing against graph databases (Neo4j, ArangoDB) for storing agent experiences. Vector DB advocates emphasize semantic similarity search, while graph DB supporters highlight relationship modeling and complex query capabilities.",
    impact:
      "Memory architecture directly affects agent performance, cost, and capabilities. The choice influences how agents learn from past interactions, maintain context across sessions, and scale with data growth. This decision is particularly crucial for enterprise deployments where memory efficiency and query performance are paramount.",
  },
  {
    id: "twitter-post-345678",
    source: "twitter",
    platform_label: "Twitter",
    url: "https://twitter.com/openai/status/345678",
    title: "OpenAI Function Calling vs Tool Use API Evolution",
    content:
      "OpenAI's transition from function calling to tool use is causing significant refactoring in our agent framework. The new approach is cleaner but migration is painful. Anyone else dealing with this? #OpenAI #FunctionCalling #ToolUse",
    author: "ai_engineer",
    created_at: "2024-05-25T16:45:00Z",
    engagement: {
      score: 327,
      comments: 54,
      upvotes: 327,
      downvotes: 0,
    },
    tags: ["openai", "function-calling", "tool-use", "api", "migration"],
    category: "apis",
    trending: true,
    trendingScore: 92,
    summary:
      "The transition from OpenAI's function calling to the new 'tool use' paradigm is creating ripple effects across the agent ecosystem. Developers report improved reliability and cleaner abstractions, but migration challenges are significant. The community is split between immediate adoption and waiting for ecosystem stabilization.",
    impact:
      "This API evolution affects every agent framework and library. Early adopters gain access to improved capabilities and future-proofing, but face integration complexity. The timing of migration could determine competitive advantage as the ecosystem consolidates around new standards.",
  },
  {
    id: "reddit-post-567890",
    source: "reddit",
    platform_label: "Reddit",
    url: "https://www.reddit.com/r/cybersecurity/comments/abc",
    title: "New prompt injection attack vector in production agents",
    content:
      "Just discovered a concerning prompt injection vulnerability in our production agent system. Attackers can embed instructions in user-uploaded PDFs that override agent guardrails. We've implemented a sanitization layer, but it's concerning how subtle these attacks can be.",
    author: "security_researcher",
    created_at: "2024-05-20T11:30:00Z",
    engagement: {
      score: 218,
      comments: 35,
      upvotes: 230,
      downvotes: 12,
    },
    tags: ["security", "prompt-injection", "defense", "production", "risk"],
    platform_specific: {
      subreddit: "cybersecurity",
      post_type: "text",
    },
    category: "security",
    trending: false,
    trendingScore: 85,
    summary:
      "Security researchers are sharing increasingly sophisticated prompt injection attacks targeting AI agents, while the community develops countermeasures. Discussion centers on input sanitization, context isolation, and the trade-offs between security and agent capability. New defensive frameworks are emerging but adoption remains inconsistent.",
    impact:
      "Security vulnerabilities in agents pose existential risks for production deployments. Organizations are delaying agent rollouts due to security concerns, creating pressure for robust defensive solutions. The security-capability trade-off is becoming a key differentiator in agent platform selection.",
  },
  {
    id: "hn-post-901234",
    source: "hn",
    platform_label: "Hacker News",
    url: "https://news.ycombinator.com/item?id=901234",
    title: "Our experience running LLM agents locally vs in the cloud",
    content:
      "After 3 months of running our agent system both locally (Ollama + Mistral) and in the cloud (OpenAI), here's our cost and performance analysis. Local setup has 3x higher latency but costs 85% less for our workload. Privacy is the biggest advantage, but maintenance overhead is significant.",
    author: "cloud_architect",
    created_at: "2024-05-15T08:20:00Z",
    engagement: {
      score: 198,
      comments: 63,
      upvotes: 198,
      downvotes: 0,
    },
    tags: ["local", "cloud", "privacy", "cost", "deployment"],
    platform_specific: {
      post_type: "show",
    },
    category: "deployment",
    trending: false,
    trendingScore: 72,
    summary:
      "The community is actively comparing local agent deployments (using Ollama, LocalAI) against cloud solutions (OpenAI, Anthropic). Local advocates emphasize privacy and cost control, while cloud supporters highlight performance and reliability. Hybrid approaches are gaining traction for balancing both concerns.",
    impact:
      "This architectural decision affects operational costs, data privacy compliance, and performance characteristics. Enterprises with strict data governance lean toward local solutions, while startups prioritize cloud agility. The choice influences team skills requirements and infrastructure complexity.",
  },
  {
    id: "twitter-post-678901",
    source: "twitter",
    platform_label: "Twitter",
    url: "https://twitter.com/ai_researcher/status/678901",
    title: "Multi-Modal Agents: Vision + Language Integration Challenges",
    content:
      "Building multi-modal agents is HARD. Our team spent 3 weeks optimizing the vision-language pipeline and still seeing 1.2s latency. Anyone solved the token window management problem elegantly? #MultiModalAI #AgentDevelopment",
    author: "ai_researcher",
    created_at: "2024-06-02T10:15:00Z",
    engagement: {
      score: 276,
      comments: 41,
      upvotes: 276,
      downvotes: 0,
    },
    tags: ["multi-modal", "vision", "language", "integration", "performance"],
    category: "frameworks",
    trending: true,
    trendingScore: 88,
    summary:
      "Developers are exploring multi-modal agent architectures that combine vision and language capabilities. Key challenges include model coordination, latency optimization, and cost management. The community is sharing patterns for effective multi-modal workflows and discussing trade-offs between different integration approaches.",
    impact:
      "Multi-modal capabilities are becoming essential for next-generation agents. Success in this area determines competitive positioning in applications like document processing, visual analysis, and interactive assistance. The integration patterns established now will influence the broader ecosystem.",
  },
]

const categories = [
  { id: "all", name: "All Topics", count: discussions.length },
  { id: "frameworks", name: "Frameworks", count: discussions.filter((d) => d.category === "frameworks").length },
  {
    id: "infrastructure",
    name: "Infrastructure",
    count: discussions.filter((d) => d.category === "infrastructure").length,
  },
  { id: "apis", name: "APIs", count: discussions.filter((d) => d.category === "apis").length },
  { id: "security", name: "Security", count: discussions.filter((d) => d.category === "security").length },
  { id: "deployment", name: "Deployment", count: discussions.filter((d) => d.category === "deployment").length },
]

const getSourceIcon = (source: string) => {
  switch (source) {
    case "twitter":
      return Twitter
    case "reddit":
      return Users
    case "hn":
      return Globe
    default:
      return ExternalLink
  }
}

export default function DiscussionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showTrendingOnly, setShowTrendingOnly] = useState(false)

  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesSearch =
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || discussion.category === selectedCategory
    const matchesTrending = !showTrendingOnly || discussion.trending

    return matchesSearch && matchesCategory && matchesTrending
  })

  // Get top trending discussions for sidebar
  const topTrendingDiscussions = discussions
    .filter((d) => d.trending)
    .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">AgentRadar Discussions</h1>
                  <p className="text-gray-400 text-lg">Community insights on AI agent development</p>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search discussions, topics, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <Button
                  variant={showTrendingOnly ? "default" : "outline"}
                  onClick={() => setShowTrendingOnly(!showTrendingOnly)}
                  className={`${showTrendingOnly
                      ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                      : "border-gray-600 text-gray-300 hover:bg-gray-800"
                    }`}
                >
                  <Flame className="w-4 h-4 mr-2" />
                  Trending
                </Button>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedCategory === category.id
                        ? "bg-blue-600/30 text-blue-300 border border-blue-500/50"
                        : "bg-gray-700/50 text-gray-300 border border-gray-600/30 hover:bg-gray-600/50 hover:text-white"
                      }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-400 text-sm">
                {filteredDiscussions.length} discussion{filteredDiscussions.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* Discussion Cards */}
            <div className="space-y-6">
              {filteredDiscussions.map((discussion) => (
                <article
                  key={discussion.id}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/50 p-6 hover:border-blue-500/30 transition-all duration-300 backdrop-blur-sm"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge
                          className={`${discussion.source === "reddit"
                              ? "bg-orange-600/20 text-orange-400 border-orange-600/30"
                              : discussion.source === "twitter"
                                ? "bg-blue-600/20 text-blue-400 border-blue-600/30"
                                : "bg-gray-600/20 text-gray-400 border-gray-600/30"
                            }`}
                        >
                          {getSourceIcon(discussion.source) && (
                            <div className="mr-1">
                              {React.createElement(getSourceIcon(discussion.source), { size: 12 })}
                            </div>
                          )}
                          {discussion.platform_label}
                        </Badge>
                        <h2 className="text-xl font-semibold text-white leading-tight">{discussion.title}</h2>
                        {discussion.trending && (
                          <Badge className="bg-orange-600/20 text-orange-400 border-orange-600/30">
                            <Flame className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400 mt-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {discussion.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {discussion.engagement.score} score
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {discussion.engagement.comments} comments
                        </div>
                        <div className="flex items-center">
                          <ArrowUp className="w-4 h-4 mr-1" />
                          {discussion.engagement.upvotes} upvotes
                        </div>
                        {discussion.engagement.downvotes > 0 && (
                          <div className="flex items-center">
                            <ArrowDown className="w-4 h-4 mr-1" />
                            {discussion.engagement.downvotes} downvotes
                          </div>
                        )}
                        {discussion.platform_specific?.subreddit && (
                          <div className="flex items-center">
                            <Hash className="w-4 h-4 mr-1" />
                            r/{discussion.platform_specific.subreddit}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-gray-300 leading-relaxed mb-4">{discussion.content}</p>
                    </div>

                    {discussion.summary && (
                      <div>
                        <h3 className="text-sm font-medium text-blue-400 mb-2 flex items-center">
                          <Hash className="w-4 h-4 mr-1" />
                          Community Insights
                        </h3>
                        <p className="text-gray-300 leading-relaxed">{discussion.summary}</p>
                      </div>
                    )}

                    {discussion.impact && (
                      <div>
                        <h3 className="text-sm font-medium text-green-400 mb-2 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Why it matters
                        </h3>
                        <p className="text-gray-300 leading-relaxed">{discussion.impact}</p>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {discussion.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-lg hover:bg-gray-600/50 cursor-pointer transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Original Link */}
                  <div className="border-t border-gray-700/50 pt-4">
                    <a
                      href={discussion.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-700/30 hover:bg-gray-600/50 rounded-lg text-gray-300 hover:text-white transition-colors text-sm group w-fit"
                    >
                      <Link2 className="w-4 h-4" />
                      <span>View original discussion</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {/* Empty State */}
            {filteredDiscussions.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No discussions found</h3>
                <p className="text-gray-400 mb-4">Try adjusting your search terms or filters</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setShowTrendingOnly(false)
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/50 p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-6">
                  <Zap className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-semibold text-white">Top Trending Discussions This Week</h3>
                </div>

                <div className="space-y-4">
                  {topTrendingDiscussions.map((discussion, index) => (
                    <div
                      key={discussion.id}
                      className="p-4 bg-gray-700/30 hover:bg-gray-600/40 rounded-xl transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                            {discussion.title}
                          </h4>
                          <div className="flex items-center space-x-3 mt-2 text-xs text-gray-400">
                            <div className="flex items-center">
                              <Badge
                                className={`${discussion.source === "reddit"
                                    ? "bg-orange-600/20 text-orange-400 border-orange-600/30"
                                    : discussion.source === "twitter"
                                      ? "bg-blue-600/20 text-blue-400 border-blue-600/30"
                                      : "bg-gray-600/20 text-gray-400 border-gray-600/30"
                                  } text-[10px] px-1 py-0`}
                              >
                                {discussion.platform_label}
                              </Badge>
                            </div>
                            <div className="flex items-center">
                              <Flame className="w-3 h-3 mr-1 text-orange-400" />
                              {discussion.trendingScore}
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              {discussion.engagement.comments}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {discussion.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-gray-600/50 text-gray-300 text-xs rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Weekly Stats */}
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">This Week's Activity</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Discussions</span>
                      <span className="text-white font-medium">{discussions.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Trending Topics</span>
                      <span className="text-white font-medium">{discussions.filter((d) => d.trending).length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Score</span>
                      <span className="text-white font-medium">
                        {discussions.reduce((sum, d) => sum + d.engagement.score, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Comments</span>
                      <span className="text-white font-medium">
                        {discussions.reduce((sum, d) => sum + d.engagement.comments, 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Platform Distribution */}
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Platform Distribution</h4>
                  <div className="space-y-2">
                    {["reddit", "twitter", "hn"].map((source) => {
                      const count = discussions.filter((d) => d.source === source).length
                      const percentage = Math.round((count / discussions.length) * 100)
                      return (
                        <div key={source} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400 capitalize">{source}</span>
                            <span className="text-white">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${source === "reddit"
                                  ? "bg-orange-500"
                                  : source === "twitter"
                                    ? "bg-blue-500"
                                    : "bg-gray-400"
                                }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Start a Discussion
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
