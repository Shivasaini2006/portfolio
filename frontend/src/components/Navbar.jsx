import React, { useState, useEffect } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if admin is logged in
  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem('adminToken')
      setIsAdmin(!!token)
    }
    
    checkAdmin()
    
    // Listen for storage changes (e.g., login/logout in another tab)
    window.addEventListener('storage', checkAdmin)
    
    // Listen for custom login/logout events
    window.addEventListener('adminAuthChanged', checkAdmin)
    
    // Check periodically as a fallback (every 1 second)
    const interval = setInterval(checkAdmin, 1000)
    
    return () => {
      window.removeEventListener('storage', checkAdmin)
      window.removeEventListener('adminAuthChanged', checkAdmin)
      clearInterval(interval)
    }
  }, [])

  return (
    <header className="glass sticky top-0 z-30 border-b border-purple-500/30 backdrop-blur-xl shadow-lg shadow-purple-500/10">
      <div className="container mx-auto px-6 py-5 flex items-center justify-between">
        <a href="#about" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center text-white font-black shadow-lg group-hover:scale-110 transition-transform duration-300">
            S
          </div>
          <h1 className="text-xl font-black gold-gradient-text hidden sm:block">Shiva Saini</h1>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a className="text-cyan-100 hover:text-green-400 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-green-400 after:transition-all" href="#about">About</a>
          <a className="text-cyan-100 hover:text-green-400 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-green-400 after:transition-all" href="#projects">Projects</a>
          <a className="text-cyan-100 hover:text-green-400 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-green-400 after:transition-all" href="#contact">Contact</a>
          {isAdmin && (
            <a className="text-purple-300 hover:text-purple-200 gold-gradient-text font-bold transition flex items-center gap-2" href="/admin">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
              </svg>
              Admin
            </a>
          )}
          <a className="px-6 py-2.5 accent-gradient text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300" href="#contact">Hire Me</a>
        </nav>

        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="p-2 rounded-md border">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              {open ? (
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 6h14a1 1 0 010 2H3a1 1 0 110-2z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-purple-900/20 glass">
          <div className="px-6 py-4 flex flex-col gap-3">
            <a className="hover:text-green-400 transition text-cyan-50" href="#about">About</a>
            <a className="hover:text-green-400 transition text-cyan-50" href="#projects">Projects</a>
            <a className="hover:text-green-400 transition text-cyan-50" href="#contact">Contact</a>
            {isAdmin && (
              <a className="hover:text-green-400 gold-gradient-text font-semibold transition flex items-center gap-2" href="/admin">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                </svg>
                Admin Dashboard
              </a>
            )}
            <a className="inline-block px-4 py-2 accent-gradient text-white rounded-lg font-medium" href="#projects">Work with me</a>
          </div>
        </div>
      )}
    </header>
  )
}
