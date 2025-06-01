"use client"

import { useEffect, useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, ShoppingCart, Gamepad2, FileText, Lightbulb, TrendingUp, Target, AlertTriangle, Filter, X, ChevronDown } from "lucide-react"
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
  const [selectedFilterTags, setSelectedFilterTags] = useState<Record<string, string[]>>({})
  const [expandedTagFilters, setExpandedTagFilters] = useState<Record<string, boolean>>({})
  const [showAllTagsForCategory, setShowAllTagsForCategory] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch('/api/agents')
      .then(res => res.json())
      .then((agents: any[]) => {
        const normalized = agents.map(agent => ({
          ...agent,
          stack: agent.stack ?? [],
          tags: agent.tags ?? [],
          platforms: agent.platforms ?? [],
          useful_links: agent.useful_links ?? [],
          last_updated: agent.last_updated ?? '',
          status: agent.status === 'experimental' || !agent.status ? 'alpha' : agent.status,
          open_source: agent.open_source ?? false,
          category: agent.category === 'finance' ? 'payment' : agent.category,
        })) as Agent[];

        const grouped: Record<string, Agent[]> = {}
        normalized.forEach(agent => {
          if (!grouped[agent.category]) grouped[agent.category] = []
          grouped[agent.category].push(agent)
        })

        const cats: Category[] = Object.entries(grouped).map(([id, agents]) => ({
          id,
          name: id,
          agents: agents.sort((a, b) => b.stars - a.stars)
        }))
        setCategories(cats)

        const initialSelectedTags: Record<string, string[]> = {}
        const initialExpandedState: Record<string, boolean> = {};
        const initialShowAllTagsState: Record<string, boolean> = {};
        cats.forEach(cat => {
          initialSelectedTags[cat.id] = []
          initialExpandedState[cat.id] = false;
          initialShowAllTagsState[cat.id] = false;
        })
        setSelectedFilterTags(initialSelectedTags)
        setExpandedTagFilters(initialExpandedState);
        setShowAllTagsForCategory(initialShowAllTagsState);
      })
  }, [])

  const tagsPerCategory = useMemo(() => {
    const calculatedTags: Record<string, string[]> = {}
    categories.forEach(category => {
      const allTagsForCategory = new Set<string>()
      category.agents.forEach(agent => {
        agent.tags.forEach(tag => allTagsForCategory.add(tag))
      })
      calculatedTags[category.id] = Array.from(allTagsForCategory).sort()
    })
    return calculatedTags
  }, [categories])

  const handleTagClick = (categoryId: string, tag: string) => {
    setSelectedFilterTags(prev => {
      const currentSelectedForCategory = prev[categoryId] ? [...prev[categoryId]] : []
      const tagIndex = currentSelectedForCategory.indexOf(tag)
      if (tagIndex > -1) {
        currentSelectedForCategory.splice(tagIndex, 1) // Remove tag
      } else {
        currentSelectedForCategory.push(tag) // Add tag
      }
      return {
        ...prev,
        [categoryId]: currentSelectedForCategory
      }
    })
  }

  const clearCategoryFilters = (categoryId: string) => {
    setSelectedFilterTags(prev => ({
      ...prev,
      [categoryId]: []
    }))
  }

  const toggleTagFilterExpansion = (categoryId: string) => {
    setExpandedTagFilters(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleShowAllTags = (categoryId: string) => {
    setShowAllTagsForCategory(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

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
          {categories.map((category) => {
            const currentCategorySelectedTags = selectedFilterTags[category.id] || []
            const categoryUniqueTags = tagsPerCategory[category.id] || []

            const filteredAgents = currentCategorySelectedTags.length === 0
              ? category.agents
              : category.agents.filter(agent =>
                agent.tags && agent.tags.some(agentTag => currentCategorySelectedTags.includes(agentTag))
              )

            return (
              <div key={category.id} className="relative">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white flex items-center">
                    <span className="truncate">{category.name.toUpperCase()}</span>
                    <span className="ml-2 text-base text-gray-400 font-normal">({filteredAgents.length})</span>
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

                {/* Tags Filter Section */}
                {categoryUniqueTags.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={() => toggleTagFilterExpansion(category.id)}
                        className="flex items-center space-x-2 cursor-pointer group"
                      >
                        <Filter className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                          按标签筛选 ({filteredAgents.length}/{category.agents.length})
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-white transition-all duration-200 ${expandedTagFilters[category.id] ? 'rotate-180' : ''}`} />
                      </button>
                      {currentCategorySelectedTags.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearCategoryFilters(category.id)}
                          className="text-gray-400 hover:text-white h-7 px-2 text-xs"
                        >
                          <X className="w-3 h-3 mr-1" />
                          清除筛选
                        </Button>
                      )}
                    </div>

                    {expandedTagFilters[category.id] ? (
                      // Expanded View: Show all tags for selection
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-2">
                          {(showAllTagsForCategory[category.id]
                            ? categoryUniqueTags
                            : categoryUniqueTags.slice(0, 15)
                          ).map((tag) => {
                            const isSelected = currentCategorySelectedTags.includes(tag)
                            return (
                              <button
                                key={tag}
                                onClick={() => handleTagClick(category.id, tag)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${isSelected
                                  ? "bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-sm"
                                  : "bg-gray-700/50 text-gray-300 border border-gray-600/30 hover:bg-gray-600/50 hover:text-white"
                                  }`}
                              >
                                {tag}
                              </button>
                            )
                          })}
                        </div>
                        {categoryUniqueTags.length > 15 && (
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => toggleShowAllTags(category.id)}
                            className="text-blue-400 hover:text-blue-300 mt-2 px-0 h-auto text-xs"
                          >
                            {showAllTagsForCategory[category.id] ? "收起部分" : `显示全部 (${categoryUniqueTags.length})`}
                          </Button>
                        )}
                      </div>
                    ) : (
                      // Collapsed View: Show selected tags summary (if any)
                      currentCategorySelectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2 pb-2">
                          <span className="text-xs text-gray-400 mr-1">已选:</span>
                          {currentCategorySelectedTags.slice(0, 5).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-blue-600/20 text-blue-300 border-blue-500/30 font-normal px-1.5 py-0.5">
                              {tag}
                            </Badge>
                          ))}
                          {currentCategorySelectedTags.length > 5 && (
                            <Badge variant="secondary" className="text-xs bg-gray-700/50 text-gray-400 border-gray-600/30 font-normal px-1.5 py-0.5">
                              +{currentCategorySelectedTags.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}

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

                {/* Agent Cards */}
                <div id={`category-${category.id}`} className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800/30">
                  {filteredAgents.length > 0 ? (
                    filteredAgents.map((agent) => (
                      <div key={agent.slug} className="flex-none w-72 sm:w-80">
                        <AgentCard agent={agent} onViewDetails={() => setSelectedAgent(agent)} />
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8 w-full">
                      该分类下没有匹配当前筛选标签的代理。
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selectedAgent && <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />}
    </section>
  )
}
