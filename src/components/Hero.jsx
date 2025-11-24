import React from 'react'

export default function Hero() {
  return (
    <section id="about" className="py-16 fade-in-up relative overflow-hidden h-screen flex items-center">
      {/* Blurred Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/shiva.jpg)' }}
        ></div>
        <div className="absolute inset-0 backdrop-blur-sm bg-black/50"></div>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-6 grid gap-10 grid-cols-1 md:grid-cols-2 items-center relative z-10 w-full">
        <div className="text-center md:text-left space-y-6">
          {/* Animated Title Section */}
          <div className="hero-title-container max-w-3xl">
            <span className="hero-title-text">Shiva Saini</span>
            <span className="hero-subtitle-text">
              <a href="https://github.com/Shivasaini2006" target="_blank" rel="noopener noreferrer">
                Full Stack Developer
              </a>
            </span>
          </div>

          <p className="text-xl md:text-2xl text-cyan-100/90 font-light max-w-xl leading-relaxed">
            Full-Stack Developer crafting beautiful, performant web experiences with modern technologies.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            <a href="#projects" className="group px-8 py-4 accent-gradient text-white rounded-xl shadow-2xl hover:shadow-purple-500/50 hover:-translate-y-1 transition-all duration-300 font-semibold text-lg flex items-center gap-2">
              <span>View Projects</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#contact" className="group px-8 py-4 glass border-2 border-purple-500/40 rounded-xl text-purple-50 hover:border-purple-400 hover:bg-purple-500/20 hover:-translate-y-1 transition-all duration-300 font-semibold text-lg backdrop-blur-md">
              Let's Talk
            </a>
            <a
              href="/ShivaResume.pdf"
              download="Shiva_Resume.pdf"
              className="group px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-xl shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all duration-300 font-semibold text-lg flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:animate-bounce" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Resume</span>
            </a>
          </div>
        </div>

        {/* Keep right column empty so the face stays fully visible */}
        <div className="hidden md:block" />
      </div>
    </section>
  )
}
