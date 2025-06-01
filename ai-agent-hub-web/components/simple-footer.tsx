"use client"

import { Twitter, Linkedin, Github } from "lucide-react"

export default function SimpleFooter() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-8">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors group"
          >
            <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Follow me on Twitter</span>
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-400 hover:text-blue-600 transition-colors group"
          >
            <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Connect on LinkedIn</span>
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
          >
            <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
