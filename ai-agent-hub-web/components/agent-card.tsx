"use client"

import { useState } from "react"
import { Star, ExternalLink, Github, Shield, Code, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AgentCardProps {
  agent: {
    name: string
    slug: string
    description: string
    highlight?: string
    purpose?: string
    repository: string
    stars: number
    category: string
    originator?: string
    principle?: string
    stack: string[]
    tags: string[]
    reusability?: string
    limitations?: string
    status: "alpha" | "beta" | "production"
    open_source: boolean
    license?: string
    useful_links: string[]
    last_updated: string
    language?: string
    platforms: string[]
  }
  onViewDetails: (agent: any) => void
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    commerce: "🛒",
    payment: "💳",
    finance: "💰",
    productivity: "📝",
    education: "🎓",
    "infra-tools": "🔧",
    "meta-agents": "🤖",
    writing: "✍️",
    "research-and-analysis": "📊",
    lifestyle: "🌟",
    programming: "💻",
    art: "🎨",
    iot: "📡",
    "data-visualization": "📈",
    "social-media": "📱",
    gaming: "🎮",
    "workflow-automation": "⚡",
    marketing: "📢",
    communication: "💬",
    experimental: "🧪",
  }
  return icons[category] || "🤖"
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "production":
      return "bg-green-600/20 text-green-400 border-green-600/30"
    case "beta":
      return "bg-blue-600/20 text-blue-400 border-blue-600/30"
    case "alpha":
      return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
    default:
      return "bg-gray-600/20 text-gray-400 border-gray-600/30"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "production":
      return Shield
    case "beta":
      return Zap
    case "alpha":
      return Code
    default:
      return Code
  }
}

export default function AgentCard({ agent, onViewDetails }: AgentCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const StatusIcon = getStatusIcon(agent.status)

  return (
    <div
      className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer backdrop-blur-sm overflow-hidden
        w-full max-w-sm mx-auto
        h-80 sm:h-80 md:h-80 lg:h-80
        sm:w-80 md:w-80 lg:w-80"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(agent)}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content container with responsive padding */}
      <div className="relative z-10 flex flex-col h-full p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
              {getCategoryIcon(agent.category)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                {agent.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="text-xs capitalize">
                  {agent.category.replace("-", " ")}
                </Badge>
                <div className="flex items-center text-gray-400 text-xs sm:text-sm">
                  <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                  <span className="truncate">{agent.stars}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badges - Responsive layout */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
          <Badge className={`text-xs ${getStatusColor(agent.status)}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">{agent.status}</span>
            <span className="sm:hidden">{agent.status.charAt(0).toUpperCase()}</span>
          </Badge>
          {agent.open_source && (
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs">
              <Code className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Open Source</span>
              <span className="sm:hidden">OSS</span>
            </Badge>
          )}
        </div>

        {/* Description - Responsive text */}
        <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 flex-1 leading-relaxed">
          {agent.highlight || agent.description}
        </p>

        {/* Tags - Responsive display */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
          {agent.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-lg truncate max-w-20 sm:max-w-none"
            >
              {tag}
            </span>
          ))}
          {agent.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-lg">+{agent.tags.length - 2}</span>
          )}
        </div>

        {/* Actions - Fixed at bottom with responsive sizing */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white h-7 sm:h-8 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                window.open(agent.repository, "_blank")
              }}
            >
              <Github className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Code</span>
            </Button>
          </div>

          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-7 sm:h-8 px-2 sm:px-3 text-xs"
          >
            <span className="hidden sm:inline">Details</span>
            <span className="sm:hidden">View</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
