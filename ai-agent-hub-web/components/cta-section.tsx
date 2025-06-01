"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-pink-500/10" />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">Ready to orchestrate your agents?</h2>

        <Button
          size="lg"
          className="bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-white px-12 py-4 text-xl rounded-xl"
        >
          Get Started Today
          <ArrowRight className="w-6 h-6 ml-2" />
        </Button>
      </div>
    </section>
  )
}
