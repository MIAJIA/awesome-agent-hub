"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, GitBranch, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import NewsletterSubscribeForm from "@/components/NewsletterSubscribeForm"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false)

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
            <img src="/awesome_agent_hub_logo.png" alt="Awesome Agent Hub Logo" className="w-8 h-8 rounded-lg object-contain bg-white" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AgentHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/build" className="text-gray-300 hover:text-white transition-colors">
              Explore Hub
            </Link>

            <Dialog open={isSubscribeModalOpen} onOpenChange={setIsSubscribeModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white">
                  <Mail className="mr-2 h-4 w-4" /> Subscribe
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle className="text-purple-300">Stay Updated</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Subscribe to our newsletter for the latest on AI agents.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <NewsletterSubscribeForm />
                </div>
              </DialogContent>
            </Dialog>

            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" asChild>
              <a
                href="https://github.com/MIAJIA/awesome-open-agents/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Submit Agent
              </a>
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
            <Link href="/" className="block text-gray-300 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="/build" className="block text-gray-300 hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>
              Explore Hub
            </Link>
            <Dialog open={isSubscribeModalOpen} onOpenChange={setIsSubscribeModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white justify-start py-2">
                  <Mail className="mr-2 h-4 w-4" /> Subscribe to Newsletter
                </Button>
              </DialogTrigger>
            </Dialog>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mt-4" asChild>
              <a
                href="https://github.com/MIAJIA/awesome-open-agents/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
              >
                Submit Agent
              </a>
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
