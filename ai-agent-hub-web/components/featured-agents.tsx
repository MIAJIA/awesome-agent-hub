"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, ShoppingCart, Gamepad2, FileText, Lightbulb, TrendingUp, Target, AlertTriangle } from "lucide-react"
import AgentCard from "./agent-card"
import AgentDetailModal from "./agent-detail-modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
  stack: string[];
  tags: string[];
  reusability?: string;
  limitations?: string;
  status: 'alpha' | 'beta' | 'production';
  open_source: boolean;
  license?: string;
  useful_links: string[];
  last_updated: string;
  language?: string;
  platforms: string[];
  downloads?: number;
  forks?: number;
  avatar?: string;
}

type Category = {
  id: string;
  name: string;
  agents: Agent[];
}

export default function FeaturedAgents() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [expandedInsights, setExpandedInsights] = useState<Record<string, boolean>>({})
  const [insightData, setInsightData] = useState<Record<string, any>>({})
  const [insightLoading, setInsightLoading] = useState<Record<string, boolean>>({})
  const [insightError, setInsightError] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/agents')
      .then(res => res.json())
      .then((agents: any[]) => {
        // 归一化数组字段和 status 字段
        const normalized = agents.map(agent => ({
          ...agent,
          stack: agent.stack ?? [],
          tags: agent.tags ?? [],
          platforms: agent.platforms ?? [],
          useful_links: agent.useful_links ?? [],
          last_updated: agent.last_updated ?? '',
          status: agent.status === 'experimental' || !agent.status ? 'alpha' : agent.status,
          open_source: agent.open_source ?? false,
          // 合并 finance 到 payment
          category: agent.category === 'finance' ? 'payment' : agent.category,
        })) as Agent[];
        // 按 category 分组
        const grouped: Record<string, Agent[]> = {}
        normalized.forEach(agent => {
          if (!grouped[agent.category]) grouped[agent.category] = []
          grouped[agent.category].push(agent)
        })
        // 转为数组
        const cats: Category[] = Object.entries(grouped).map(([id, agents]) => ({
          id,
          name: id,
          agents: agents.sort((a, b) => b.stars - a.stars)
        }))
        setCategories(cats)
      })
  }, [])

  const scrollCategory = (categoryId: string, direction: "left" | "right") => {
    const container = document.getElementById(`category-${categoryId}`)
    if (container) {
      const scrollAmount = 400 // 可根据需要调整
      const current = container.scrollLeft
      const newPosition =
        direction === "left"
          ? Math.max(0, current - scrollAmount)
          : current + scrollAmount

      container.scrollTo({ left: newPosition, behavior: "smooth" })
    }
  }

  const handleToggleInsight = async (categoryId: string) => {
    setExpandedInsights(prev => ({ ...prev, [categoryId]: !prev[categoryId] }))
    if (!insightData[categoryId] && !insightLoading[categoryId] && !insightError[categoryId]) {
      setInsightLoading(prev => ({ ...prev, [categoryId]: true }))
      setInsightError(prev => ({ ...prev, [categoryId]: '' }))
      try {
        const res = await fetch(`/api/insight/${categoryId}`)
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        setInsightData(prev => ({ ...prev, [categoryId]: data }))
      } catch (e: any) {
        setInsightError(prev => ({ ...prev, [categoryId]: e.message || '加载失败' }))
      } finally {
        setInsightLoading(prev => ({ ...prev, [categoryId]: false }))
      }
    }
  }

  // mock insight 数据
  const mockInsight = {
    title: "行业洞见",
    trends: [
      { title: "趋势1", description: "AI agent 正在快速集成区块链与支付能力。" },
      { title: "趋势2", description: "多智能体协作和自动化成为主流。" }
    ],
    innovations: [
      { project: "AgentKit", innovation: "钱包集成", description: "为 AI agent 提供原生加密钱包能力。" },
      { project: "X402", innovation: "支付协议创新", description: "基于 HTTP 402 的链上支付新范式。" }
    ],
    challenges: ["落地集成难度高", "区块链手续费与延迟"],
    opportunities: ["AI 金融交易市场扩展", "agent 自主能力提升"]
  }

  return (
    <section className="py-8 sm:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Featured Agents by Category</h2>
          <p className="text-gray-400 text-base sm:text-lg">Discover AI agents organized by their primary use cases</p>
        </div>

        <div className="space-y-8 sm:space-y-12">
          {categories.map((category) => (
            <div key={category.id} className="relative">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-white flex items-center">
                  <span className="truncate">{category.name.toUpperCase()}</span>
                  <span className="ml-2 text-base text-gray-400 font-normal">({category.agents.length})</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4 flex items-center gap-1 text-yellow-400 border-yellow-400/40 hover:bg-yellow-400/10"
                    onClick={() => handleToggleInsight(category.id)}
                  >
                    <Lightbulb className="w-4 h-4" />
                    Insight
                  </Button>
                </h3>
                <div className="flex space-x-1 sm:space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => scrollCategory(category.id, "left")}
                    className="text-gray-400 hover:text-white h-8 w-8 sm:h-auto sm:w-auto"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => scrollCategory(category.id, "right")}
                    className="text-gray-400 hover:text-white h-8 w-8 sm:h-auto sm:w-auto"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Insights Section */}
              {expandedInsights[category.id] && (
                <div className="mb-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm overflow-hidden">
                  <div className="p-4 sm:p-6">
                    {/* loading/error/insight 渲染逻辑 */}
                    {insightLoading[category.id] && (
                      <div className="text-center text-gray-400 py-8">LLM 洞见生成中，请稍候…</div>
                    )}
                    {insightError[category.id] && (
                      <div className="text-center text-red-400 py-8">{insightError[category.id]}</div>
                    )}
                    {insightData[category.id] && (
                      <>
                        <h4 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center">
                          <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                          {insightData[category.id].title}
                        </h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Trends */}
                          <div>
                            <h5 className="text-base sm:text-lg font-medium text-blue-400 mb-3 flex items-center">
                              <TrendingUp className="w-4 h-4 mr-2" />
                              Trending
                            </h5>
                            <div className="space-y-3">
                              {insightData[category.id].trends?.map((trend: any, index: number) => (
                                <div key={index} className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                                  <h6 className="text-white font-medium text-sm mb-1">{trend.title}</h6>
                                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{trend.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Innovations */}
                          <div>
                            <h5 className="text-base sm:text-lg font-medium text-green-400 mb-3 flex items-center">
                              <Target className="w-4 h-4 mr-2" />
                              innovations
                            </h5>
                            <div className="space-y-3">
                              {insightData[category.id].innovations?.map((innovation: any, index: number) => (
                                <div key={index} className="p-3 bg-green-600/10 border border-green-600/20 rounded-lg">
                                  <div className="flex items-center justify-between mb-1">
                                    <h6 className="text-white font-medium text-sm">{innovation.project}</h6>
                                    <Badge variant="outline" className="border-green-600/30 text-green-400 text-xs">
                                      {innovation.innovation}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                                    {innovation.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {/* Challenges and Opportunities */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          <div>
                            <h5 className="text-base sm:text-lg font-medium text-yellow-400 mb-3 flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              挑战
                            </h5>
                            <ul className="space-y-2">
                              {insightData[category.id].challenges?.map((challenge: string, index: number) => (
                                <li key={index} className="flex items-start text-gray-300 text-xs sm:text-sm">
                                  <span className="text-yellow-400 mr-2 mt-1">⚠️</span>
                                  {challenge}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-base sm:text-lg font-medium text-purple-400 mb-3 flex items-center">
                              <Target className="w-4 h-4 mr-2" />
                              机会
                            </h5>
                            <ul className="space-y-2">
                              {insightData[category.id].opportunities?.map((opportunity: string, index: number) => (
                                <li key={index} className="flex items-start text-gray-300 text-xs sm:text-sm">
                                  <span className="text-purple-400 mr-2 mt-1">🌱</span>
                                  {opportunity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div
                id={`category-${category.id}`}
                className="flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {category.agents.map((agent) => (
                  <div key={agent.slug} className="flex-none w-72 sm:w-80">
                    <AgentCard agent={agent} onViewDetails={setSelectedAgent} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedAgent && <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />}
    </section>
  )
}
