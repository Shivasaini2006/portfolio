import React from 'react'

function TechPill({ name }) {
  return (
    <span className="text-xs px-3 py-1 bg-purple-900/30 rounded-full text-purple-200 font-medium border border-purple-700/30">
      {name}
    </span>
  )
}

export default function Projects() {
  const [projects, setProjects] = React.useState([])

  React.useEffect(() => {
    loadProjects()
    
    // Listen for storage changes to update projects in real-time
    const handleStorageChange = () => {
      loadProjects()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('projectsUpdated', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('projectsUpdated', handleStorageChange)
    }
  }, [])

  function loadProjects() {
    const savedProjects = localStorage.getItem('portfolioProjects')
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects)
      // Sort by featured first, then by creation date
      const sortedProjects = parsedProjects.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
      setProjects(sortedProjects)
    }
  }

  if (projects.length === 0) {
    return (
      <section id="projects" className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-3 gold-gradient-text">
              Selected Projects
            </h3>
            <p className="text-cyan-100/80">Check out some of my recent work</p>
          </div>
          <div className="text-center py-12 glass rounded-xl border border-purple-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-cyan-100/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-cyan-100/70">No projects yet. Add projects from the admin panel!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-3 gold-gradient-text">
            Selected Projects
          </h3>
          <p className="text-cyan-100/80">Check out some of my recent work</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => (
            <article 
              key={project.id} 
              className="group glass rounded-2xl overflow-hidden hover:translate-y-[-8px] transform transition-all duration-300 hover:shadow-2xl border border-purple-900/20 fade-in-up relative"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-3 right-3 z-10 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                  FEATURED
                </div>
              )}
              
              {/* Project Image */}
              <div className="w-full h-48 relative overflow-hidden bg-gradient-to-br from-purple-900/20 to-green-800/20">
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-cyan-100/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h4 className="font-semibold text-xl mb-2 text-cyan-50 group-hover:text-green-400 transition">
                  {project.title}
                </h4>
                <p className="text-cyan-100/70 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>
                
                {/* Technologies */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {project.technologies.map((tech, idx) => (
                    <TechPill key={idx} name={tech} />
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  {project.liveLink && (
                    <a 
                      href={project.liveLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 accent-gradient text-white rounded-lg font-medium hover:shadow-xl transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                  {project.githubLink && (
                    <a 
                      href={project.githubLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-purple-900/30 text-purple-50 rounded-lg hover:bg-purple-900/20 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
