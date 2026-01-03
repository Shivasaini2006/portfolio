import React from 'react'
import AnimatedNavbar from './components/AnimatedNavbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Footer from './components/Footer'
import Contact from './components/Contact'
import Admin from './components/admin/Admin'

export default function App() {
  // Simple routing: show admin when path is /admin
  if (typeof window !== 'undefined' && window.location.pathname === '/admin') {
    return <Admin />
  }

  return (
    <div className="min-h-screen flex flex-col pb-24">
      <main className="flex-1">
        {/* Hero Section - Full Width */}
        <section id="home">
          <Hero />
        </section>
        
        {/* Other Sections */}
        <About />
        <Skills />
        
        <div className="container mx-auto px-6">
          <section id="projects">
            <Projects />
          </section>
          <section id="contact">
            <Contact />
          </section>
        </div>
      </main>
      <Footer />
      <AnimatedNavbar />
    </div>
  )
}
