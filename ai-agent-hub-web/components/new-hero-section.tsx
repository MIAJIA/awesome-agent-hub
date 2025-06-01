"use client"
import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NewHeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900/20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <Sparkles className="w-8 h-8 text-cyan-400 mr-3" />
          <span className="text-cyan-400 font-medium text-lg">Awesome Agent Hub</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
          <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
            The Agent World,
          </span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">Decoded</span>
        </h1>

        <p className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto">
          What's being built, used, and discussed — weekly
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-xl"
          >
            Explore Agents
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg rounded-xl"
          >
            View Docs
          </Button>
        </div>
      </div>
    </section>
  )
}
