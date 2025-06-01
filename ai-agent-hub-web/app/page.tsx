import Navigation from "@/components/navigation"
import HeroSection from "@/components/new-hero-section"
import BuildingSection from "@/components/building-section"
import UsingSection from "@/components/using-section"
import DiscussingSection from "@/components/discussing-section"
import SimpleFooter from "@/components/simple-footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <HeroSection />
      <BuildingSection />
      <UsingSection />
      <DiscussingSection />
      <SimpleFooter />
    </div>
  )
}
