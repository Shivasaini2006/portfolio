import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Footer from './components/Footer'
import Contact from './components/Contact'
import Admin from './components/admin/Admin'
import VantaBackground from './components/VantaBackground'

export default function App() {
  // Simple routing: show admin when path is /admin
  if (typeof window !== 'undefined' && window.location.pathname === '/admin') {
    return <Admin />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section - Full Width */}
        <Hero />
        
        {/* Other Sections - Constrained Width */}
        <div className="container mx-auto px-6">
          <Projects />
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  )
}
