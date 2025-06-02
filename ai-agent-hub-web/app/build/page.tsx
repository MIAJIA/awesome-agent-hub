"use client";

import { useState, useEffect, useMemo } from "react";
import Navigation from "@/components/navigation"
import FeaturedAgents from "@/components/featured-agents"
import FloatingToc from "@/components/FloatingToc"
import { Loader2 } from "lucide-react"

// Define Agent and Category types (can be shared or imported if defined elsewhere centrally)
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
};

type Category = {
  id: string;
  name: string;
  agents: Agent[];
};

export default function HomePage() {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
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
          // Ensure category is a string, default if necessary
          category: typeof agent.category === 'string' && agent.category ? agent.category : 'uncategorized',
        })) as Agent[];

        const grouped: Record<string, Agent[]> = {};
        normalized.forEach(agent => {
          if (!grouped[agent.category]) grouped[agent.category] = [];
          grouped[agent.category].push(agent);
        });

        const cats: Category[] = Object.entries(grouped).map(([id, agents]) => ({
          id,
          name: id, // Or a more display-friendly name if available
          agents: agents.sort((a, b) => b.stars - a.stars)
        }));
        setAllCategories(cats);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch agents:", error);
        setIsLoading(false);
        // Optionally set an error state here
      });
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return allCategories;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();

    return allCategories
      .map(category => {
        const filteredAgents = category.agents.filter(agent => {
          const nameMatch = agent.name?.toLowerCase().includes(lowerSearchTerm);
          const descriptionMatch = agent.description?.toLowerCase().includes(lowerSearchTerm);
          const highlightMatch = agent.highlight?.toLowerCase().includes(lowerSearchTerm);
          const tagsMatch = agent.tags?.some(tag => tag.toLowerCase().includes(lowerSearchTerm));
          // Add more fields to search here if needed, e.g., purpose, originator, stack

          return nameMatch || descriptionMatch || highlightMatch || tagsMatch;
        });

        // If agents were filtered, return the category with only those agents
        if (filteredAgents.length > 0) {
          return { ...category, agents: filteredAgents };
        }
        return null; // Otherwise, this category doesn't match
      })
      .filter(category => category !== null) as Category[]; // Remove nulls (categories with no matching agents)
  }, [allCategories, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <FloatingToc categories={allCategories} />

      <div className="flex">
        <main className="flex-1 lg:ml-60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
            <input
              type="text"
              placeholder="Search for agents by name, description, highlight, tags..."
              className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-10 h-10 animate-spin text-blue-400 mb-4" />
              <span className="text-lg text-gray-400">Loading agents...</span>
            </div>
          ) : (
            <FeaturedAgents categories={filteredCategories} />
          )}
        </main>
      </div>

      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <img src="/awesome_agent_hub_logo.png" alt="Awesome Agent Hub Logo" className="w-8 h-8 rounded-lg object-contain bg-white mr-3" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AgentHub
            </span>
          </div>
          <p className="text-gray-400 mb-6">The premier platform for discovering and sharing AI agents</p>
          <div className="flex justify-center space-x-8 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Documentation
            </a>
            <a href="#" className="hover:text-white transition-colors">
              API
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
