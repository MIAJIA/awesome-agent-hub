"use client";

import { useState, useEffect, useMemo } from "react";
import Navigation from "@/components/navigation"
import FeaturedAgents from "@/components/featured-agents"
import FloatingToc from "@/components/FloatingToc"
import { Loader2, Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  console.log("HomePage initial render: isLoading =", isLoading); // Log initial isLoading

  // New states for search-specific insight
  const [searchInsight, setSearchInsight] = useState<any | null>(null); // Replace 'any' with a more specific type later
  const [searchInsightLoading, setSearchInsightLoading] = useState(false);
  const [searchInsightError, setSearchInsightError] = useState<string | null>(null);

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
        console.log("useEffect fetch success: isLoading set to", false, "current searchTerm:", searchTerm); // Log isLoading and current searchTerm
      })
      .catch(error => {
        console.error("Failed to fetch agents:", error);
        setIsLoading(false);
        console.log("useEffect fetch error: isLoading set to", false, "current searchTerm:", searchTerm); // Log isLoading and current searchTerm
        // Optionally set an error state here
      });
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchTerm(newValue);
    console.log("handleSearchChange: searchTerm set to", newValue); // Log new searchTerm
  };

  const filteredCategories = useMemo(() => {
    console.log("useMemo filteredCategories: computing with searchTerm =", searchTerm, "and allCategories length =", allCategories.length); // Log searchTerm used in useMemo
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

  const handleGenerateSearchInsight = async () => {
    setSearchInsightLoading(true);
    setSearchInsight(null);
    setSearchInsightError(null);

    // Prepare the data to send to the backend
    const agentsToAnalyze = filteredCategories.flatMap(category => category.agents);

    if (agentsToAnalyze.length === 0) {
      setSearchInsightError("No agents found for the current search term to analyze.");
      setSearchInsightLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/insight/from-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerm: searchTerm,
          agents: agentsToAnalyze
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If API returned an error status, use error message from API response or a default
        throw new Error(data.error || `API Error: ${response.status}`);
      }

      setSearchInsight(data); // data should match the structure returned by the mock API

    } catch (error) {
      console.error("Failed to generate search insight:", error);
      if (error instanceof Error) {
        setSearchInsightError(error.message);
      } else {
        setSearchInsightError("An unexpected error occurred while generating insights.");
      }
    } finally {
      setSearchInsightLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <FloatingToc categories={allCategories} />

      <div className="flex">
        <main className="flex-1 lg:ml-60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
            {/* Log before button rendering */}
            {(() => {
              console.log(`Render: Get Insight button check - searchTerm='${searchTerm}', isLoading=${isLoading}`);
              return null; // 返回 null 以满足 ReactNode 类型要求
            })()}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search for agents by name, description, highlight, tags..."
                className="flex-grow px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && !isLoading && (
                <Button
                  onClick={handleGenerateSearchInsight}
                  disabled={searchInsightLoading}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-sm flex items-center whitespace-nowrap"
                >
                  {searchInsightLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5 mr-2" />
                  )}
                  Get Insight
                </Button>
              )}
            </div>
          </div>

          {/* Search Insight Display Area */}
          {searchInsightLoading && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
              <div className="p-4 bg-gray-800/50 rounded-lg shadow-md flex items-center justify-center text-gray-400">
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Generating insights for "{searchTerm}"...
              </div>
            </div>
          )}
          {searchInsightError && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
              <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg shadow-md flex items-center text-red-300">
                <AlertCircle className="w-5 h-5 mr-3" />
                {searchInsightError}
              </div>
            </div>
          )}
          {searchInsight && !searchInsightLoading && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
              <div className="p-5 bg-gradient-to-br from-gray-800 to-gray-800/70 border border-gray-700 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-purple-300 mb-2 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                  {searchInsight.title}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">{searchInsight.generatedText}</p>
              </div>
            </div>
          )}

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
