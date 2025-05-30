"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, GitBranch } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
          {/*
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/discover" className="text-gray-300 hover:text-white transition-colors">
              Discover
            </Link>
            <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">
              Browse by Category
            </Link>
            <Link href="/trends" className="text-gray-300 hover:text-white transition-colors">
              Trends
            </Link>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Submit Agent
            </Button>
          </div>
          */}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {/*
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/discover" className="block text-gray-300 hover:text-white py-2">
              Discover
            </Link>
            <Link href="/categories" className="block text-gray-300 hover:text-white py-2">
              Browse by Category
            </Link>
            <Link href="/trends" className="block text-gray-300 hover:text-white py-2">
              Trends
            </Link>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mt-4">
              Submit Agent
            </Button>
          </div>
        )}
        */}
      </div>
    </nav>
  )
}
