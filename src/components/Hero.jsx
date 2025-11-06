import React from 'react'
import VantaBackground from './VantaBackground'

export default function Hero() {
  return (
    <section id="about" className="py-16 fade-in-up relative overflow-hidden min-h-screen flex items-center">
      {/* Vanta.js NET Animation - Only in Hero Section */}
      <VantaBackground />
      
      {/* Hero Content */}
      <div className="container mx-auto px-6 grid gap-10 grid-cols-1 md:grid-cols-2 items-center relative z-10 w-full">
        <div className="text-center md:text-left">
          <div className="inline-block mb-4 px-4 py-2 bg-purple-900/30 border border-purple-700/30 rounded-full text-sm text-purple-200 font-medium">
            👋 Welcome to my portfolio
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 gold-gradient-text">
            Hi — I'm Your Name
          </h2>
          <p className="text-lg text-cyan-100/80 mb-6 max-w-xl">
            I build modern web experiences with React and Tailwind. I care about accessibility, performance, and delightful UI.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <a href="#projects" className="px-6 py-3 accent-gradient text-white rounded-lg shadow-lg hover:shadow-xl hover-scale transition btn-gold-glow">
              See projects
            </a>
            <a href="#contact" className="px-6 py-3 glass border-2 border-purple-900/30 rounded-lg text-purple-50 hover:border-purple-500 hover:bg-purple-900/20 transition">
              Contact me
            </a>
            <a 
              href="/ShivaResume.pdf" 
              download="Shiva_Resume.pdf"
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg shadow-lg hover:shadow-xl hover-scale transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download Resume
            </a>
          </div>
        </div>

        <div className="mx-auto float-animate">
          <div className="relative w-64 h-64 mx-auto md:mx-0">
            <div className="absolute -left-6 -top-6 w-72 h-72 rounded-full bg-gradient-to-br from-purple-500/20 to-green-500/20 opacity-40 blur-3xl gradient-animate"></div>
            <div className="absolute right-0 bottom-0 w-64 h-64 rounded-2xl overflow-hidden pulse-glow glass">
              <div className="w-full h-full bg-gradient-to-br from-purple-500 via-purple-600 to-green-500 gradient-animate flex items-center justify-center text-white">
                <div className="text-center p-6">
                  <div className="w-20 h-20 rounded-full bg-black/20 border-2 border-white/40 mb-4 flex items-center justify-center text-3xl font-bold backdrop-blur-sm">
                    Y
                  </div>
                  <h4 className="text-lg font-semibold">Your Name</h4>
                  <p className="text-sm opacity-90 mt-1">Frontend Developer</p>
                  <p className="text-xs opacity-75 mt-1">React • Tailwind • UI/UX</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
