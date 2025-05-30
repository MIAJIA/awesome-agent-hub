"use client"

import {
  X,
  Star,
  Github,
  ExternalLink,
  Calendar,
  Shield,
  Code,
  CopyrightIcon as License,
  User,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AgentDetailModalProps {
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
  onClose: () => void
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

export default function AgentDetailModal({ agent, onClose }: AgentDetailModalProps) {
  const StatusIcon = getStatusIcon(agent.status)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] bg-gradient-to-br from-gray-800 to-gray-900 rounded-none sm:rounded-2xl border-0 sm:border border-gray-700 overflow-hidden">
        {/* Header - Responsive */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-2xl flex-shrink-0">
              {getCategoryIcon(agent.category)}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{agent.name}</h2>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                <Badge variant="secondary" className="capitalize text-xs sm:text-sm">
                  {agent.category.replace("-", " ")}
                </Badge>
                <div className="flex items-center text-gray-400 text-sm">
                  <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                  {agent.stars} stars
                </div>
                {agent.originator && (
                  <div className="flex items-center text-gray-400 text-sm">
                    <User className="w-4 h-4 mr-1" />
                    <span className="truncate max-w-32 sm:max-w-none">{agent.originator}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content - Responsive layout */}
        <div className="p-4 sm:p-6 overflow-y-auto h-full sm:h-auto sm:max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column - Description */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">{agent.description}</p>
                {agent.highlight && (
                  <div className="p-3 sm:p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                    <h4 className="text-blue-400 font-medium mb-2 text-sm sm:text-base">✨ Key Highlight</h4>
                    <p className="text-gray-300 text-sm">{agent.highlight}</p>
                  </div>
                )}
              </div>

              {agent.purpose && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Purpose</h3>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{agent.purpose}</p>
                </div>
              )}

              {agent.principle && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">How It Works</h3>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{agent.principle}</p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.stack.map((tech: string) => (
                    <Badge key={tech} variant="outline" className="border-blue-600/30 text-blue-400 text-xs sm:text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 sm:px-3 py-1 bg-gray-700/50 text-gray-300 text-xs sm:text-sm rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Reusability & Limitations</h3>
                <div className="space-y-3">
                  {agent.reusability && (
                    <div className="p-3 sm:p-4 bg-green-600/10 border border-green-600/30 rounded-lg">
                      <h4 className="text-green-400 font-medium mb-2 text-sm sm:text-base">✅ Reusability</h4>
                      <p className="text-gray-300 text-sm">{agent.reusability}</p>
                    </div>
                  )}
                  {agent.limitations && (
                    <div className="p-3 sm:p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                      <h4 className="text-yellow-400 font-medium mb-2 text-sm sm:text-base">⚠️ Limitations</h4>
                      <p className="text-gray-300 text-sm">{agent.limitations}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Metadata */}
            <div className="space-y-4 sm:space-y-6">
              <div className="p-3 sm:p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm"
                    onClick={() => window.open(agent.repository, "_blank")}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View Repository
                  </Button>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center text-sm">
                      <StatusIcon className="w-4 h-4 mr-2" />
                      Status
                    </span>
                    <Badge className={`${getStatusColor(agent.status)} text-xs`}>{agent.status}</Badge>
                  </div>
                  {agent.license && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 flex items-center text-sm">
                        <License className="w-4 h-4 mr-2" />
                        License
                      </span>
                      <span className="text-white text-sm truncate max-w-24 sm:max-w-none">{agent.license}</span>
                    </div>
                  )}
                  {agent.language && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Language</span>
                      <span className="text-white text-sm">{agent.language}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      Updated
                    </span>
                    <span className="text-white text-sm">{agent.last_updated}</span>
                  </div>
                </div>
              </div>

              {agent.platforms.length > 0 && (
                <div className="p-3 sm:p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-3">Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {agent.platforms.map((platform) => (
                      <Badge key={platform} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {agent.open_source && (
                  <div className="flex items-center p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                    <Code className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                    <span className="text-blue-400 font-medium text-sm">Open Source</span>
                  </div>
                )}
              </div>

              {agent.useful_links.length > 0 && (
                <div className="p-3 sm:p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-3">Useful Links</h3>
                  <div className="space-y-2">
                    {agent.useful_links.map((link, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-gray-300 hover:text-white text-sm"
                        onClick={() => window.open(link, "_blank")}
                      >
                        <ExternalLink className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {link.includes("docs") || link.includes("documentation")
                            ? "Documentation"
                            : link.includes("tutorial")
                              ? "Tutorial"
                              : link.includes("community")
                                ? "Community"
                                : "Link"}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
