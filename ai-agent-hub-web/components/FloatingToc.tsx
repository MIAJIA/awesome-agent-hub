"use client";

import { useEffect, useState } from 'react';

type Category = {
  id: string;
  name: string;
  // agents: any[]; // Not strictly needed for TOC itself, but good to keep type consistent if passed around
};

interface FloatingTocProps {
  categories: Category[];
}

export default function FloatingToc({ categories }: FloatingTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Ensure entry.target.id is correctly formatted, e.g., remove "category-title-"
          const cleanId = entry.target.id.replace('category-title-', '');
          setActiveId(cleanId);
        }
      });
    };

    // Fallback for browsers that don't support IntersectionObserver, or if categories are empty
    if (typeof IntersectionObserver === 'undefined' || categories.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "0px 0px -70% 0px", // Adjust this to define when a section is considered "active"
      threshold: 0.1 // At least 10% of the element is visible
    });

    const elements = categories.map(category => document.getElementById(`category-title-${category.id}`)).filter(el => el !== null);
    elements.forEach(el => observer.observe(el!));

    return () => {
      elements.forEach(el => observer.unobserve(el!));
    };
  }, [categories]);

  if (!categories || categories.length === 0) {
    return null; // Don't render if no categories
  }

  return (
    <aside className="fixed top-1/4 left-4 z-50 hidden lg:block w-56 pr-4">
      <nav className="bg-gray-800/70 backdrop-blur-md p-4 rounded-lg shadow-lg border border-gray-700/50 max-h-[calc(100vh-10rem)] overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3 px-2">On this page</h3>
        <ul className="space-y-1">
          {categories.map((category) => (
            <li key={category.id}>
              <a
                href={`#category-title-${category.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(`category-title-${category.id}`)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                  });
                  // Update activeId immediately for better UX, observer will also catch up
                  setActiveId(category.id);
                }}
                className={`block px-2 py-1.5 text-xs rounded-md transition-colors duration-150
                            ${activeId === category.id
                    ? 'bg-blue-500/20 text-blue-300 font-medium border-l-2 border-blue-400 pl-1.5'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
              >
                {category.name.toUpperCase()}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}