"use client"

import { Star, Users, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AgentCard from "./agent-card"
import { useRouter } from "next/navigation"

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

const projects: Agent[] = [
  {
    name: "LocalAI",
    slug: "mudler-localai",
    description: "Self-hosted, local-first AI platform that runs on consumer-grade hardware without requiring a GPU.",
    highlight: undefined,
    purpose: undefined,
    repository: "https://github.com/mudler/LocalAI",
    stars: 32874,
    category: "infra-tools",
    originator: "mudler",
    principle: undefined,
    stack: ["Go", "Libp2p", "Kubernetes", "Docker"],
    tags: ["AI", "Open Source", "Local"],
    reusability: undefined,
    limitations: undefined,
    status: "alpha",
    open_source: true,
    license: "MIT",
    useful_links: [],
    last_updated: "2025-05-28",
    language: "Go",
    platforms: ["Linux", "Windows", "MacOS", "Docker"],
    downloads: undefined,
    forks: undefined,
    avatar: undefined,
  },
  {
    name: "UI-TARS-desktop",
    slug: "bytedance-ui-tars-desktop",
    description: "Enables computer control through natural language using a Vision-Language Model.",
    highlight: undefined,
    purpose: undefined,
    repository: "https://github.com/bytedance/UI-TARS-desktop",
    stars: 14293,
    category: "productivity",
    originator: "bytedance",
    principle: undefined,
    stack: ["TypeScript", "Electron", "Vite"],
    tags: ["GUI", "Vision", "Agent"],
    reusability: undefined,
    limitations: undefined,
    status: "alpha",
    open_source: true,
    license: "Apache-2.0",
    useful_links: [],
    last_updated: "2025-05-28",
    language: "TypeScript",
    platforms: ["Windows", "macOS", "Linux"],
    downloads: undefined,
    forks: undefined,
    avatar: undefined,
  },
  {
    name: "Goose",
    slug: "block-goose",
    description: "Extensible AI agent framework that allows installation, execution, editing, and testing with any LLM.",
    highlight: undefined,
    purpose: undefined,
    repository: "https://github.com/block/goose",
    stars: 13164,
    category: "meta-agents",
    originator: "block",
    principle: undefined,
    stack: ["Rust", "LLM integrations"],
    tags: ["Framework", "LLM", "Extensible"],
    reusability: undefined,
    limitations: undefined,
    status: "alpha",
    open_source: true,
    license: "Apache-2.0",
    useful_links: [],
    last_updated: "2025-05-29",
    language: "Rust",
    platforms: ["Linux", "macOS", "Windows"],
    downloads: undefined,
    forks: undefined,
    avatar: undefined,
  },
  {
    name: "IntentKit",
    slug: "crestalnetwork-intentkit",
    description: "Open and fair framework for building AI agents with powerful skills.",
    highlight: undefined,
    purpose: undefined,
    repository: "https://github.com/crestalnetwork/intentkit",
    stars: 6417,
    category: "meta-agents",
    originator: "crestalnetwork",
    principle: undefined,
    stack: ["Python", "Blockchain", "Web3"],
    tags: ["Skills", "Python", "Web3"],
    reusability: undefined,
    limitations: undefined,
    status: "alpha",
    open_source: true,
    license: "MIT",
    useful_links: [],
    last_updated: "2025-05-28",
    language: "Python",
    platforms: ["Linux", "Docker"],
    downloads: undefined,
    forks: undefined,
    avatar: undefined,
  },
  {
    name: "Forge",
    slug: "antinomyhq-forge",
    description: "Supports integration with over 300 AI models for pair programming.",
    highlight: undefined,
    purpose: undefined,
    repository: "https://github.com/antinomyhq/forge",
    stars: 2171,
    category: "programming",
    originator: "antinomyhq",
    principle: undefined,
    stack: ["Rust", "Command-line Interface", "AI Model APIs"],
    tags: ["Pair Programming", "Rust", "CLI"],
    reusability: undefined,
    limitations: undefined,
    status: "alpha",
    open_source: true,
    license: "Apache-2.0",
    useful_links: [],
    last_updated: "2025-05-28",
    language: "Rust",
    platforms: ["Linux", "macOS", "Windows"],
    downloads: undefined,
    forks: undefined,
    avatar: undefined,
  },
]

export default function BuildingSection() {
  const router = useRouter();
  return (
    <section id="building" className="py-20 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
            What People Are Building
          </span>
        </h2>

        <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4">
          {projects.map((project) => (
            <div key={project.slug} className="flex-none w-72 sm:w-80">
              <AgentCard agent={project} onViewDetails={() => router.push(`/agent/${project.slug}`)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
