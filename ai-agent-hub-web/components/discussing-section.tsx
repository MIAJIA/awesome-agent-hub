"use client"

import { TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const discussions = [
  {
    title: "The Future of Agent Autonomy",
    summary:
      "Exploring the balance between autonomous decision-making and human oversight in next-generation agent systems.",
    why: "As agents become more capable, defining appropriate autonomy boundaries will shape how these systems integrate into critical workflows and decision processes.",
  },
  {
    title: "Multi-Agent Collaboration Frameworks",
    summary:
      "Discussing protocols and architectures that enable multiple specialized agents to work together on complex tasks.",
    why: "The ability for agents to collaborate effectively unlocks new possibilities for solving problems that require diverse expertise and perspectives.",
  },
  {
    title: "Agent Memory Systems",
    summary:
      "Comparing approaches to persistent memory, context retention, and knowledge management in long-running agents.",
    why: "Effective memory systems are crucial for agents to maintain coherent understanding over time and build meaningful relationships with users.",
  },
]

const avatars = [
  { initials: "JD", color: "bg-cyan-500" },
  { initials: "KL", color: "bg-pink-500" },
  { initials: "MN", color: "bg-green-500" },
  { initials: "+5", color: "bg-orange-500" },
]

export default function DiscussingSection() {
  return (
    <section id="discussing" className="py-20 bg-gray-800/30">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            What People Are Discussing
          </span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {discussions.map((discussion, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{discussion.title}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{discussion.summary}</p>
                <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4 border-l-4 border-l-green-500">
                  <h4 className="text-green-400 font-medium mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Why it matters
                  </h4>
                  <p className="text-gray-300 text-sm">{discussion.why}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-center">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50">
              <div className="flex -space-x-4 mb-6">
                {avatars.map((avatar, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 ${avatar.color} rounded-full flex items-center justify-center text-white font-semibold border-2 border-gray-800`}
                  >
                    {avatar.initials}
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">Join the conversation</h3>

              <p className="text-gray-400 mb-6">
                Connect with builders, researchers, and enthusiasts shaping the future of agent technology.
              </p>

              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                <Users className="w-4 h-4 mr-2" />
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
