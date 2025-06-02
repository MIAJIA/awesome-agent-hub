"use client"

import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const avatars = [
  { initials: "JD", color: "bg-cyan-500" },
  { initials: "KL", color: "bg-pink-500" },
  { initials: "MN", color: "bg-green-500" },
  { initials: "+5", color: "bg-orange-500" },
]

export default function JoinConversation() {
  return (
    <section className="py-20 bg-gray-800/30">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50 w-full max-w-xl">
          <div className="flex -space-x-4 mb-6 justify-center">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`w-12 h-12 ${avatar.color} rounded-full flex items-center justify-center text-white font-semibold border-2 border-gray-800`}
              >
                {avatar.initials}
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold text-white mb-4 text-center">Join the conversation</h3>

          <p className="text-gray-400 mb-6 text-center">
            Connect with builders, researchers, and enthusiasts shaping the future of agent technology.
          </p>

          <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white" asChild>
            <a
              href="https://discord.gg/NKK8JVcakk"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Users className="w-4 h-4 mr-2" />
              Join Community
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}