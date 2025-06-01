"use client"

import { Star, Users, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const projects = [
  {
    title: "Autonomous Research Agent",
    description: "Self-directed agent that conducts deep research across multiple domains and synthesizes findings.",
    users: "1.2k",
    rating: "4.8",
    tags: ["Research", "AI"],
    gradient: "from-blue-500 to-purple-600",
  },
  {
    title: "Multi-Modal Content Creator",
    description: "Creates cohesive content across text, image, and audio formats with consistent brand voice.",
    users: "3.4k",
    rating: "4.9",
    tags: ["Content", "Creative"],
    gradient: "from-green-500 to-teal-600",
  },
  {
    title: "Workflow Automation Suite",
    description: "Connects to your tools and automates repetitive tasks with intelligent decision-making.",
    users: "5.7k",
    rating: "4.7",
    tags: ["Productivity", "Business"],
    gradient: "from-orange-500 to-red-600",
  },
  {
    title: "Personal Finance Advisor",
    description: "Analyzes spending patterns and provides personalized financial advice and investment strategies.",
    users: "2.8k",
    rating: "4.6",
    tags: ["Finance", "Personal"],
    gradient: "from-purple-500 to-pink-600",
  },
]

export default function BuildingSection() {
  return (
    <section id="building" className="py-20 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
            What People Are Building
          </span>
        </h2>

        <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 cursor-pointer backdrop-blur-sm overflow-hidden
                flex-none w-72 sm:w-80 h-80"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-red-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content container */}
              <div className="relative z-10 flex flex-col h-full p-6">
                {/* Header with gradient icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${project.gradient} rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
                    >
                      🚀
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-pink-400 transition-colors truncate">
                        {project.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center text-gray-400 text-sm">
                          <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                          <span>{project.rating}</span>
                        </div>
                        <span className="text-gray-500">•</span>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Users className="w-3 h-3 mr-1" />
                          <span>{project.users}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} className="bg-pink-600/20 text-pink-400 border-pink-600/30 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action button - Fixed at bottom */}
                <div className="mt-auto">
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 text-xs"
                  >
                    View Project
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
