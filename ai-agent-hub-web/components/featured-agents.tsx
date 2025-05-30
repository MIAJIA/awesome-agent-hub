"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, ShoppingCart, Gamepad2, FileText } from "lucide-react"
import AgentCard from "./agent-card"
import AgentDetailModal from "./agent-detail-modal"
import { Button } from "@/components/ui/button"

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
