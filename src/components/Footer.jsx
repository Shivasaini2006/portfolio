import React from 'react'

export default function Footer() {
  return (
    <footer className="glass border-t border-yellow-900/20">
      <div className="container mx-auto px-6 py-8 text-center text-sm text-yellow-100/70">
        <p className="mb-2">© {new Date().getFullYear()} Your Name — Built with React, Vite & Tailwind CSS</p>
        <div className="flex items-center justify-center gap-4">
          <a href="#" className="text-yellow-100/60 hover:text-yellow-400 transition">Twitter</a>
          <a href="#" className="text-yellow-100/60 hover:text-yellow-400 transition">GitHub</a>
          <a href="#" className="text-yellow-100/60 hover:text-yellow-400 transition">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}
