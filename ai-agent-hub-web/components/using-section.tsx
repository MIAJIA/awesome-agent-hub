"use client"

import {
  Brain,
  Bot,
  Database,
  MessageSquare,
  Code,
  Eye,
  Terminal,
  FileSearch,
  Headphones,
  Calendar,
  BarChart,
  Globe,
} from "lucide-react"

const tools = [
  { name: "NeuraTech", description: "Advanced reasoning models", icon: Brain },
  { name: "AgentFlow", description: "Agent orchestration", icon: Bot },
  { name: "VectorDB", description: "Knowledge storage", icon: Database },
  { name: "DialogOS", description: "Conversation design", icon: MessageSquare },
  { name: "CodePilot", description: "Autonomous coding", icon: Code },
  { name: "VisualCore", description: "Image understanding", icon: Eye },
  { name: "CommandAI", description: "System automation", icon: Terminal },
  { name: "DocSense", description: "Document intelligence", icon: FileSearch },
  { name: "SupportGPT", description: "Customer assistance", icon: Headphones },
  { name: "TaskMaster", description: "Project management", icon: Calendar },
  { name: "MetricView", description: "Analytics platform", icon: BarChart },
  { name: "WorldModel", description: "Simulation engine", icon: Globe },
]

export default function UsingSection() {
  return (
    <section id="using" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            What People Are Using
          </span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {tools.map((tool, index) => (
            <div key={index} className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-300 border border-gray-700/50 group-hover:border-cyan-500/50">
                <tool.icon className="w-8 h-8 text-gray-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h4 className="text-white font-semibold mb-2 group-hover:text-cyan-400 transition-colors">{tool.name}</h4>
              <p className="text-gray-400 text-sm">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
