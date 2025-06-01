import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import FeaturedAgents from "@/components/featured-agents"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <HeroSection />
      <FeaturedAgents />

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold">A</span>
            </div>
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
