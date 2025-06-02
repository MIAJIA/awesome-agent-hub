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
  Video,
  FileText,
  Book,
  Mail,
} from "lucide-react"

const tools = [
  { name: "ChatGPT", description: "Advanced reasoning models", icon: Brain },
  { name: "n8n", description: "Workflow automation", icon: Bot },
  { name: "Cursor", description: "AI-first code editor", icon: Code },
  { name: "Fireflies.ai", description: "AI for Meeting Analysis", icon: MessageSquare },
  { name: "ElevenLabs", description: "AI voice generation", icon: Headphones },
  { name: "Synthesia", description: "AI video generation", icon: Video },
  { name: "Quillbot", description: "AI paraphrasing & writing tool", icon: FileText },
  { name: "Midjourney", description: "Image Generation", icon: Eye },
  { name: "Motion", description: "Time Management", icon: Calendar },
  { name: "ThoughtSpot", description: "Analytics platform", icon: BarChart },
  // find mail icon for me
  { name: "Superhuman", description: "Email Assistant", icon: Mail },
  // find notion icon for me
  { name: "Notion AI", description: "AI for Notion", icon: Book },

]
// zapier
//ElevenLabs – AI 语音生成器
// Synthesia	AI Video Generation (Avatars)
//Writer.com	Enterprise AI Content Governance	5% prof. adoption 	Axis #14 Productivity, Forbes AI 50
// 12	Quillbot	AI Paraphrasing & Writing Tool
//Character.AI	Customizable AI Chatbots
// Perplexity	AI Search Engine
// Cursor (Anysphere): A rapidly growing AI-first code editor that allows developers to write and edit code using natural language, showing significant traction and high-value contracts.  
// Fireflies.ai: AI for Meeting Analysis
// In an increasingly remote and hybrid work environment, tools that enhance meeting productivity have become invaluable.
export default function UsingSection() {
  return (
    <section id="using" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
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
