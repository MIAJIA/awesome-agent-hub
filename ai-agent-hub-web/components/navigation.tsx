"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, GitBranch } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AgentHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("building")}
              className="text-gray-300 hover:text-pink-400 transition-colors"
            >
              Building
            </button>
            <button
              onClick={() => scrollToSection("using")}
              className="text-gray-300 hover:text-cyan-400 transition-colors"
            >
              Using
            </button>
            <button
              onClick={() => scrollToSection("discussing")}
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              Discussing
            </button>
            <Link href="/build" className="text-gray-300 hover:text-white transition-colors">
              Explore Hub
            </Link>
            <Link href="/discussions" className="text-gray-300 hover:text-white transition-colors">
              Community
            </Link>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Submit Agent
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <button
              onClick={() => scrollToSection("building")}
              className="block text-gray-300 hover:text-pink-400 py-2 transition-colors"
            >
              Building
            </button>
            <button
              onClick={() => scrollToSection("using")}
              className="block text-gray-300 hover:text-cyan-400 py-2 transition-colors"
            >
              Using
            </button>
            <button
              onClick={() => scrollToSection("discussing")}
              className="block text-gray-300 hover:text-green-400 py-2 transition-colors"
            >
              Discussing
            </button>
            <Link href="/build" className="block text-gray-300 hover:text-white py-2">
              Explore Hub
            </Link>
            <Link href="/discussions" className="block text-gray-300 hover:text-white py-2">
              Community
            </Link>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mt-4">
              Submit Agent
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
