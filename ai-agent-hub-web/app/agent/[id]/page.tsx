"use client"

import { useEffect, useState } from "react"
import {
  Star,
  Github,
  Play,
  ExternalLink,
  Calendar,
  Shield,
  Code,
  CopyrightIcon as License,
  ArrowLeft,
  Heart,
} from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import AgentCard from "@/components/agent-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// 定义 Agent 类型（可根据 agent.schema.json 进一步细化）
type Agent = {
  name: string;
  slug: string;
  description: string;
  highlight?: string;
  purpose?: string;
  repository: string;
  stars: number;
  category: string;
  originator?: string;
  principle?: string;
  stack?: string[];
  tags?: string[];
  reusability?: string;
  limitations?: string;
  status?: string;
  open_source?: boolean;
  license?: string;
  useful_links?: string[];
  last_updated?: string;
  language?: string;
  platforms?: string[];
  downloads?: number;
  forks?: number;
  avatar?: string;
};

interface AgentDetailPageProps {
  params: { id: string }
}

export default function AgentDetailPage({ params }: AgentDetailPageProps) {
  const [agentData, setAgentData] = useState<Agent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { id } = params

  useEffect(() => {
    fetch(`/api/data/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found")
        return res.json()
      })
      .then(setAgentData)
      .catch((e) => setError(e.message))
  }, [id])

  if (error) {
    return <div className="text-center text-red-400 py-20">Agent not found.</div>
  }
  if (!agentData) {
    return <div className="text-center text-gray-400 py-20">Loading…</div>
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Hub
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50 mb-8 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">
                {agentData.avatar || agentData.slug?.[0]?.toUpperCase() || "🤖"}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{agentData.name}</h1>
                <div className="flex items-center space-x-4 mb-3">
                  <Badge variant="secondary" className="text-sm">
                    {agentData.category}
                  </Badge>
                  <div className="flex items-center text-gray-400">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                    {agentData.stars} stars
                  </div>
                  {agentData.downloads && <><span className="text-gray-400">•</span><span className="text-gray-400">{agentData.downloads.toLocaleString()} downloads</span></>}
                  {agentData.forks && <><span className="text-gray-400">•</span><span className="text-gray-400">{agentData.forks} forks</span></>}
                </div>
                <p className="text-gray-300 text-lg">{agentData.description}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Star className="w-4 h-4 mr-2" />
                Star
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {agentData.status && (
              <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                <Shield className="w-3 h-3 mr-1" />
                {agentData.status}
              </Badge>
            )}
            {agentData.open_source && (
              <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                <Code className="w-3 h-3 mr-1" />
                Open Source
              </Badge>
            )}
          </div>

          <div className="flex space-x-4">
            {agentData.repository && <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" asChild><a href={agentData.repository} target="_blank" rel="noopener noreferrer"><Github className="w-4 h-4 mr-2" />View Repository</a></Button>}
            {agentData.useful_links && agentData.useful_links[0] && <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800" asChild><a href={agentData.useful_links[0]} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-2" />Documentation</a></Button>}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold text-white mb-4">Description</h2>
              <div className="prose prose-invert max-w-none">
                {agentData.description?.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="text-gray-300 leading-relaxed mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
            {agentData.highlight && <div className="bg-gradient-to-br from-yellow-800/30 to-yellow-900/30 rounded-2xl p-6 border border-yellow-700/50 backdrop-blur-sm"><h2 className="text-2xl font-semibold text-yellow-300 mb-4">Highlight</h2><p className="text-yellow-200">{agentData.highlight}</p></div>}
            {agentData.purpose && <div className="bg-gradient-to-br from-blue-800/30 to-blue-900/30 rounded-2xl p-6 border border-blue-700/50 backdrop-blur-sm"><h2 className="text-2xl font-semibold text-blue-300 mb-4">Purpose</h2><p className="text-blue-200">{agentData.purpose}</p></div>}
            {agentData.principle && <div className="bg-gradient-to-br from-purple-800/30 to-purple-900/30 rounded-2xl p-6 border border-purple-700/50 backdrop-blur-sm"><h2 className="text-2xl font-semibold text-purple-300 mb-4">Principle</h2><p className="text-purple-200">{agentData.principle}</p></div>}
            {agentData.reusability && <div className="bg-gradient-to-br from-green-800/30 to-green-900/30 rounded-2xl p-6 border border-green-700/50 backdrop-blur-sm"><h2 className="text-2xl font-semibold text-green-300 mb-4">Reusability</h2><p className="text-green-200">{agentData.reusability}</p></div>}
            {agentData.limitations && <div className="bg-gradient-to-br from-red-800/30 to-red-900/30 rounded-2xl p-6 border border-red-700/50 backdrop-blur-sm"><h2 className="text-2xl font-semibold text-red-300 mb-4">Limitations</h2><p className="text-red-200">{agentData.limitations}</p></div>}
            {agentData.stack && agentData.stack.length > 0 && <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm"><h2 className="text-2xl font-semibold text-white mb-4">Tech Stack</h2><div className="flex flex-wrap gap-3">{agentData.stack.map((tech) => (<Badge key={tech} variant="outline" className="border-blue-600/30 text-blue-400 text-sm px-3 py-1">{tech}</Badge>))}</div></div>}
            {agentData.tags && agentData.tags.length > 0 && <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm"><h2 className="text-2xl font-semibold text-white mb-4">Tags</h2><div className="flex flex-wrap gap-2">{agentData.tags.map((tag) => (<span key={tag} className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-lg hover:bg-gray-600/50 cursor-pointer transition-colors">{tag}</span>))}</div></div>}
            {agentData.useful_links && agentData.useful_links.length > 0 && <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm"><h2 className="text-2xl font-semibold text-white mb-4">Useful Links</h2><ul className="list-disc pl-6 text-blue-300">{agentData.useful_links.map((link, i) => (<li key={i}><a href={link} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400">{link}</a></li>))}</ul></div>}
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between"><span className="text-gray-400 flex items-center"><License className="w-4 h-4 mr-2" />License</span><span className="text-white">{agentData.license}</span></div>
                <div className="flex items-center justify-between"><span className="text-gray-400 flex items-center"><Calendar className="w-4 h-4 mr-2" />Last Updated</span><span className="text-white">{agentData.last_updated}</span></div>
                <div className="flex items-center justify-between"><span className="text-gray-400">Author</span><span className="text-white">{agentData.originator}</span></div>
                {agentData.language && <div className="flex items-center justify-between"><span className="text-gray-400">Language</span><span className="text-white">{agentData.language}</span></div>}
                {agentData.platforms && agentData.platforms.length > 0 && <div className="flex items-center justify-between"><span className="text-gray-400">Platforms</span><span className="text-white">{agentData.platforms.join(", ")}</span></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
