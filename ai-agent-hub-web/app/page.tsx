import Navigation from "@/components/navigation"
import HeroSection from "@/components/new-hero-section"
import BuildingSection from "@/components/building-section"
import UsingSection from "@/components/using-section"
import DiscussingSection from "@/components/discussing-section"
import SimpleFooter from "@/components/simple-footer"
import JoinConversation from "@/components/join-conversation"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <HeroSection />
      <BuildingSection />
      <UsingSection />
      <DiscussingSection />
      <JoinConversation />

      <section className="py-16 bg-gray-800/30">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Stay Updated with Mia's Substack
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-8">
            Subscribe to get the latest news, agent showcases, and community insights delivered directly to your inbox via Substack.
          </p>
          <div className="flex justify-center">
            <Button
              asChild
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
            >
              <a href="https://miajia.substack.com/subscribe" target="_blank" rel="noopener noreferrer">
                <Mail className="mr-2 h-5 w-5" /> Subscribe on Substack
              </a>
            </Button>
          </div>
        </div>
      </section>

      <SimpleFooter />
    </div>
  )
}
