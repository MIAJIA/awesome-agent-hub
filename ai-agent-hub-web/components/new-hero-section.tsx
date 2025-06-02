"use client"
import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NewHeroSection() {
  // 计算本周周一和周日
  function getCurrentWeekRange() {
    const now = new Date();
    const day = now.getDay() || 7; // 周日为0，设为7
    const monday = new Date(now);
    monday.setDate(now.getDate() - day + 1);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    // 格式化为 yyyy-mm-dd
    const format = (d: Date) => d.toLocaleDateString('en-CA');
    return `${format(monday)} ~ ${format(sunday)}`;
  }

  return (
    <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900/20 py-8 sm:py-12">
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
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-2">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6 text-cyan-400 mr-2" />
          <span className="text-cyan-400 font-medium text-base">Awesome Agent Hub</span>
        </div>

        <p className="text-xs text-gray-400 mb-2">Week: {getCurrentWeekRange()}</p>

        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
          <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
            The Agent World,
          </span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">Decoded</span>
        </h1>

        <p className="text-base md:text-xl text-gray-300 mb-4 max-w-xl mx-auto">
          What's being built, used, and discussed — weekly
        </p>

        {/* Buttons removed, compress space */}
      </div>
    </section>
  )
}
